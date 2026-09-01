/**
 * OCATECH Digital Solutions — AI Chatbot Assistant
 * Floating widget powered by Groq Llama 3.1 & grounded in OCATECH data
 */

(() => {
  const STORAGE_KEY = 'ocatech_chat_history_v1';
  let chatHistory = [];
  let isWaitingForResponse = false;

  // DOM Elements
  let launcherBtn, chatWindow, closeBtn, messagesContainer, chatForm, chatInput, sendBtn;

  document.addEventListener('DOMContentLoaded', () => {
    initChatbotUI();
  });

  function initChatbotUI() {
    launcherBtn = document.getElementById('chatLauncher');
    chatWindow = document.getElementById('chatWindow');
    closeBtn = document.getElementById('chatCloseBtn');
    messagesContainer = document.getElementById('chatMessages');
    chatForm = document.getElementById('chatForm');
    chatInput = document.getElementById('chatInput');
    sendBtn = document.getElementById('chatSendBtn');

    if (!launcherBtn || !chatWindow) return;

    // Load saved conversation or initialize welcome message
    loadHistory();

    // Toggle Chat Window
    launcherBtn.addEventListener('click', toggleChatWindow);
    if (closeBtn) closeBtn.addEventListener('click', closeChatWindow);

    // Form submission
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleUserMessage();
      });
    }

    // Quick prompt chip clicks
    document.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('chip-btn')) {
        const query = e.target.getAttribute('data-prompt') || e.target.innerText;
        if (chatInput) chatInput.value = query;
        handleUserMessage();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatWindow.classList.contains('is-open')) {
        closeChatWindow();
      }
    });
  }

  function toggleChatWindow() {
    const isOpen = chatWindow.classList.toggle('is-open');
    launcherBtn.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      if (chatInput) chatInput.focus();
      scrollToBottom();
    }
  }

  function closeChatWindow() {
    chatWindow.classList.remove('is-open');
    launcherBtn.setAttribute('aria-expanded', 'false');
  }

  function loadHistory() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        chatHistory = JSON.parse(saved);
        renderHistory();
      } else {
        // Initial Welcome Message
        const welcomeMessage = {
          role: 'assistant',
          content: "👋 Hello! Welcome to **OCATECH Digital Solutions**. I'm your AI assistant.\n\nAsk me anything about our **15 practical tech programmes**, physical classes in Onitsha, online training, or ICT services (CCTV, Solar, Software)!\n\nHow can I help you today?"
        };
        chatHistory.push(welcomeMessage);
        renderHistory();
        renderQuickChips();
      }
    } catch (err) {
      console.warn('Could not read chat history from sessionStorage', err);
    }
  }

  function saveHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory.slice(-20))); // Keep last 20 messages
    } catch (err) {
      console.warn('Could not save chat history to sessionStorage', err);
    }
  }

  function renderHistory() {
    if (!messagesContainer) return;
    messagesContainer.innerHTML = '';

    chatHistory.forEach(msg => {
      appendMessageBubble(msg.role, msg.content);
    });

    scrollToBottom();
  }

  function renderQuickChips() {
    if (!messagesContainer) return;
    const chipsWrapper = document.createElement('div');
    chipsWrapper.className = 'chat-chips';
    chipsWrapper.innerHTML = `
      <button class="chip-btn" data-prompt="Where is OCATECH located in Onitsha?">📍 Location</button>
      <button class="chip-btn" data-prompt="What training courses do you offer?">💻 Course List</button>
      <button class="chip-btn" data-prompt="How do classes and admission work?">📅 Class Schedule</button>
      <button class="chip-btn" data-prompt="What ICT services do you provide?">⚡ CCTV & Solar</button>
    `;
    messagesContainer.appendChild(chipsWrapper);
  }

  function appendMessageBubble(role, content) {
    if (!messagesContainer) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role === 'user' ? 'user' : 'bot'}`;
    bubble.innerHTML = formatMarkdown(content);
    messagesContainer.appendChild(bubble);
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'chatTypingIndicator';
    indicator.className = 'chat-bubble bot typing-indicator';
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    messagesContainer.appendChild(indicator);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('chatTypingIndicator');
    if (indicator) indicator.remove();
  }

  async function handleUserMessage() {
    if (!chatInput) return;
    const rawText = chatInput.value.trim();
    if (!rawText || isWaitingForResponse) return;

    // Clear input
    chatInput.value = '';
    
    // Add user message to UI & history
    appendMessageBubble('user', rawText);
    chatHistory.push({ role: 'user', content: rawText });
    saveHistory();
    scrollToBottom();

    // Disable input while waiting
    isWaitingForResponse = true;
    if (sendBtn) sendBtn.disabled = true;
    showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: rawText,
          history: chatHistory.slice(-8) // Send recent context
        })
      });

      removeTypingIndicator();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply || getFallbackMessage();

      appendMessageBubble('assistant', botReply);
      chatHistory.push({ role: 'assistant', content: botReply });
      saveHistory();

    } catch (error) {
      console.error('Chatbot API error:', error);
      removeTypingIndicator();
      
      const fallbackReply = getFallbackMessage();
      appendMessageBubble('assistant', fallbackReply);
      chatHistory.push({ role: 'assistant', content: fallbackReply });
      saveHistory();
    } finally {
      isWaitingForResponse = false;
      if (sendBtn) sendBtn.disabled = false;
      scrollToBottom();
      if (chatInput) chatInput.focus();
    }
  }

  function getFallbackMessage() {
    return "I'm currently unable to reach our live assistant server. You can chat with our team directly on WhatsApp at **08165321429** or [Click here to Chat on WhatsApp](https://wa.me/2348165321429?text=Hello%20OCATECH,%20I%20have%20an%20inquiry) for immediate support!";
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold: **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text*
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Markdown Links: [text](url)
    escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Simple line breaks
    escaped = escaped.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');

    return escaped;
  }

  function scrollToBottom() {
    if (!messagesContainer) return;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
})();
