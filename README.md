# GPTAnalytics

A Windows desktop application for interacting with a local Llama LLM using a modern chat interface. Built with Electron and React, featuring live streaming of LLM responses and a clean Material-UI design. This has been built completely with Cursor AI as an experiment to create an app from scratch with Cursor. 

## Features
- Electron-based desktop app (cross-platform, tested on Windows)
- React UI with Material-UI components
- Main chat area for interacting with a local Llama LLM (Ollama)
- Updated to chose which Ollama models are available and let the user choose the model to use
- Live/partial streaming of LLM responses in the chat window
- Easy-to-use, modern interface

## Dependencies
- [React](https://reactjs.org/) (18.x)
- [Material-UI (MUI)](https://mui.com/) (5.x)
- [Electron](https://www.electronjs.org/) (28.x)
- [Ollama](https://ollama.com/) (for running the local Llama LLM server)
- [axios](https://github.com/axios/axios)
- [@emotion/react](https://emotion.sh/docs/introduction)
- [@emotion/styled](https://emotion.sh/docs/styled)

## Getting Started

### 1. Install Node.js and npm
- Download and install from [nodejs.org](https://nodejs.org/)

### 2. Install Ollama and Run Llama LLM
- Download and install Ollama from [ollama.com/download](https://ollama.com/download)
- Start the Llama model server:
  ```sh
  ollama run llama3
  ```
  This will start the Llama server at `http://localhost:11434`.

### 3. Install Project Dependencies
In your project directory:
```sh
npm install
```

### 4. Start the React/Electron App
- For development (React hot reload):
  ```sh
  npm run start
  ```
- In a separate terminal, start Electron:
  ```sh
  npm run electron
  ```
- For a production build:
  ```sh
  npm run build
  npm run electron-build
  ```

## Usage
- Type your query in the chat window and press Enter or click Send.
- The message will be sent to your local Llama LLM (via Ollama), and the response will stream live in the chat.

## Troubleshooting
- **Ollama server not running:** Make sure you have started Ollama with `ollama run llama3` before using the app.
- **Port conflicts:** Ensure nothing else is using port 11434.
- **Electron errors:** Make sure you are running Electron from the project root.

## Contributing
Pull requests and issues are welcome! Please open an issue for bugs or feature requests.

## License
MIT
