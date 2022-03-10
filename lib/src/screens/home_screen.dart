import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: Card(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            const ListTile(
              leading: Icon(Icons.album),
              title: Text('Example 1',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 30,
                  )),
            ),
            ButtonBar(
              children: <Widget>[
                TextButton(
                  child:
                      const Text('Show More', style: TextStyle(fontSize: 20)),
                  onPressed: () {
                    Navigator.pushNamed(context, 'example1');
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
