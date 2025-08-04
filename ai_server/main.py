import re
import random
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import os
from pathlib import Path

from openai import OpenAI
from openai.types.chat import ChatCompletionMessageParam

import json

import uuid
from typing import Dict

# Session state model
class SessionState(BaseModel):
    story_core: dict
    plot_outline: list[dict]
    current_act: int
    history: list[str]

# In-memory session store
sessions: Dict[str, SessionState] = {}

# --- Story Core and Plot Outline Storage ---
story_core: dict = {}
plot_outline: list[dict] = []
current_act: int = 0

# Load .env located alongside this script
load_dotenv(dotenv_path=Path(__file__).parent / ".env")
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

app = FastAPI()

def roll_dice(expr: str) -> tuple[int, str]:
    # Matches patterns like "2d6+1", "d20", "3d4-2"
    match = re.fullmatch(r'(\d*)d(\d+)([+-]\d+)?', expr)
    if not match:
        raise ValueError(f"Invalid dice expression: {expr}")
    count = int(match.group(1)) if match.group(1) else 1
    sides = int(match.group(2))
    modifier = int(match.group(3)) if match.group(3) else 0
    rolls = [random.randint(1, sides) for _ in range(count)]
    total = sum(rolls) + modifier
    detail = f"{rolls}{match.group(3) or ''} = {total}"
    return total, detail

class TRPGRequest(BaseModel):
    session_id: str
    user_input: str
    role: str  # 'keeper' or 'npc'
    situation: str
    character: str

class InitStoryRequest(BaseModel):
    core: dict

@app.post("/trpg/init")
def init_story(request: InitStoryRequest):
    global story_core, plot_outline, current_act
    story_core = request.core
    current_act = 0

    # Generate 5-act outline
    system_msg = { "role": "system", "content": json.dumps(story_core) }
    user_msg = {
        "role": "user",
        "content": "이야기를 5막 구조로 분할해줘. 각 막의 목표와 주요 사건을 간략히 정리해줘."
    }
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[system_msg, user_msg],
        temperature=0.7,
        max_tokens=300,
    )
    # Expect JSON list in response
    try:
        outline = json.loads(response.choices[0].message.content)
    except:
        outline = [{"act": i+1, "description": line} 
            for i, line in enumerate(response.choices[0].message.content.splitlines())]
    plot_outline[:] = outline

    session_id = str(uuid.uuid4())
    # initialize history empty
    initial_history: list[str] = []
    # store session state
    sessions[session_id] = SessionState(
        story_core=story_core,
        plot_outline=plot_outline.copy(),
        current_act=current_act,
        history=initial_history
    )

    return {"session_id": session_id, "outline": plot_outline}

@app.post("/trpg/reply")
def trpg_reply(request: TRPGRequest):
    state = sessions.get(request.session_id)
    if not state:
        return {"error": "Invalid session_id"}

    # Check if user asked for a dice roll, e.g. "roll 2d6+3" or just "2d6+3"
    tokens = request.user_input.strip().split()
    roll_result = None
    roll_detail = None
    for tok in tokens:
        try:
            total, detail = roll_dice(tok)
            roll_result = total
            roll_detail = detail
            break
        except ValueError:
            continue

    # If a roll was performed, respond with the roll detail immediately
    if roll_result is not None:
        state.history.append(request.user_input)
        state.history.append(f"roll: {roll_detail}")
        return {
            "roll": roll_result,
            "detail": roll_detail
        }
    else:
        # Determine AI role: GM vs NPC
        if request.role.upper() == "GM":
            system_role = "너는 TRPG 게임의 진행자(게임 마스터)야."
            next_speaker = "사회자"
        else:
            system_role = f"너는 TRPG 세계의 NPC '{request.character}'이야."
            next_speaker = request.character

        prompt = f"""{system_role}
        지금까지 대화:
        {chr(10).join(state.history)}
        방금 플레이어가 이렇게 말했어:
        {request.user_input}
        다음에 {next_speaker}로서 자연스럽게 응답해줘.
        """

        try:
            messages: list[ChatCompletionMessageParam] = [
                {"role": "user", "content": prompt}
            ]

            response = client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                temperature=0.8,
                max_tokens=150,
            )
            reply = response.choices[0].message.content

            state.history.append(request.user_input)
            state.history.append(f"{next_speaker}: {reply}")

            return {
                "speaker": request.character,
                "reply": reply,
                "emotion": "알 수 없음"
            }
        except Exception as e:
            return {"error": str(e)}

class SceneRequest(BaseModel):
    session_id: str
    act: int

@app.post("/trpg/scene")
def scene(request: SceneRequest):
    state = sessions.get(request.session_id)
    if not state:
        return {"error": "Invalid session_id"}

    # Use current plot outline for the requested act
    act_info = next((a for a in state.plot_outline if a.get("act") == request.act), None)
    if not act_info:
        return {"error": f"Act {request.act} not found in outline."}

    # Build prompt
    system_msg = {
        "role": "system",
        "content": json.dumps({"core": state.story_core, "act": act_info})
    }
    user_msg = {
        "role": "user",
        "content": f"현재까지 대화:\n{chr(10).join(state.history)}\n이제 Act {request.act} 전개를 시작해줘."
    }
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[system_msg, user_msg],
        temperature=0.8,
        max_tokens=300,
    )
    reply = response.choices[0].message.content

    state.history.append(f"Act {request.act} scene: {reply}")
    state.current_act = request.act

    return {
        "act": request.act,
        "description": act_info,
        "scene": reply
    }