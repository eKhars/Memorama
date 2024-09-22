let time = 0;
let intervalId;

self.onmessage = function(e) {
    if (e.data === 'start') {
        intervalId = setInterval(() => {
            time++;
            self.postMessage(time);
        }, 1000);
    } else if (e.data === 'stop') {
        clearInterval(intervalId);
    }
};