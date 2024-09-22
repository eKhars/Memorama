import { isCardFlipped } from './game.js';

export function updateUI(game, gameBoard, timerElement, scoreElement) {
    gameBoard.querySelectorAll('.card').forEach((card, index) => {
        if (isCardFlipped(game, index)) {
            card.classList.add('flipped');
        } else {
            card.classList.remove('flipped');
        }
    });

    const minutes = Math.floor(game.time / 60);
    const seconds = game.time % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    scoreElement.textContent = game.score;
}