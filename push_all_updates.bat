@echo off
cd /d "C:\Users\jamaw\OneDrive\Dokumente\Claude\Projects\Packplango\GitHub\oneworld"
echo --- Schritt 1: Fetch ---
git fetch origin
echo --- Schritt 2: Rebase auf Remote ---
git rebase origin/main
echo --- Schritt 3: Lokale Aenderungen stagen ---
git add -A
echo --- Schritt 4: Commit ---
git commit -m "deploy: push all pending HTML updates"
echo --- Schritt 5: Push ---
git push origin main
echo --- Fertig ---
pause
