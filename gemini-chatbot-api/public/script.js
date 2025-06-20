const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage) return;

    appendMessage('user', userMessage);
    input.value = '';

    appendMessage('bot', 'Gemini is thinking...');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message: userMessage})
        });

        const data = await response.json();
        // Remove the last bot message if it is the thinking message
        const lastBotMsg = chatBox.querySelector('.message.bot:last-child');
        if (lastBotMsg && lastBotMsg.textContent === 'Gemini is thinking...') {
            lastBotMsg.remove();
        }

        appendMessage('bot', data.reply || 'No response from Gemini.');

    } catch (error) {
        const lastBotMsg = chatBox.querySelector('.message.bot:last-child');
        if (lastBotMsg && lastBotMsg.textContent === 'Gemini is thinking...') {
            lastBotMsg.remove();
        }
        appendMessage('bot', 'Error: Could not reach Gemini API.');
    }
});

function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}
