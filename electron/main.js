const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

const isDev = true; // Set to false for production build

let mcpProcess = null;

function startMCPServer() {
  // Command and args from .cursor/mcp.json
  const command = 'C:/Users/rajee/.local/bin/uv.exe';
  const args = [
    '--directory',
    'C:/Users/rajee/Documents/Projects/whatsapp-mcp/whatsapp-mcp-server',
    'run',
    'main.py'
  ];
  console.log('Starting MCP server:', command, args.join(' '));
  mcpProcess = spawn(command, args, { stdio: ['pipe', 'pipe', 'pipe'] });

  mcpProcess.stdout.on('data', (data) => {
    console.log('MCP STDOUT:', data.toString());
    // Forward MCP server responses to renderer
    const msg = data.toString();
    mainWindow && mainWindow.webContents.send('mcp-response', msg);
  });

  mcpProcess.stderr.on('data', (data) => {
    console.error('MCP server error:', data.toString());
  });

  mcpProcess.on('close', (code) => {
    console.log('MCP server exited with code', code);
  });
}

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (isDev) {
    // Load React dev server
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // Load built React files
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  // startMCPServer(); // MCP server start is now commented out
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
  if (mcpProcess) mcpProcess.kill();
});

// Placeholder for IPC handlers to communicate with React and MCP server

// IPC handlers for sending messages/queries to MCP
ipcMain.on('mcp-send', (event, data) => {
  if (mcpProcess && mcpProcess.stdin.writable) {
    mcpProcess.stdin.write(JSON.stringify(data) + '\n');
  }
});

// Comment out the setTimeout that sends a message to MCP server
// setTimeout(() => {
//   if (mcpProcess && mcpProcess.stdin.writable) {
//     mcpProcess.stdin.write(JSON.stringify({ type: 'analytics', query: 'last 3 messages' }) + '\n');
//   }
// }, 3000); // Wait 3 seconds for server to start
