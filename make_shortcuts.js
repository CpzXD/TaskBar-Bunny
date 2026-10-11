// make_shortcuts.js
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const desktopDir = path.join(os.homedir(), 'Desktop');
const rootDir = __dirname;
const exePath = path.join(rootDir, 'dist', 'win-unpacked', 'Taskbar Bunny.exe');
const iconPath = path.join(rootDir, 'assets', 'icon.ico');
const workDir = path.join(rootDir, 'dist', 'win-unpacked');

const lines = [
  'Set oWS = WScript.CreateObject("WScript.Shell")',
  `sLink1 = "${path.join(rootDir, 'Play Taskbar Bunny.lnk')}"`,
  'Set oL1 = oWS.CreateShortcut(sLink1)',
  `oL1.TargetPath = "${exePath}"`,
  `oL1.WorkingDirectory = "${workDir}"`,
  `oL1.IconLocation = "${iconPath}"`,
  'oL1.Description = "Play Taskbar Bunny"',
  'oL1.Save',
  `sLink2 = "${path.join(desktopDir, 'Taskbar Bunny.lnk')}"`,
  'Set oL2 = oWS.CreateShortcut(sLink2)',
  `oL2.TargetPath = "${exePath}"`,
  `oL2.WorkingDirectory = "${workDir}"`,
  `oL2.IconLocation = "${iconPath}"`,
  'oL2.Description = "Play Taskbar Bunny"',
  'oL2.Save'
];

fs.writeFileSync(path.join(__dirname, 'create_shortcuts.vbs'), lines.join('\r\n'));
execSync('cscript //nologo create_shortcuts.vbs', { cwd: __dirname });
fs.unlinkSync(path.join(__dirname, 'create_shortcuts.vbs'));
console.log('[Shortcut] Successfully created desktop and root shortcuts!');
