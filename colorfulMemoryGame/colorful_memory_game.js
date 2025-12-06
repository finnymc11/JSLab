// Shuffle helper
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// 6 colors → 12 cards
const colors = ['red', 'blue', 'green', 'purple', 'orange', 'pink'];
let cards = shuffle(colors.concat(colors));

let selectedCards = [];
let score = 0;
let timeLeft = 30;
let gameInterval;

const startbtn = document.getElementById('startbtn');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

function generateCards() {
    gameContainer.innerHTML = '';
    for (const color of cards) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.color = color;
        card.textContent = '?';
        gameContainer.appendChild(card);
    }
}

function handleCardClick(event) {
    const card = event.target;

    if (!card.classList.contains('card')) return;
    if (card.classList.contains('matched')) return;
    if (selectedCards.includes(card)) return;
    if (selectedCards.length === 2) return;

    card.textContent = card.dataset.color;
    card.style.backgroundColor = card.dataset.color;
    selectedCards.push(card);

    if (selectedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [card1, card2] = selectedCards;

    if (card1.dataset.color === card2.dataset.color) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        score += 2;
        scoreElement.textContent = `Score: ${score}`;
    } else {
        card1.textContent = '?';
        card2.textContent = '?';
        card1.style.backgroundColor = '#ddd';
        card2.style.backgroundColor = '#ddd';
    }
    selectedCards = [];
}

function startGame() {
    clearInterval(gameInterval);
    timeLeft = 30;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    timerElement.textContent = `Time Left: ${timeLeft}`;
    startbtn.disabled = true;

    cards = shuffle(colors.concat(colors));
    selectedCards = [];
    generateCards();
    startGameTimer();
}

function startGameTimer() {
    gameInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time Left: ${timeLeft}`;

        if (timeLeft === 0) {
            clearInterval(gameInterval);
            alert('Game Over!');
            startbtn.disabled = false;
        }
    }, 1000);
}

gameContainer.addEventListener('click', handleCardClick);
startbtn.addEventListener('click', startGame);