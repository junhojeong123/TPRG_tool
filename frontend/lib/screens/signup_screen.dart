// frontend/lib/screens/signup_screen.dart

import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class SignupScreen extends StatefulWidget {
  static const String routeName = '/signup';

  @override
  _SignupScreenState createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final _formKey = GlobalKey<FormState>();

  String _name = '';
  String _nickname = '';
  String _email = '';
  String _password = '';
  String _confirmPassword = '';
  bool _isLoading = false;

  Future<void> _onSignupPressed() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    // 비밀번호 일치 여부 재검사
    if (_password != _confirmPassword) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('비밀번호가 일치하지 않습니다')));
      return;
    }

    setState(() => _isLoading = true);
    try {
      final success = await AuthService.signUp(
        name: _name,
        nickname: _nickname,
        email: _email,
        password: _password,
      );
      if (success) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('회원가입 성공')));
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('회원가입 실패')));
      }
    } catch (e) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('회원가입 중 오류: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('회원가입')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              // 1) 이름(name) 입력
              TextFormField(
                decoration: InputDecoration(labelText: '이름'),
                onSaved: (v) => _name = v?.trim() ?? '',
                validator: (v) => v == null || v.isEmpty ? '이름을 입력하세요' : null,
              ),
              SizedBox(height: 16),

              // 2) 닉네임(nickname) 입력
              TextFormField(
                decoration: InputDecoration(labelText: '닉네임'),
                onSaved: (v) => _nickname = v?.trim() ?? '',
                validator: (v) => v == null || v.isEmpty ? '닉네임을 입력하세요' : null,
              ),
              SizedBox(height: 16),

              // 3) 이메일 입력
              TextFormField(
                decoration: InputDecoration(labelText: '이메일'),
                keyboardType: TextInputType.emailAddress,
                onSaved: (v) => _email = v?.trim() ?? '',
                validator: (v) {
                  if (v == null || v.isEmpty) return '이메일을 입력하세요';
                  if (!v.contains('@')) return '유효한 이메일을 입력하세요';
                  return null;
                },
              ),
              SizedBox(height: 16),

              // 4) 비밀번호 입력
              TextFormField(
                decoration: InputDecoration(labelText: '비밀번호'),
                obscureText: true,
                onSaved: (v) => _password = v ?? '',
                validator: (v) {
                  if (v == null || v.isEmpty) return '비밀번호를 입력하세요';
                  if (v.length < 8) return '8자 이상 입력하세요';
                  return null;
                },
              ),
              SizedBox(height: 16),

              // 5) 비밀번호 확인
              TextFormField(
                decoration: InputDecoration(labelText: '비밀번호 확인'),
                obscureText: true,
                onSaved: (v) => _confirmPassword = v ?? '',
                validator: (v) {
                  if (v == null || v.isEmpty) return '비밀번호 확인을 입력하세요';
                  return null; // 일치 여부는 _onSignupPressed()에서 체크
                },
              ),
              SizedBox(height: 24),

              // 6) 회원가입 버튼
              _isLoading
                  ? Center(child: CircularProgressIndicator())
                  : SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _onSignupPressed,
                      child: Text('회원가입', style: TextStyle(fontSize: 18)),
                      style: ElevatedButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),

              SizedBox(height: 16),
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text('이미 계정이 있으신가요? 로그인'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
