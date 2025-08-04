// lib/screens/create_room_screen.dart

import 'package:flutter/material.dart';
import '../models/room.dart';
import '../services/room_service.dart';
import '../screens/room_screen.dart';

/// CreateRoomScreen: 사용자로부터 방 정보를 입력받아
/// RoomService.createRoom()을 호출해 새로운 방을 만드는 화면입니다.
class CreateRoomScreen extends StatefulWidget {
  static const routeName = '/create-room';

  @override
  _CreateRoomScreenState createState() => _CreateRoomScreenState();
}

class _CreateRoomScreenState extends State<CreateRoomScreen> {
  final _formKey = GlobalKey<FormState>();

  // 화면 상태 변수 (폼에 바인딩)
  String _roomName = '';
  String _password = '';
  bool _isPublic = false;
  int _capacity = 4;

  bool _isLoading = false; // API 호출 중 로딩 인디케이터 표시

  // 인원 수 감소 (최소 1명)
  void _decrementCapacity() {
    if (_capacity > 1) {
      setState(() {
        _capacity--;
        if (_capacity == 1) {
          // 1명인 방은 무조건 개인방
          _isPublic = false;
        }
      });
    }
  }

  // 인원 수 증가 (최대 8명)
  void _incrementCapacity() {
    if (_capacity < 8) {
      setState(() {
        _capacity++;
      });
    }
  }

  // 공개 여부 토글
  void _togglePublic(bool newValue) {
    setState(() {
      // capacity가 1명인 경우 반드시 개인방
      if (_capacity == 1) {
        _isPublic = false;
      } else {
        _isPublic = newValue;
      }
      // 공개방이면 비밀번호는 지워 버리기
      if (_isPublic) {
        _password = '';
      }
    });
  }

  /// 폼 제출: RoomService.createRoom() 호출
  Future<void> _submitForm() async {
    // 1) 폼 검증
    if (!_formKey.currentState!.validate()) return;

    // 2) onSaved 콜백으로 값 저장
    _formKey.currentState!.save();

    setState(() => _isLoading = true);

    try {
      // 3) 모델 객체 생성
      final newRoom = Room(
        name: _roomName,
        password: _password,
        capacity: _capacity,
        isPublic: _isPublic,
      );

      // 4) 서비스 호출
      final created = await RoomService.createRoom(newRoom);

      // 5) 성공 시 사용자에게 안내
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('방 생성 성공! ID=${created.id}')));
      // 방 생성 후 RoomScreen으로 이동
      Navigator.of(
        context,
      ).pushReplacementNamed(RoomScreen.routeName, arguments: created);
    } catch (e) {
      // 실패 시 에러 메시지 표시
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(e.toString())));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('방 만들기')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 1) 방 이름 입력
              TextFormField(
                decoration: InputDecoration(
                  labelText: '방 이름',
                  border: OutlineInputBorder(),
                ),
                maxLength: 100,
                onSaved: (val) => _roomName = val!.trim(),
                validator: (val) {
                  if (val == null || val.trim().isEmpty) {
                    return '방 이름을 입력하세요.';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),

              // 2) 공개 여부 토글
              SwitchListTile(
                title: Text(_isPublic ? '공개' : '개인'),
                subtitle: Text('공개: 누구나 입장 가능 / 개인: 비밀번호 필요'),
                value: _isPublic,
                onChanged: _togglePublic,
              ),
              SizedBox(height: 16),

              // 3) 비밀번호 입력 (개인방일 때만 활성화)
              TextFormField(
                decoration: InputDecoration(
                  labelText: '비밀번호',
                  border: OutlineInputBorder(),
                ),
                enabled: !_isPublic,
                obscureText: true,
                maxLength: 20,
                onSaved: (val) => _password = val!.trim(),
                validator: (val) {
                  if (!_isPublic) {
                    if (val == null || val.trim().isEmpty) {
                      return '개인방 비밀번호를 입력하세요.';
                    }
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),

              // 4) 인원 수 선택
              Text('인원 수 ($_capacity 명)', style: TextStyle(fontSize: 16)),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    icon: Icon(Icons.remove_circle_outline),
                    onPressed: _decrementCapacity,
                  ),
                  SizedBox(width: 24),
                  Text('$_capacity', style: TextStyle(fontSize: 20)),
                  SizedBox(width: 24),
                  IconButton(
                    icon: Icon(Icons.add_circle_outline),
                    onPressed: _incrementCapacity,
                  ),
                ],
              ),
              SizedBox(height: 32),

              // 5) 방 만들기 버튼
              _isLoading
                  ? Center(child: CircularProgressIndicator())
                  : ElevatedButton(
                    onPressed: _submitForm,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      child: Text('방 만들기', style: TextStyle(fontSize: 18)),
                    ),
                  ),
            ],
          ),
        ),
      ),
    );
  }
}
