@echo off
start steam://rungameid/730
npm run dev
timeout /t 5 > NUL

:loop
tasklist /fi "IMAGENAME eq csgo.exe" | find ":" > nul
if errorlevel 1 (goto loop)

exit