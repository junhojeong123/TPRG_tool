import 'package:flutter/material.dart';
import 'screens/main_screen.dart';
import 'screens/login_screen.dart';
import 'screens/signup_screen.dart';
import 'screens/create_room_screen.dart';
import 'screens/find_room_screen.dart';
import 'screens/option_screen.dart';
import 'screens/room_screen.dart';
import 'models/room.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TRPG App',
      theme: ThemeData(primarySwatch: Colors.indigo),
      initialRoute: MainScreen.routeName,
      routes: {
        MainScreen.routeName: (context) => MainScreen(),
        LoginScreen.routeName: (context) => LoginScreen(),
        SignupScreen.routeName: (context) => SignupScreen(),
        CreateRoomScreen.routeName: (context) => CreateRoomScreen(),
        FindRoomScreen.routeName: (context) => FindRoomScreen(),
        OptionsScreen.routeName: (context) => OptionsScreen(),
      },
    );
  }
}
