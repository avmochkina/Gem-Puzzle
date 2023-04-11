let seconds = 00;
let minutes = 00;
let count = 00;
let isPlay = false;

const container = document.createElement('div');
const heading = document.createElement('h1');
const playSettings = document.createElement('div');
const playButton = document.createElement('button');
const shuffleButton = document.createElement('button');
const saveGameButton = document.createElement('button');
const timerStepContainer = document.createElement('div');
const timerContainer = document.createElement('div');
const timerHeading = document.createElement('h4');
const timerMinutes = document.createElement('div');
const timerDivider = document.createElement('div');
const timerSeconds = document.createElement('div');
const stepsContainer = document.createElement('div');
const stepsHeading = document.createElement('h4');
const stepsCounter = document.createElement('div');
const field = document.createElement('div');
const sizeContainer = document.createElement('div');
const size3Button = document.createElement('button');
const size4Button = document.createElement('button');
const size5Button = document.createElement('button');
const size6Button = document.createElement('button');
const size7Button = document.createElement('button');
const size8Button = document.createElement('button');

//add styles and attributes
container.className = 'container';
heading.className = 'heading';
playSettings.className = 'play__settings';
playButton.className = 'button__play';
shuffleButton.className = 'button__shuffle';
saveGameButton.className = 'button__save-game'
timerStepContainer.className = 'timer-step__container';
timerContainer.className = 'timer__container';
timerHeading.className = 'timer__heading'
timerMinutes.className = 'minute__element';
timerSeconds.className = 'second__element';
stepsContainer.className = 'steps__container';
stepsHeading.className = 'steps__heading';
stepsCounter.className = 'step__element';
field.className = 'field field__3';
sizeContainer.className = 'size__container';
size3Button.className = 'button__size button__size_three';
size4Button.className = 'button__size button__size_four';
size5Button.className = 'button__size button__size_five';
size6Button.className = 'button__size button__size_six';
size7Button.className = 'button__size button__size_seven';
size8Button.className = 'button__size button__size_eight';

//add text
heading.innerHTML = 'Gem Puzzle';
playButton.innerHTML = 'Play';
shuffleButton.innerHTML = 'Shuffle';
saveGameButton.innerHTML = 'Save Game';
timerHeading.innerHTML = 'Time: ';
timerMinutes.innerHTML = '00';
timerDivider.innerHTML = ':';
timerSeconds.innerHTML = '00';
stepsHeading.innerHTML = 'Moves: ';
stepsCounter.innerHTML = '00';
size3Button.innerHTML = '3x3';
size4Button.innerHTML = '4x4';
size5Button.innerHTML = '5x5';
size6Button.innerHTML = '6x6';
size7Button.innerHTML = '7x7';
size8Button.innerHTML = '8x8';

//add elements to document
document.body.append(container);
container.append(heading);
container.append(playSettings);
playSettings.append(playButton);
playSettings.append(shuffleButton);
playSettings.append(saveGameButton);
container.append(timerStepContainer);
timerStepContainer.append(timerContainer);
timerContainer.append(timerHeading);
timerContainer.append(timerMinutes);
timerContainer.append(timerDivider);
timerContainer.append(timerSeconds);
timerStepContainer.append(stepsContainer);
stepsContainer.append(stepsHeading);
stepsContainer.append(stepsCounter);
container.append(field);
container.append(sizeContainer);
sizeContainer.append(size3Button);
sizeContainer.append(size4Button);
sizeContainer.append(size5Button);
sizeContainer.append(size6Button);
sizeContainer.append(size7Button);
sizeContainer.append(size8Button);

let cells = [];
let cellSize = 100;
let numbers = [];
let timerId;

sizeContainer.addEventListener('click', (event) => {
    
    const button = event.target;
    let size = parseInt(button.innerHTML.charAt(0));
    if (button.classList.contains('button__size')) {
        field.className = `field field__${size}`;

        
        cells = [];//When choose another size clear array
        createNumbersArray(size);
        createGameField(size);
        shuffleButton.addEventListener('click', () => {
            createGameField(size)
        })
    }
});

playButton.addEventListener('click', () => {
    if (!isPlay) {
        playButton.innerHTML = 'Pause'; 
        isPlay = true;
        clearInterval(timerId);
        startTimer();
        const allSizeButtons = document.querySelectorAll('.button__size');
        allSizeButtons.forEach((btn) => btn.setAttribute('disabled', true));
        shuffleButton.setAttribute('disabled', true);
    } else {
        playButton.innerHTML = 'Play'; 
        isPlay = false;
        clearInterval(timerId);
    }
});



createGameField(3);

