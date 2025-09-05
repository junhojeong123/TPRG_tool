// lib/services/room_service.dart

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:http/browser_client.dart' as http_browser;

import '../models/room.dart';

/// RoomService: 방 관련 API 호출을 담당합니다.
class RoomService {
  // 🔧 프로젝트 전반과 주소를 통일하세요 (room_screen.dart의 주소와 같게)
  static const String _baseUrl = 'http://192.168.0.10:4000';

  /// HTTP 클라이언트 (웹일 때는 쿠키 전송을 위해 withCredentials=true)
  static http.Client _client() {
    if (kIsWeb) {
      final c = http_browser.BrowserClient()..withCredentials = true;
      return c;
    }
    return http.Client();
  }

  /// 공통 헤더 생성 (토큰이 있으면 Authorization 부착)
  static Future<Map<String, String>> _headers({ bool withAuth = true }) async {
    final headers = <String, String>{'Content-Type': 'application/json'};
    if (withAuth) {
      try {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('authToken');
        if (token != null && token.isNotEmpty) {
          headers['Authorization'] = 'Bearer $token';
        }
      } catch (_) {}
    }
    return headers;
  }

  // ------------------------
  // 방 생성: POST /rooms
  // 요청: { name, password, maxParticipants }
  // 응답: { message, room: { ... } } 또는 { ... }
  // ------------------------
  static Future<Room> createRoom(Room room) async {
    final uri = Uri.parse('$_baseUrl/rooms');
    final client = _client();
    try {
      final res = await client.post(
        uri,
        headers: await _headers(withAuth: true),
        body: jsonEncode(room.toCreateJson()),
      );

      if (res.statusCode >= 200 && res.statusCode < 300) {
        final body = jsonDecode(res.body) as Map<String, dynamic>;
        return Room.fromJson(body);
      }
      throw Exception('방 생성 실패: ${res.statusCode} ${res.body}');
    } finally {
      client.close();
    }
  }

  // ------------------------
  // 방 상세 조회: GET /rooms/:roomId
  // ------------------------
  static Future<Room> getRoomById(String roomId) async {
    final uri = Uri.parse('$_baseUrl/rooms/$roomId');
    final client = _client();
    try {
      final res = await client.get(
        uri,
        headers: await _headers(withAuth: true),
      );

      if (res.statusCode >= 200 && res.statusCode < 300) {
        final body = jsonDecode(res.body) as Map<String, dynamic>;
        return Room.fromJson(body);
      }
      throw Exception('방 조회 실패: ${res.statusCode} ${res.body}');
    } finally {
      client.close();
    }
  }

  // ------------------------
  // 방 참가: POST /rooms/:roomId/join  (body: { password })
  // 응답: { message, room }
  // ------------------------
  static Future<Room> joinRoom(String roomId, { required String password }) async {
    final uri = Uri.parse('$_baseUrl/rooms/$roomId/join');
    final client = _client();
    try {
      final res = await client.post(
        uri,
        headers: await _headers(withAuth: true),
        body: jsonEncode({'password': password}),
      );

      if (res.statusCode >= 200 && res.statusCode < 300) {
        final body = jsonDecode(res.body) as Map<String, dynamic>;
        return Room.fromJson(body);
      }
      throw Exception('방 참가 실패: ${res.statusCode} ${res.body}');
    } finally {
      client.close();
    }
  }

  // ------------------------
  // 방 나가기: POST /rooms/:roomId/leave  (204 No Content)
  // ------------------------
  static Future<void> leaveRoom(String roomId) async {
    final uri = Uri.parse('$_baseUrl/rooms/$roomId/leave');
    final client = _client();
    try {
      final res = await client.post(
        uri,
        headers: await _headers(withAuth: true),
      );

      if (res.statusCode >= 200 && res.statusCode < 300) {
        return;
      }
      throw Exception('방 나가기 실패: ${res.statusCode} ${res.body}');
    } finally {
      client.close();
    }
  }

  // ------------------------
  // 방 삭제(방장만): DELETE /rooms/:roomId  (204 No Content)
  // ------------------------
  static Future<void> deleteRoom(String roomId) async {
    final uri = Uri.parse('$_baseUrl/rooms/$roomId');
    final client = _client();
    try {
      final res = await client.delete(
        uri,
        headers: await _headers(withAuth: true),
      );

      if (res.statusCode == 204) {
        return;
      }
      throw Exception('방 삭제 실패: ${res.statusCode} ${res.body}');
    } finally {
      client.close();
    }
  }
}
