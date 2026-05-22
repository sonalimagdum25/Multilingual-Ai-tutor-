const loginPage = document.getElementById('loginPage');
const chatPage = document.getElementById('chatPage');
const chatBox = document.getElementById('chatBox');

let selectedLanguage = 'English';

function startApp() {
    const username = document.getElementById('username').value;

    if (username === '') {
        alert('Please enter your name');
        return;
    }

    selectedLanguage = document.getElementById('languageSelect').value;

    loginPage.classList.add('hidden');
    chatPage.classList.remove('hidden');

    addBotMessage(`Hello ${username}! Ask me anything.`);
}

function logout() {
    location.reload();
}

function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'message user';
    div.innerText = text;
    chatBox.appendChild(div);
}

function addBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'message bot';
    div.innerText = text;
    chatBox.appendChild(div);

    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

async function sendMessage() {

    const input = document.getElementById('userInput');
    const message = input.value;

    if (message === '') return;

    addUserMessage(message);

    input.value = '';

    try {

        const response = await fetch('http://localhost:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                language: selectedLanguage
            })
        });

        const data = await response.json();

        addBotMessage(data.reply);

    } catch (error) {
        addBotMessage('Server Error');
    }
}

function startVoice() {

    const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = 'en-IN';

    recognition.start();

    recognition.onresult = function(event) {
        document.getElementById('userInput').value = event.results[0][0].transcript;
    }
}