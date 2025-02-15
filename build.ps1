# build Atas Indicator
Set-Location .\atas-indicator
dotnet build
if (-not (Test-Path ..\dist)) {
  New-Item -ItemType Directory -Path ..\dist
}
Copy-Item .\bin\Debug\net8.0\DgLabAtas.dll ..\dist\DgLabAtasIndicator.dll

# build server
Set-Location ..\server
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
pyinstaller --onefile --icon=icon.ico main.py
Copy-Item .\dist\main.exe ..\dist\DgLabAtas.exe

pyinstaller --onefile --icon=icon.ico gui.py
Copy-Item .\dist\gui.exe ..\dist\WebPage.exe
Set-Location ..\

# build client gui
Set-Location .\gui
npm run build

Set-Location ..\
