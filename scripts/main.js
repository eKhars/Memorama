import { initGame, flipCard, resetScore, getScore, isGameComplete } from './game.js';
import { updateUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const gameBoard = document.getElementById('game-board');
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const finalTimeElement = document.getElementById('final-time');
    const finalScoreElement = document.getElementById('final-score');

    const images = [
        'edgar.png', 'gale.png', 'pam.webp', 'piper.png',
        'poco.png', 'sandy.png', 'spike.png', 'squike.jpeg'
    ];

    let game;
    let timerWorker;

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);

    function startGame() {
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        game = initGame(images);

        // Iniciar el worker para mezclar las cartas
        const shuffleWorker = new Worker('scripts/workers/shuffleWorker.js');
        shuffleWorker.postMessage(images);
        
        shuffleWorker.onmessage = (e) => {
            game.cards = e.data;
            
            // Limpiar el tablero existente
            gameBoard.innerHTML = '';
            
            // Crear las cartas mezcladas
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
                        
                        // Verificar si el juego ha terminado después de actualizar la UI
                        if (isGameComplete(game)) {
                            endGame();
                        }
                    });
                });
                gameBoard.appendChild(card);
            });

            // Resetear la puntuación al inicio de un nuevo juego
            resetScore();

            // Actualizar la UI inicial
            updateUI(game, gameBoard, timerElement, scoreElement);

            // Iniciar el worker para el temporizador
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
});