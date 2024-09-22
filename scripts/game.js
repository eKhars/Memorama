let scoreWorker;

export function initGame(images) {
    scoreWorker = new Worker('scripts/workers/scoreWorker.js');
    return {
        cards: [],
        flippedCards: [],
        matchedPairs: [],
        score: 0,
        time: 0,
        totalPairs: images.length
    };
}

export function flipCard(game, index) {
    if (game.flippedCards.length < 2 && !game.flippedCards.includes(index) && !game.matchedPairs.includes(index)) {
        game.flippedCards.push(index);

        if (game.flippedCards.length === 2) {
            checkMatch(game);
        }
    }
}

function checkMatch(game) {
    const [index1, index2] = game.flippedCards;
    
    if (game.cards[index1] === game.cards[index2]) {
        game.matchedPairs.push(index1, index2);
        scoreWorker.postMessage('MATCH');
        game.flippedCards = [];
        
        // Solo verificamos si el juego ha terminado, no hacemos nada aquí
        if (isGameComplete(game)) {
            console.log('Juego completado');
        }
    } else {
        scoreWorker.postMessage('MISMATCH');
        setTimeout(() => {
            game.flippedCards = [];
        }, 1000);
    }
}

export function isCardFlipped(game, index) {
    return game.flippedCards.includes(index) || game.matchedPairs.includes(index);
}

export function resetScore() {
    scoreWorker.postMessage('RESET');
}

export function getScore(callback) {
    scoreWorker.onmessage = (e) => {
        callback(e.data);
    };
    scoreWorker.postMessage('GET_SCORE');
}

export function isGameComplete(game) {
    return game.matchedPairs.length / 2 === game.totalPairs;
}

// Removemos la función endGame de aquí