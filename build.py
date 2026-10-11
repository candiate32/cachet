# Builds index.html (the GitHub Pages site) by inlining src/styles.css and src/app.js into src/index.html.
import pathlib
root = pathlib.Path(__file__).parent
body = (root / 'src/index.html').read_text()
body = body.replace('/*@@STYLES@@*/', (root / 'src/styles.css').read_text())
body = body.replace('/*@@SCRIPT@@*/', (root / 'src/app.js').read_text())
page = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<meta name="description" content="Cachet: a RAG chatbot with a self-learning semantic cache that recognizes reworded questions.">\n'
        '</head>\n<body>\n' + body + '\n</body>\n</html>\n')
(root / 'index.html').write_text(page)
print('built index.html', len(page), 'bytes')
