import 'package:flutter/material.dart';

class CardExample extends StatelessWidget {
  final String title;
  final TextButton textButton;
  const CardExample({
    Key? key,
    required this.title,
    required this.textButton,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          ListTile(
            leading: const Icon(Icons.album),
            title: Text(
              title,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 30),
            ),
          ),
          ButtonBar(
            children: <Widget>[
              textButton,
            ],
          ),
        ],
      ),
    );
  }
}
