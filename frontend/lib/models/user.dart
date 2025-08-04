/// User 모델: 백엔드로 보낼 회원가입용 데이터 구조를 정의합니다.
class User {
  final String id; // 아이디 (PK)
  final String password; // 비밀번호
  final String confirmPassword;
  final String email; // 이메일
  final String phone; // 전화번호

  User({
    required this.id,
    required this.password,
    required this.confirmPassword,
    required this.email,
    required this.phone,
  });

  /// JSON 형태로 변환 (요청 body 에 그대로 사용)
  Map<String, dynamic> toJson() => {
        'id': id,
        'password': password,
        'confirmPassword': confirmPassword,
        'email': email,
        'phone': phone,
      };
}
