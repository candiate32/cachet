# Cachet

Showcase site for Cachet, a RAG chatbot with a self-learning semantic cache. Questions are embedded (Qwen3-Embedding in the planned product) and compared by meaning, so a reworded question is served from cache where an exact-match cache would miss it.

The playground is a demo: answers, similarity scores and uploads are pre-scripted to illustrate the product.

Live site: https://candiate32.github.io/cachet/

## Editing

Edit the files in `src/`, then run `python3 build.py` to regenerate `index.html` (a single self-contained page).
