function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

self.onmessage = function(e) {
    let cards = e.data;
    // Duplicamos las cartas para tener pares
    cards = [...cards, ...cards];
    // Mezclamos el array
    const shuffledCards = shuffleArray(cards);
    self.postMessage(shuffledCards);
};