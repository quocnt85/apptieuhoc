import React from 'react';
import ReactDOM from 'react-dom/client';
import { DialogueStudio } from './DialogueStudio';
import './dialogueStudio.css';

const root = document.getElementById('dialogue-studio-root');

if (!root) {
  throw new Error('Không tìm thấy vùng hiển thị Dialogue Studio.');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <DialogueStudio />
  </React.StrictMode>,
);
