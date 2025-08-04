// lib/services/room_service.dart

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/room.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// RoomService: 'POST /rooms' 같은 방 관련 API 호출을 담당합니다.
class RoomService {
  // 백엔드 서버의 베이스 URL (환경별로 바꿀 수 있게 수정하세요)
  static const _baseUrl = 'http://127.0.0.1:3000';

  /// 새 방을 생성하는 API 호출
  /// 성공 시 생성된 Room 객체를, 실패 시 예외를 던집니다.
  static Future<Room> createRoom(Room room) async {
    final uri = Uri.parse('$_baseUrl/rooms');
    final body = jsonEncode(room.toJson());
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('authToken');
    if (token == null) {
      print('[RoomService] SharedPreferences에서 토큰을 가져오지 못했습니다. (null)');
      throw Exception('사용자 인증 토큰이 없습니다. 로그인 후 다시 시도하세요.');
    }
    print('[RoomService] SharedPreferences에서 가져온 토큰: $token');

    print('[RoomService] Authorization 헤더: Bearer $token');
    final response = await http.post(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: body,
    );

    if (response.statusCode == 201) {
      // 201 Created: response.body에 새로 생성된 방 정보(JSON)가 담겨 있다고 가정
      final data = jsonDecode(response.body) as Map<String, dynamic>;
      return Room.fromJson(data);
    } else {
      // 실패: statusCode와 body를 포함해 예외로 던집니다.
      throw Exception('방 생성 실패: ${response.statusCode} ${response.body}');
    }
  }

  /// 전체 방 목록 조회 (GET /rooms)
  static Future<List<Room>> fetchRooms() async {
    final uri = Uri.parse('$_baseUrl/rooms');
    final res = await http.get(
      uri,
      headers: {'Content-Type': 'application/json'},
    );
    if (res.statusCode >= 200 && res.statusCode < 300) {
      final List data = jsonDecode(res.body) as List;
      return data.map((e) => Room.fromJson(e as Map<String, dynamic>)).toList();
    } else {
      throw Exception('방 목록 조회 실패: ${res.statusCode}');
    }
  }

  // (선택) 이후 방 목록 조회, 단일 방 조회, 방 삭제 같은 메서드를 추가할 수 있습니다.
}
