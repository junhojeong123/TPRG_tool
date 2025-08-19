import 'dart:math';
import '../services/chat_service.dart';
import '../models/room.dart';
import 'package:flutter/material.dart';
import '../widgets/character_sheet_widget.dart';

class RoomScreen extends StatefulWidget {
  static const String routeName = '/main';

  final Room room;

  const RoomScreen({Key? key, required this.room}) : super(key: key);

  @override
  _RoomScreenState createState() => _RoomScreenState();
}

class _RoomScreenState extends State<RoomScreen> {
  late final ChatService _chatService;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  final TextEditingController _chatController = TextEditingController();

  int? selectedCharacterIndex;
  bool isRightDrawerOpen = false;
  bool isLeftDrawerOpen = false;
  bool isDicePanelOpen = false;
  final List<int> diceFaces = [2, 4, 6, 8, 10, 20, 100];
  Map<int, int> diceCounts = {
    for (var f in [2, 4, 6, 8, 10, 20, 100]) f: 0,
    -1: 0,
  };
  final Map<String, TextEditingController> statControllers = {
    // 탐사자 특성치
    // 탐사자 기능 수치(기본값으로)
    '회계': TextEditingController(text: '5'),
    '위협': TextEditingController(text: '15'),
    '관찰력': TextEditingController(text: '25'),
    '인류학': TextEditingController(text: '1'),
    '도약': TextEditingController(text: '20'),
    '은밀행동': TextEditingController(text: '20'),
    '감정': TextEditingController(text: '5'),
    '모국어': TextEditingController(text: '0'),
    '수영': TextEditingController(text: '20'),
    '고고학': TextEditingController(text: '1'),
    '법률': TextEditingController(text: '5'),
    '투척': TextEditingController(text: '20'),
    '자료조사': TextEditingController(text: '20'),
    '추적': TextEditingController(text: '10'),
    '매혹': TextEditingController(text: '15'),
    '오르기': TextEditingController(text: '20'),
    '듣기': TextEditingController(text: '20'),
    '재력': TextEditingController(text: '0'),
    '열쇠공': TextEditingController(text: '1'),
    '크툴루신화': TextEditingController(text: '0'),
    '기계수리': TextEditingController(text: '10'),
    '변장': TextEditingController(text: '5'),
    '의료': TextEditingController(text: '1'),
    '회피': TextEditingController(text: '0'),
    '자연': TextEditingController(text: '10'),
    '자동차운전': TextEditingController(text: '20'),
    '항법': TextEditingController(text: '10'),
    '전기수리': TextEditingController(text: '10'),
    '오컬트': TextEditingController(text: '5'),
    '말재주': TextEditingController(text: '5'),
    '중장비 조작': TextEditingController(text: '1'),
    '근접전(격투)': TextEditingController(text: '25'),
    '설득': TextEditingController(text: '10'),
    '사격(권총)': TextEditingController(text: '20'),
    '사격(라/산)': TextEditingController(text: '25'),
    '심리학': TextEditingController(text: '10'),
    '정신분석': TextEditingController(text: '1'),
    '응급처치': TextEditingController(text: '30'),
    '승마': TextEditingController(text: '5'),
    '역사': TextEditingController(text: '5'),
    '손놀림': TextEditingController(text: '10'),
  };
  final Map<String, TextEditingController> generalControllers = {
    'name': TextEditingController(),
    'sex': TextEditingController(),
    'age': TextEditingController(),
    'job': TextEditingController(),
    '장비': TextEditingController(),
    '소지품': TextEditingController(),
    '현금': TextEditingController(text: '0'),
  };

  @override
  void initState() {
    super.initState();
    _chatService = ChatService(
      baseUrl: 'http://192.168.0.10:4000',
    ); // Adjust if needed
  }

