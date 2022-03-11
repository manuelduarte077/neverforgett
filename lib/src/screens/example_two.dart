import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

class ExampleTwoScreen extends StatefulWidget {
  const ExampleTwoScreen({Key? key}) : super(key: key);

  @override
  State<ExampleTwoScreen> createState() => _ExampleTwoScreenState();
}

class _ExampleTwoScreenState extends State<ExampleTwoScreen>
    with SingleTickerProviderStateMixin {
  TabController? _controller;
  TextEditingController? _textController;

  String text = '';

  @override
  void initState() {
    super.initState();
    _controller = TabController(length: 2, vsync: this);
    _textController = TextEditingController();
  }

  @override
  Widget build(BuildContext context) {
    const TextStyle style = TextStyle(color: Colors.white);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Markdown Editor', style: style),
        bottom: TabBar(
          controller: _controller,
          tabs: const <Widget>[
            Tab(
              text: 'Editor',
            ),
            Tab(
              text: 'Preview',
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _controller,
        children: <Widget>[
          Container(
            margin: const EdgeInsets.all(20),
            child: TextField(
              keyboardType: TextInputType.multiline,
              maxLines: null,
              controller: _textController,
              decoration: const InputDecoration(
                hintText: 'Enter some text...',
              ),
              onChanged: (String text) {
                setState(() {
                  this.text = text;
                });
              },
            ),
          ),
          Container(
            margin: const EdgeInsets.all(20),
            child: MarkdownBody(
              data: text,
              styleSheet: MarkdownStyleSheet.fromTheme(Theme.of(context)),
            ),
          ),
        ],
      ),
    );
  }
}
