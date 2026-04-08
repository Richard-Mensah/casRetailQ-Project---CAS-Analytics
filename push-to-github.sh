#!/bin/bash
# ============================================================
#  RetailIQ — GitHub Push Script
#  Run this script AFTER creating your GitHub repo
# ============================================================

set -e

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║     RetailIQ — GitHub Deployment Script              ║"
echo "║     Center for Analytics Services (CAS) · 2026      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ── EDIT THESE TWO LINES ────────────────────────────────────
GITHUB_USERNAME="YOUR_GITHUB_USERNAME"
GITHUB_TOKEN="YOUR_PERSONAL_ACCESS_TOKEN"
# ────────────────────────────────────────────────────────────

REPO_NAME="retailiq"

if [ "$GITHUB_USERNAME" = "YOUR_GITHUB_USERNAME" ]; then
  echo "❌ Please edit this script and fill in your GitHub username and token."
  echo ""
  echo "   1. Open push-to-github.sh in a text editor"
  echo "   2. Replace YOUR_GITHUB_USERNAME with your GitHub username"
  echo "   3. Replace YOUR_PERSONAL_ACCESS_TOKEN with your token"
  echo "      (Get token: GitHub → Settings → Developer Settings → Personal Access Tokens)"
  echo ""
  exit 1
fi

echo "📦 Setting up remote..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"

echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ SUCCESS! Your RetailIQ app is now on GitHub!"
echo ""
echo "   📍 Repository: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  DEPLOY LIVE (FREE) — Choose one option:"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  Option A — Vercel (Recommended, 30 seconds):"
echo "    1. Go to https://vercel.com"
echo "    2. Click 'Add New Project'"
echo "    3. Import your GitHub repo '${REPO_NAME}'"
echo "    4. Click Deploy — done!"
echo ""
echo "  Option B — Netlify:"
echo "    1. Go to https://netlify.com"
echo "    2. 'Add new site' → 'Import from Git'"
echo "    3. Connect GitHub → select '${REPO_NAME}'"
echo "    4. Build command: npm run build"
echo "    5. Publish directory: build"
echo "    6. Deploy!"
echo ""
echo "  Option C — GitHub Pages:"
echo "    npm install -g gh-pages"
echo "    npm run build"
echo "    npx gh-pages -d build"
echo ""
echo "═══════════════════════════════════════════════════════"
