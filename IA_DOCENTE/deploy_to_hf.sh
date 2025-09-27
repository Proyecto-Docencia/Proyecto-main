#!/usr/bin/env bash
# Simple helper to deploy IA_DOCENTE to a Hugging Face Space repo.
# Usage: ./deploy_to_hf.sh username/space_name
set -euo pipefail
if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <username/space_name>"
  exit 1
fi
SPACE="$1"
CLONE_URL="https://huggingface.co/spaces/$SPACE"
TMPDIR=$(mktemp -d)

echo "Cloning $CLONE_URL into $TMPDIR"
if ! git clone "$CLONE_URL" "$TMPDIR"; then
  echo "Clone failed. Create the Space first in Hugging Face or use the hf CLI to create it."
  exit 1
fi

echo "Copying IA_DOCENTE files into space repo"
cp -r IA_DOCENTE/* "$TMPDIR/"
cd "$TMPDIR"

git add .
if git commit -m "Add IA_DOCENTE Gradio app"; then
  echo "Committed"
else
  echo "No changes to commit or commit failed"
fi

echo "Pushing to Hugging Face Space. When prompted for password use your HF token."
git push

echo "Done. Remove temp dir: $TMPDIR"
