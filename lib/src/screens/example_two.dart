import 'package:flutter/material.dart';

class ExampleTwoScreen extends StatefulWidget {
  const ExampleTwoScreen({Key? key}) : super(key: key);

  @override
  State<ExampleTwoScreen> createState() => _ExampleTwoScreenState();
}

class _ExampleTwoScreenState extends State<ExampleTwoScreen>
    with SingleTickerProviderStateMixin {
  TabController? _controller;

  @override
  void initState() {
    super.initState();
    _controller = TabController(length: 2, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Markdown Editor'),
        bottom: TabBar(
          controller: _controller,
          tabs: const <Widget>[
            Tab(
              child: Icon(Icons.edit_off_outlined),
            ),
            Tab(
              child: Icon(Icons.preview),
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _controller,
        children: const <Widget>[
          Icon(Icons.add),
          Icon(Icons.poll),
        ],
      ),
    );
  }
}
