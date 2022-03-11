import 'package:flmarkdown/src/widgets/examples.dart';
import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: ListView(
        children: <Widget>[
          CardExample(
            title: 'Example 1',
            textButton: TextButton(
              child: const Text('Show More', style: TextStyle(fontSize: 20)),
              onPressed: () {
                Navigator.pushNamed(context, 'example1');
              },
            ),
          ),
          CardExample(
            title: 'Markdown Editor',
            textButton: TextButton(
              child: const Text('Show More', style: TextStyle(fontSize: 20)),
              onPressed: () {
                Navigator.pushNamed(context, 'example2');
              },
            ),
          ),
        ],
      ),
    );
  }
}
