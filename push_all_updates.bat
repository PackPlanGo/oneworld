@echo off
cd /d "C:\Users\jamaw\OneDrive\Dokumente\Claude\Projects\Packplango\GitHub\oneworld"

echo --- Git Status ---
git status

echo.
echo --- Fetch von GitHub ---
git fetch origin
if errorlevel 1 (echo FEHLER beim Fetch! & pause & exit /b)

echo.
echo --- Merge mit Remote ---
git merge origin/main
if errorlevel 1 (echo FEHLER beim Merge! Konflikt? & pause & exit /b)

echo.
echo --- Aenderungen stagen ---
git add -A
git status

echo.
echo --- Commit ---
git commit -m "deploy: push all pending HTML updates"

echo.
echo --- Push zu GitHub ---
git push origin main
if errorlevel 1 (echo FEHLER beim Push! & pause & exit /b)

echo.
echo --- FERTIG! Netlify deployt jetzt automatisch. ---
pause
