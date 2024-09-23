import { initGame, flipCard, resetScore, getScore, isGameComplete } from './game.js';
import { updateUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const easyButton = document.getElementById('easy-button');
    const mediumButton = document.getElementById('medium-button');
    const hardButton = document.getElementById('hard-button');
    const restartButton = document.getElementById('restart-button');
    const exitButton = document.getElementById('exit-button');
    const gameBoard = document.getElementById('game-board');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const finalTimeElement = document.getElementById('final-time');
    const finalScoreElement = document.getElementById('final-score');

    const allImages = [
        'edgar.png', 'gale.png', 'pam.webp', 'piper.png', 'poco.png', 'sandy.png', 'spike.png', 'squike.png',
        'amber.png', 'bea.png', 'colt.png', 'dinamike.png', 'griff.webp', 'leon.png', 'meg.png', 'nita.webp'
    ];

    let game;
    let timerWorker;

    easyButton.addEventListener('click', () => startGame(8));
    mediumButton.addEventListener('click', () => startGame(12));
    hardButton.addEventListener('click', () => startGame(16));
    restartButton.addEventListener('click', () => {
        endScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
    });

    exitButton.addEventListener('click', exitGame);

    function startGame(pairCount) {
        const selectedImages = allImages.slice(0, pairCount);
        startScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        game = initGame(selectedImages);

        const shuffleWorker = new Worker('scripts/workers/shuffleWorker.js');
        shuffleWorker.postMessage(selectedImages);
        
        shuffleWorker.onmessage = (e) => {
            game.cards = e.data;
            
            gameBoard.innerHTML = '';
            
            const columns = Math.ceil(Math.sqrt(game.cards.length));
            gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            
            game.cards.forEach((image, index) => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.dataset.index = index;
                card.innerHTML = `
                    <div class="front"></div>
                    <div class="back">
                        <img src="images/${image}" alt="Card ${index}">
                    </div>
                `;
                card.addEventListener('click', () => {
                    flipCard(game, index);
                    getScore((score) => {
                        game.score = score;
                        updateUI(game, gameBoard, timerElement, scoreElement);
                        
                        if (isGameComplete(game)) {
                            endGame();
                        }
                    });
                });
                gameBoard.appendChild(card);
            });
            resetScore();

            updateUI(game, gameBoard, timerElement, scoreElement);

            timerWorker = new Worker('scripts/workers/timerWorker.js');
            timerWorker.postMessage('start');
            timerWorker.onmessage = (e) => {
                game.time = e.data;
                updateUI(game, gameBoard, timerElement, scoreElement);
            };
        };
    }

    function endGame() {
        timerWorker.postMessage('stop');
        
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');

        getScore((finalScore) => {
            finalTimeElement.textContent = formatTime(game.time);
            finalScoreElement.textContent = finalScore;
        });
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function exitGame() {
        if (confirm('¿Estás seguro de que quieres salir del juego?')) {
            if (timerWorker) {
                timerWorker.postMessage('stop');
            }
            
            resetScore();
            
            gameScreen.classList.add('hidden');
            endScreen.classList.add('hidden');
            startScreen.classList.remove('hidden');
            
            gameBoard.innerHTML = '';
            
            timerElement.textContent = '00:00';
            scoreElement.textContent = '0';
        }
    }
});


