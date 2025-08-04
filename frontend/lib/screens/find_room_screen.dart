// lib/screens/find_room_screen.dart

import 'package:flutter/material.dart';
import '../models/room.dart';
import '../services/room_service.dart';

class FindRoomScreen extends StatefulWidget {
  static const routeName = '/find-room';

  @override
  _FindRoomScreenState createState() => _FindRoomScreenState();
}

class _FindRoomScreenState extends State<FindRoomScreen> {
  late Future<List<Room>> _roomsFuture;

  @override
  void initState() {
    super.initState();
    _roomsFuture = RoomService.fetchRooms();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('방 찾기')),
      body: FutureBuilder<List<Room>>(
        future: _roomsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('오류: ${snapshot.error}'));
          }
          final rooms = snapshot.data!;
          if (rooms.isEmpty) {
            return Center(child: Text('생성된 방이 없습니다.'));
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: rooms.length,
            separatorBuilder: (_, __) => Divider(),
            itemBuilder: (context, i) {
              final room = rooms[i];
              return ListTile(
                leading: Icon(room.isPublic ? Icons.public : Icons.lock),
                title: Text(room.name),
                subtitle: Text('인원: ${room.capacity}명'),
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {
                  // TODO: 방 입장 로직 (비밀번호 확인 등)
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('방 "${room.name}" 선택됨')),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}
