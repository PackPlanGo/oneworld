@echo off
cd /d "C:\Users\jamaw\OneDrive\Dokumente\Claude\Projects\Packplango\GitHub\oneworld"
git add -A
git commit -m "deploy: push all pending HTML updates"
git push origin main
pause
