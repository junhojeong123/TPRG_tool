// lib/models/room.dart

/// RoomParticipantSummary 모델: 방 참가자 요약 정보
class RoomParticipantSummary {
  final String id;
  final String name;
  final String nickname;
  final String role;

  RoomParticipantSummary({
    required this.id,
    required this.name,
    required this.nickname,
    required this.role,
  });

  factory RoomParticipantSummary.fromJson(Map<String, dynamic> json) {
    return RoomParticipantSummary(
      id: json['id'] as String,
      name: json['name'] as String,
      nickname: json['nickname'] as String,
      role: json['role'] as String,
    );
  }
}

/// Room 모델: 서버와 주고받는 방 정보의 Dart 모델 클래스.
/// 나중에 API 응답으로 받은 JSON을 파싱하거나,
/// 방 생성 요청(request)용 객체로 사용할 수 있습니다.
class Room {
  /// 방 UUID (백엔드에서 생성)
  final String? id;

  /// 방 이름
  final String name;

  /// 개인방 비밀번호 (백엔드에선 항상 필요, 해시되어 저장됨)
  final String? password;

  /// 최대 수용 인원
  final int maxParticipants;

  /// 현재 참가 인원 수 (기본 0)
  final int currentParticipants;

  /// 참가자 요약 목록
  final List<RoomParticipantSummary> participants;

  /// 방 생성자 닉네임
  final String? creatorNickname;

  Room({
    this.id,
    required this.name,
    this.password,
    required this.maxParticipants,
    this.currentParticipants = 0,
    this.participants = const [],
    this.creatorNickname,
  });

  /// 방 생성 요청용 JSON 변환 helper
  Map<String, dynamic> toCreateJson() {
    final Map<String, dynamic> data = {
      'name': name,
      'maxParticipants': maxParticipants,
    };
    if ((password ?? '').isNotEmpty) {
      data['password'] = password!; // backend requires a non-empty password
    }
    return data;
  }

  /// 서버 응답(JSON)으로부터 Room 객체를 생성
  /// 응답이 { room: {...} } 형태일 수도 있고, flat object일 수도 있음
  factory Room.fromJson(Map<String, dynamic> json) {
    final data =
        json['room'] is Map<String, dynamic>
            ? json['room'] as Map<String, dynamic>
            : json;

    return Room(
      id: data['id'] as String?,
      name: data['name'] as String? ?? 'no_name',
      password: data['password'] as String?,
      maxParticipants: data['maxParticipants'] as int? ?? 0,
      currentParticipants: data['currentParticipants'] as int? ?? 0,
      participants:
          (data['participants'] as List<dynamic>?)
              ?.map(
                (e) =>
                    RoomParticipantSummary.fromJson(e as Map<String, dynamic>),
              )
              .toList() ??
          [],
      creatorNickname: data['creatorNickname'] as String?,
    );
  }
}
