import 'package:flmarkdown/src/screens/example_one.dart';
import 'package:flmarkdown/src/screens/home_screen.dart';
import 'package:flutter/material.dart';

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.indigo,
      ),
      home: const HomeScreen(),
      initialRoute: 'home',
      routes: {
        'home': (context) => const HomeScreen(),
        'example1': (context) => const ExampleOneScreen(),
      },
    );
  }
}
