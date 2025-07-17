const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Define safe APIs for renderer process here
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
  sendMCP: (data) => ipcRenderer.send('mcp-send', data),
  onMCPResponse: (callback) => ipcRenderer.on('mcp-response', (event, msg) => callback(msg)),
});
