import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Box, Tabs, Tab } from '@mui/material';

function App() {
  const [analyticsMessages, setAnalyticsMessages] = useState([]);
  const [ollamaModels, setOllamaModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('llama3');

  // Fetch available Ollama models on mount
  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch('http://localhost:11434/api/tags');
        const data = await res.json();
        if (data.models && data.models.length > 0) {
          setOllamaModels(data.models.map(m => m.name));
          // Default to llama3 if available, else first model
          if (data.models.some(m => m.name === 'llama3')) {
            setSelectedModel('llama3');
          } else {
            setSelectedModel(data.models[0].name);
          }
        }
      } catch (e) {
        setOllamaModels([]);
      }
    }
    fetchModels();
  }, []);

  const handleSendAnalyticsMessage = async (msg) => {
    if (msg.trim() !== '') {
      const userMessage = { sender: 'me', text: msg, timestamp: new Date() };
      setAnalyticsMessages((prev) => [...prev, userMessage]);
      // Add a placeholder for the streaming LLM response
      const tempId = Date.now();
      const llamaMessage = { sender: 'llama', text: '', timestamp: new Date(), tempId };
      setAnalyticsMessages((prev) => [...prev, llamaMessage]);
      try {
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: selectedModel, prompt: msg }),
        });
        if (!response.ok) {
          throw new Error('LLM server error: ' + response.statusText);
        }
        let fullResponse = '';
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            chunk.split('\n').forEach(line => {
              if (line.trim()) {
                try {
                  const data = JSON.parse(line);
                  if (data.response) {
                    fullResponse += data.response;
                    setAnalyticsMessages((prev) => {
                      const updated = [...prev];
                      const idx = updated.findIndex(m => m.tempId === tempId);
                      if (idx !== -1) {
                        updated[idx] = { ...updated[idx], text: fullResponse };
                      }
                      return updated;
                    });
                  }
                } catch (e) {
                  // Ignore JSON parse errors for incomplete lines
                }
              }
            });
          }
        }
        setAnalyticsMessages((prev) => {
          const updated = [...prev];
          const idx = updated.findIndex(m => m.tempId === tempId);
          if (idx !== -1) {
            const { tempId, ...finalMsg } = updated[idx];
            updated[idx] = finalMsg;
          }
          return updated;
        });
      } catch (e) {
        setAnalyticsMessages((prev) => [...prev, { sender: 'llama', text: 'Error: ' + e.message, timestamp: new Date() }]);
      }
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Tabs value={0}>
        <Tab label="Analytics" />
      </Tabs>
      <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <ChatArea
          contact={null}
          messages={analyticsMessages}
          onSendMessage={handleSendAnalyticsMessage}
          analyticsMode={true}
          ollamaModels={ollamaModels}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
      </Box>
    </Box>
  );
}

export default App;
