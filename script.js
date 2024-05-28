document.addEventListener('DOMContentLoaded', () => {
    const timersContainer = document.getElementById('timers-container');
    const addTimerButton = document.getElementById('add-timer-button');
    const removeTimerButton = document.getElementById('remove-timer-button');

    let timerCount = 1; // 初期タイマー数は1
    const maxTimers = 3;
    const minTimers = 1;

    // 初期状態で表示されているタイマーを設定
    setupTimer(1);

    addTimerButton.addEventListener('click', () => {
        if (timerCount < maxTimers) {
            timerCount++;
            timersContainer.appendChild(createTimerElement(timerCount));
            setupTimer(timerCount);
        }
    });

    removeTimerButton.addEventListener('click', () => {
        if (timerCount > minTimers) {
            const timerToRemove = document.getElementById(`timer-${timerCount}`);
            if (timerToRemove) {
                timersContainer.removeChild(timerToRemove);
                timerCount--;
            }
        }
    });

    function createTimerElement(timerId) {
        const timerDiv = document.createElement('div');
        timerDiv.className = 'timer';
        timerDiv.id = `timer-${timerId}`;
        timerDiv.innerHTML = `
            <canvas id="canvas-${timerId}" width="200" height="200"></canvas>
            <div id="time-display-${timerId}">残り時間: 00:00</div>
            <div id="elapsed-time-display-${timerId}">経過時間: 00:00</div>
            <input type="text" id="time-input-${timerId}" placeholder="分数を入力" pattern="\\d*" inputmode="numeric">
            <button id="start-button-${timerId}">スタート</button>
            <button id="stop-button-${timerId}">停止</button>
            <button id="reset-button-${timerId}">リセット</button>
        `;
        return timerDiv;
    }

    function setupTimer(timerId) {
        const canvas = document.getElementById(`canvas-${timerId}`);
        const ctx = canvas.getContext('2d');
        const timeDisplay = document.getElementById(`time-display-${timerId}`);
        const elapsedTimeDisplay = document.getElementById(`elapsed-time-display-${timerId}`);
        const timeInput = document.getElementById(`time-input-${timerId}`);
        const startButton = document.getElementById(`start-button-${timerId}`);
        const stopButton = document.getElementById(`stop-button-${timerId}`);
        const resetButton = document.getElementById(`reset-button-${timerId}`);

        let totalTime;
        let remainingTime;
        let elapsedTime;
        let interval;
        let isPaused = false;

        startButton.addEventListener('click', toggleTimer);
        stopButton.addEventListener('click', toggleTimer);
        resetButton.addEventListener('click', resetTimer);
        timeInput.addEventListener('input', validateInput);

        function validateInput(event) {
            const input = event.target.value;
            event.target.value = input.replace(/[^\d]/g, '');
        }

        function toggleTimer() {
            if (interval) {
                stopTimer();
            } else {
                startTimer();
            }
        }

        function startTimer() {
            if (isPaused) {
                isPaused = false;
            } else {
                totalTime = parseInt(timeInput.value) * 60;
                remainingTime = totalTime;
                elapsedTime = 0;

                if (isNaN(totalTime) || totalTime <= 0) {
                    alert('有効な時間を入力してください');
                    return;
                }
            }

            interval = setInterval(updateTimer, 1000);
            updateTimer();
        }

        function stopTimer() {
            clearInterval(interval);
            interval = null;
            isPaused = true;
        }

        function resetTimer() {
            clearInterval(interval);
            interval = null;
            isPaused = false;
            timeInput.value = '';
            timeDisplay.textContent = '残り時間: 00:00';
            elapsedTimeDisplay.textContent = '経過時間: 00:00';
            drawCircle(1);
        }

        function updateTimer() {
            if (remainingTime <= 0) {
                clearInterval(interval);
                interval = null;
                timeDisplay.textContent = '残り時間: 00:00';
                elapsedTimeDisplay.textContent = '経過時間: ' + formatTime(elapsedTime);
                drawCircle(0);
                return;
            }
        
            remainingTime--;
            elapsedTime++;
            let remainingTimeString = formatTime(remainingTime);
            let [minutes, seconds] = remainingTimeString.split(':');
        
            if (remainingTime < 60) {
                // 残り時間が1分未満の場合、分と秒の数字を赤色に変更
                minutes = `<span style="color: red;">${minutes}</span>`;
                seconds = `<span style="color: red;">${seconds}</span>`;
            }
        
            timeDisplay.innerHTML = `残り時間: ${minutes}:${seconds}`;
            elapsedTimeDisplay.textContent = '経過時間: ' + formatTime(elapsedTime);
        
            drawCircle(remainingTime / totalTime);
        }
        
        function formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        function drawCircle(percentage) {
            const radius = canvas.width / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        
            // 残り時間に応じて円弧の色を決定
            const arcColor = remainingTime < 60 ? '#ffb6c1' : '#b0c4de'; // 1分未満の場合はlightpink、それ以外はlightsteelblue
        
            // 背景円
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
            ctx.fillStyle = '#eee';
            ctx.fill();
        
            // 残り時間の円弧
            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, radius, -0.5 * Math.PI, (2 * percentage - 0.5) * Math.PI);
            ctx.lineTo(radius, radius);
            ctx.fillStyle = arcColor;
            ctx.fill();
        }        
        
    }
});
