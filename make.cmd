@ECHO OFF
PUSHD %~DP0
SET Nodejs=C:\Program Files\nodejs\nodevars.bat
GOTO :MakeXPI
:InstallJPM
npm install jpm global && GOTO :MakeXPI
:MakeXPI
"%Nodejs%" && (
  jpm xpi || GOTO :InstallJPM
  PAUSE
)
