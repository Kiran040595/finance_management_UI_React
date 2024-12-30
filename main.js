const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');


let mainWindow;
let springBootProcess;

const fs = require('fs');
const logFile = path.join(app.getPath('userData'), 'spring-boot-logs.txt');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024, // Increased size for better UI experience
    height: 768,
    webPreferences: {
      nodeIntegration: false, // Set to false for security; adjust if needed
      contextIsolation: true, // Enable context isolation for security
    },
  });

  // Load the React build
  mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;

    // Stop the Spring Boot backend when the app is closed
    if (springBootProcess) {
      springBootProcess.kill();
    }
  });
}

function startSpringBoot() {
  
  console.log("Starting Spring Boot process...");
  
  const jarPath = path.join(
    process.resourcesPath,
    'app.asar.unpacked',
    'backend',
    'finance-management-1.0.0.jar'
);

  const logStream = fs.createWriteStream(logFile, { flags: 'a' });
  logStream.write("Starting Spring Boot process...\n");

  springBootProcess = spawn('java', ['-jar', jarPath]);
  console.log("Starting Spring Boot process...spawn");
  

  // Log Spring Boot output for debugging
  springBootProcess.stdout.on('data', (data) => {
    console.log(`Spring Boot: ${data.toString()}`);
    logStream.write(`Spring Boot (stdout): ${data.toString()}\n`);
  });

  springBootProcess.stderr.on('data', (data) => {
    console.error(`Spring Boot Error: ${data.toString()}`);
    logStream.write(`Spring Boot (stderr): ${data.toString()}\n`);
  });

  springBootProcess.on('close', (code) => {
    console.log(`Spring Boot process exited with code ${code}`);
    logStream.write(`Failed to start Spring Boot process: ${error.message}\n`);

  });
}

app.on('ready', () => {
  startSpringBoot();
  console.log("Calling Starting Spring Boot process...");
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }

  // Ensure Spring Boot process is terminated
  if (springBootProcess) {
    springBootProcess.kill();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
