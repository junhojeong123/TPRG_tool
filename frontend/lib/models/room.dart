// lib/models/room.dart

/// Room 모델: 서버와 주고받는 방 정보의 Dart 모델 클래스.
/// 나중에 API 응답으로 받은 JSON을 파싱하거나,
/// 방 생성 요청(request)용 객체로 사용할 수 있습니다.
class Room {
  /// 방 번호 (자동 증가 PK)
  final int? id;

  /// 방 이름
  final String name;

  /// 개인방인 경우 비밀번호, 공개방이면 null
  final String? password;

  /// 최대 수용 인원 (1~8)
  final int capacity;

  /// 공개 여부 (true: 공개, false: 개인)
  final bool isPublic;

  Room({
    this.id,
    required this.name,
    this.password,
    required this.capacity,
    required this.isPublic,
  });

  /// 서버로 보낼 때 JSON으로 변환하기 위한 helper
  Map<String, dynamic> toJson() {
    return {
      // id는 서버가 생성해 주므로 보통 POST 요청에는 제외
      'name': name,
      // 공개방일 땐 password를 null로 보내고, 개인방일 때만 값 포함
      'password': isPublic ? null : password,
      'maxParticipants': capacity,
      'isPublic': isPublic,
    };
  }

  /// 서버 응답(JSON)으로부터 Room 객체를 생성
  factory Room.fromJson(Map<String, dynamic> json) {
    return Room(
      id: json['id'] as int?,
      name: json['name'] as String? ?? 'no_name',
      password: json['password'] as String?,
      capacity: json['maxParticipants'] as int,
      // 서버는 camelCase로 보내니까 적절히 매핑
      isPublic: json['isPublic'] as bool,
    );
  }
}
