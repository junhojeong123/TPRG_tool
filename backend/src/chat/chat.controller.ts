import { Controller, Get, Param, NotFoundException, Body, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { chatmessage } from './entities/chat-message.entity';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('rooms/:roomId/chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('logs')
  async getChatLogsByRoom(
    @Param('roomId') roomId: string,
  ): Promise<chatmessage[]> {
    if (!roomId) {
      throw new NotFoundException('방 ID가 필요합니다.');
    }

    const messages = await this.chatService.getMessages(roomId);

    if (!messages || messages.length === 0) {
      throw new NotFoundException(`방 ${roomId}에 채팅 기록이 없습니다.`);
    }

    return messages;
  }

  @Post()
    async createChat(
    @Param('roomId') roomId: string,
    @Body() dto: CreateChatDto, // { sender, message }
  ) {
    await this.chatService.saveMessage({
      roomCode: roomId,
      senderId: dto.sender,
      nickname: dto.sender,
      message: dto.message,
    });
  return { ok: true };
  }
}