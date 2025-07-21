import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

function ChatArea({ contact, messages, onSendMessage, analyticsMode, ollamaModels = [], selectedModel, setSelectedModel }) {
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  return (
    <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
        <Typography variant="h5">
          {analyticsMode
            ? 'Analytics'
            : contact
              ? `Chat with ${contact.name}`
              : 'Select a contact'}
        </Typography>
        <Box sx={{ mt: 2 }}>
          {messages.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              {analyticsMode
                ? 'No analytics summaries yet. Type a query to get started!'
                : 'No messages yet. Start the conversation!'}
            </Typography>
          ) : (
            messages.map((msg, idx) => (
              <Box key={idx} sx={{ mb: 1, textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
                <Typography variant="body2" color={msg.sender === 'me' ? 'primary' : 'secondary'}>
                  {analyticsMode && msg.sender !== 'me' ? <b>Summary:</b> : null} {msg.text}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {msg.sender} • {msg.timestamp.toLocaleTimeString()}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Box>
      <FormControl sx={{ mb: 2, minWidth: 200 }} disabled={ollamaModels.length === 0}>
        <InputLabel id="model-select-label">Ollama Model</InputLabel>
        <Select
          labelId="model-select-label"
          id="model-select"
          value={selectedModel || ''}
          label="Ollama Model"
          onChange={handleModelChange}
        >
          {ollamaModels.map((model) => (
            <MenuItem key={model} value={model}>{model}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center' }} elevation={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={analyticsMode ? 'Type your analytics query...' : 'Type your message...'}
          value={message}
          onChange={handleInputChange}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSend} disabled={!message.trim()}>
          Send
        </Button>
      </Paper>
    </Box>
  );
}

export default ChatArea;
