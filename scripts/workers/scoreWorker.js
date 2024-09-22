let score = 0;

self.onmessage = function(e) {
    const action = e.data;
    
    switch(action) {
        case 'MATCH':
            score += 100;
            break;
        case 'MISMATCH':
            score = Math.max(0, score - 10);  // Evita puntuación negativa
            break;
        case 'RESET':
            score = 0;
            break;
        case 'GET_SCORE':
            break;
        default:
            console.error('Acción no reconocida:', action);
            return;
    }
    
    self.postMessage(score);
};