  void _handleSendClick() async {
    final text = _chatController.text.trim();
    if (text.isEmpty) return;

    try {
      await _chatService.sendChatMessage(
        widget.room.name,
        '플레이어이름', // Replace with actual nickname or user ID if available
        text,
      );
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('채팅이 전송되었습니다!')));
      _chatController.clear();
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('채팅 전송 실패: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      key: _scaffoldKey,
      body: Stack(
        children: [
          // 좌측 핸들
          Positioned(
            left: 0,
            top: screenHeight * 0.5,
            child: Builder(
              builder:
                  (innerContext) => _buildDrawerHandle(
                    onTap:
                        () => setState(() {
                          isLeftDrawerOpen = true;
                        }),
                    icon: Icons.menu,
                  ),
            ),
          ),
          // 우측 핸들
          Positioned(
            right: 0,
            top: screenHeight * 0.5,
            child: Visibility(
              visible: !isRightDrawerOpen,
              child: _buildDrawerHandle(
                onTap:
                    () => setState(() {
                      isRightDrawerOpen = true;
                    }),
                icon: Icons.menu_open,
              ),
            ),
          ),
          if (isLeftDrawerOpen)
            Stack(
              children: [
                Positioned(
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 300,
                  child: _buildLeftDrawer(),
                ),
                Positioned(
                  left: 300,
                  top: MediaQuery.of(context).size.height * 0.5 - 40,
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        isLeftDrawerOpen = false;
                      });
                    },
                    child: Container(
                      width: 40,
                      height: 80,
                      color: Colors.black.withOpacity(0.1),
                      child: Icon(Icons.arrow_back, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          if (isRightDrawerOpen)
            Stack(
              children: [
                Positioned(
                  right: 0,
                  top: 0,
                  bottom: 0,
                  width: 300,
                  child: _buildRightDrawer(context),
                ),
                Positioned(
                  right: 300,
                  top: MediaQuery.of(context).size.height * 0.5 - 40,
                  child: GestureDetector(
                    onTap: () {
                      setState(() {
                        isRightDrawerOpen = false;
                      });
                    },
                    child: Container(
                      width: 40,
                      height: 80,
                      color: Colors.black.withOpacity(0.1),
                      child: Icon(Icons.arrow_forward, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          if (selectedCharacterIndex != null)
            Positioned(
              right: 300,
              top: 100,
              child: SizedBox(
                height: 500,
                width: 280,
                child: SingleChildScrollView(
                  child: CharacterSheetWidget(
                    name: generalControllers['name']!.text,
                    hp: 11,
                    maxHp: 11,
                    mp: 4,
                    maxMp: 9,
                    statControllers: statControllers,
                    generalControllers: generalControllers,
                    onClose: () {
                      setState(() {
                        selectedCharacterIndex = null;
                      });
                    },
                    onSave: _saveCharacter,
                  ),
                ),
              ),
            ),
          if (isDicePanelOpen)
            Positioned(
              right: 300,
              top: 100,
              child: SizedBox(
                width: 300,
                child: Material(
                  elevation: 8,
                  borderRadius: BorderRadius.circular(16),
                  color: Colors.white,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '주사위 패널',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 8),
                        GridView.count(
                          crossAxisCount: 4,
                          shrinkWrap: true,
                          mainAxisSpacing: 8,
                          crossAxisSpacing: 8,
                          children:
                              diceFaces
                                  .map(
                                    (face) => GestureDetector(
                                      onTap:
                                          () => setState(
                                            () =>
                                                diceCounts[face] =
                                                    diceCounts[face]! + 1,
                                          ),
                                      onSecondaryTap:
                                          () => setState(
                                            () =>
                                                diceCounts[face] = max(
                                                  0,
                                                  diceCounts[face]! - 1,
                                                ),
                                          ),
                                      child: Container(
                                        decoration: BoxDecoration(
                                          border: Border.all(),
                                          borderRadius: BorderRadius.circular(
                                            8,
                                          ),
                                        ),
                                        child: Stack(
                                          alignment: Alignment.center,
                                          children: [
                                            Text('d$face'),
                                            if (diceCounts[face]! > 0)
                                              Positioned(
                                                top: 4,
                                                right: 4,
                                                child: CircleAvatar(
                                                  radius: 10,
                                                  child: Text(
                                                    '${diceCounts[face]}',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                    ),
                                                  ),
                                                ),
                                              ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  )
                                  .toList(),
                        ),
                        SizedBox(height: 8),
                        ElevatedButton(
                          onPressed: () {
                            // TODO: Implement roll logic
                            // Close panel:
                            setState(() => isDicePanelOpen = false);
                          },
                          child: Text('굴리기'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          // 메인 컨텐츠 + 채팅 입력 영역
          Column(
            children: [
              Expanded(
                child: Center(child: Text('', style: TextStyle(fontSize: 28))),
              ),
              // 하단 채팅 입력 영역
              Container(
                padding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                color: Color(0xFFF0F0F0),
                child: Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _chatController,
                        decoration: InputDecoration(
                          hintText: '채팅을 입력하기...',
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(20),
                            borderSide: BorderSide(color: Colors.grey.shade400),
                          ),
                          isDense: true,
                        ),
                        onSubmitted: (_) => _handleSendClick(),
                      ),
                    ),
                    SizedBox(width: 8),
                    InkWell(
                      onTap: () => setState(() => isDicePanelOpen = true),
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade700,
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Icon(
                            Icons.play_arrow,
                            color: Colors.white,
                            size: 24,
                          ),
                        ),
                      ),
                    ),
                    SizedBox(width: 8),
                    InkWell(
                      onTap: _handleSendClick,
                      borderRadius: BorderRadius.circular(20),
                      child: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade700,
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Icon(
                            Icons.play_arrow,
                            color: Colors.white,
                            size: 24,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 좌측 Drawer (NPC/오브젝트 추가)
  Widget _buildLeftDrawer() {
    return Container(
      color: Colors.white,
      child: Column(
        children: [
          Expanded(
            child: Center(
              child: ElevatedButton(
                onPressed: () {},
                child: Text('NPC 추가'),
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                ),
              ),
            ),
          ),
          Divider(height: 1),
          Expanded(
            child: Center(
              child: ElevatedButton(
                onPressed: () {},
                child: Text('오브젝트 추가하기'),
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 우측 Drawer (캐릭터 관리)
  Widget _buildRightDrawer(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          // 캐릭터 추가 버튼
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton.icon(
              onPressed: () => _addCharacter(context),
              icon: Icon(Icons.add),
              label: Text('캐릭터 추가'),
              style: ElevatedButton.styleFrom(
                minimumSize: Size(double.infinity, 50),
              ),
            ),
          ),
          Divider(height: 1),
          // 캐릭터 리스트 (스크롤 가능)
          Expanded(
            child: ListView.builder(
              itemCount: 3, // 임시 데이터
              itemBuilder: (context, index) => _buildCharacterCard(index),
            ),
          ),
        ],
      ),
    );
  }

  // 캐릭터 카드 위젯
  Widget _buildCharacterCard(int index) {
    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () {
        setState(() {
          selectedCharacterIndex = index;
        });
      },
      child: Card(
        margin: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '# 十',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 8),
              Text('HP 11/11', style: TextStyle(color: Colors.red)),
              Text('MP 4/9', style: TextStyle(color: Colors.blue)),
            ],
          ),
        ),
      ),
    );
  }

  // 캐릭터 추가 함수
  void _addCharacter(BuildContext context) {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('새 캐릭터가 추가되었습니다!')));
  }

  void _saveCharacter() {
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('저장 버튼이 눌렸습니다!')));
  }

  // Drawer 핸들 위젯
  Widget _buildDrawerHandle({
    required VoidCallback onTap,
    required IconData icon,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 40,
        height: 80,
        color: Colors.black.withOpacity(0.1),
        child: Icon(icon, color: Colors.white),
      ),
    );
  }

  @override
  void dispose() {
    _chatController.dispose();
    // 해제: 일반 컨트롤러
    for (final c in generalControllers.values) {
      c.dispose();
    }
    super.dispose();
  }
}
