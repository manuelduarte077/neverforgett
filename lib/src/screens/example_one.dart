import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_markdown/flutter_markdown.dart';

class ExampleOneScreen extends StatelessWidget {
  const ExampleOneScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Example One'),
      ),
      body: FutureBuilder(
        future: Future.delayed(
          const Duration(seconds: 1),
          () => rootBundle.loadString('assets/example.md'),
        ),
        builder: (context, AsyncSnapshot<String> snapshot) {
          if (snapshot.hasData) {
            return Markdown(
              data: snapshot.data.toString(),
              styleSheet: MarkdownStyleSheet.fromTheme(Theme.of(context)),
            );
          } else {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
        },
      ),
    );
  }
}