function createNumbersArray(size) {
    numbers = [];
    for (let i = 1; i <= size * size; i++) {
        numbers.push(i);
    }
    console.log(numbers)
}

function createGameField(size) {
    
    field.innerHTML = '';
    createNumbersArray(size)
    const shuffleNumbers = shuffleArray(numbers);
    
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        const value = shuffleNumbers[i];
        cell.className = value === size * size ? 'cell__empty' : 'cell';
        cell.innerHTML = value === size * size ? '' : value;
        
        const left = i % size;
        const top = Math.floor(i / size);
        
        cell.style.left = `${left * cellSize}px`;
        cell.style.top = `${top * cellSize}px`;
        
        if (document.body.clientWidth < 600) {
            cell.style.left = `${left * (cellSize / 2)}px`;
            cell.style.top = `${top * (cellSize / 2)}px`;
        }
        
        cells.push({
            left: left,
            top: top,
            element: cell,
            value: value,
        });
        
        field.append(cell);
    }
    listenCell() 
    
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function listenCell() {
    cells.forEach((cell, i) => {
        console.log(cell, i)
        cell.addEventListener('click', () => {
            console.log('forEach((cell');
            move(i);
            checkGameFinish(i);
        })
    })
}

function move(index) {
    console.log('Move')
    if(isPlay) {
        let empty = document.querySelector('.cell__empty');
        const emptyStyle = getComputedStyle(empty);
        let emptyLeftPosition = parseInt(emptyStyle.left);
        let emptyTopPosition = parseInt(emptyStyle.top);
        const cell = cells[index];
        const leftDifferent = Math.abs(emptyLeftPosition / cellSize - cell.left);
        const topDifferent = Math.abs(emptyTopPosition / cellSize - cell.top);
        
        if (leftDifferent + topDifferent > 1) return;
        
        cell.element.style.left = `${emptyLeftPosition}px`;
        cell.element.style.top = `${emptyTopPosition}px`;
        
        if (document.body.clientWidth < 600) {
            cell.element.style.left = `${emptyLeftPosition / 2}px`;
            cell.element.style.top = `${emptyTopPosition / 2}px`;
        }
        
        const emptyLeft = emptyLeftPosition / cellSize;
        const emptyTop = emptyTopPosition / cellSize;
        emptyLeftPosition = cell.left * cellSize;
        emptyTopPosition = cell.top * cellSize;
        cell.left = emptyLeft;
        cell.top = emptyTop;
        
        empty.style.left = `${emptyLeftPosition}px`;
        empty.style.top = `${emptyTopPosition}px`;
        
        //after each move check right position
        const isFinished = cells.every(cell => cell.value === cell.top * 3 + cell.left);
        
        if (isFinished) {
            let container = document.querySelector('.container');
            let finishPopUp = document.createElement('div');
            let finishHeading = document.createElement('h2');
            
            finishPopUp.className = 'pop-up__container';
            finishHeading.innerHTML = 'You won!'
            
            container.append(finishPopUp);
            finishPopUp.append(finishHeading)
        }
        
        counter()
    } else return
    
}

function checkGameFinish(index) {
    console.log('checkGameFinish')
    const isFinished = cells.every((cell, index) => cell.innerHTML == originalNumbers[index]);
    
    if (isFinished) {                                                                                             
        let finishPopUp = document.createElement('div');
        let finishHeading = document.createElement('h2');
        
        finishPopUp.className = 'pop-up__container';
        finishHeading.innerHTML = 'You won!'
        
        container.append(finishPopUp);
        finishPopUp.append(finishHeading)
    }
}


function startTimer() {
    timerId = setInterval(() => {
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }
        timerMinutes.innerHTML = minutes < 10 ? `0${minutes}` : minutes;
        timerSeconds.innerHTML = seconds < 10 ? `0${seconds}` : seconds;
    }, 1000);
}


function counter() {
    count++;
    if(count <= 9) {
        stepsCounter.innerHTML = '0' + count;
    } else stepsCounter.innerHTML = count;
}


saveGameButton.addEventListener('click', () => {
    const gameState = {
      cells: cells.map(cell => ({
        value: cell.value,
        left: cell.left,
        top: cell.top,
      })),
      minutes: minutes,
      seconds: seconds,
      count: count,
      isPlay: isPlay,
    };
    localStorage.setItem('gameState', JSON.stringify(gameState));
});

/*const savedGameState = localStorage.getItem('gameState');
if (savedGameState) {
    const gameState = JSON.parse(savedGameState);
    cells = gameState.cells;
    minutes = gameState.minutes;
    seconds = gameState.seconds;
    count = gameState.count;
    isPlay = gameState.isPlay;
    size = gameState.size;
    createGameField(size);
}*/