// const numbers = document.querySelector('.numbers'); 

// for (let i = 0; i < 10; i++){
//     const button = document.createElement('button');
//     button.classList.add('number');
//     button.setAttribute('data-number', i); 
//     button.textContent = i; 
//     numbers.appendChild(button); 
// } 

const calculator = {
    firstPrecedence: {
        '*': (x, y) => x * y, 
        '/': (x, y) => x / y  
    }, 
    secondPrecedence: {
        '+': (x, y) => x + y, 
        '-': (x, y) => x - y
    }
};

const output = document.querySelector('.output'); 

const numberButtons = document.querySelectorAll('button.number'); 
const operatorButtons = document.querySelectorAll('button.operator'); 

const deleteButton = document.querySelector('.delete'); 
const clearButton = document.querySelector('.clear'); 
const equateButton = document.querySelector('.equate'); 

const equationArr = [0]; 

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        const num = +button.dataset.number;  
        
        const lastIndex = equationArr.length - 1; 
        const lastEntry = equationArr[lastIndex]; 
        const entryBeforeLast = equationArr[lastIndex - 1];
        
        if (lastEntry === 0 && typeof entryBeforeLast !== 'number' && entryBeforeLast !== '.'){
            equationArr[lastIndex] = num; 
        } else if (typeof lastEntry === 'number') {
            equationArr[lastIndex] = +(`${lastEntry}${num}`); 
        } else {
            equationArr.push(num); 
        }
        updateOutput(); 
   }); 
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const op = button.dataset.operator; 

        const lastIndex = equationArr.length - 1; 
        const lastEntry = equationArr[lastIndex]; 

        if (isOperator(lastEntry)){
            equationArr[lastIndex] = op; 
        } else {
            equationArr.push(op); 
        }
        updateOutput(); 
    })
});

deleteButton.addEventListener('click', () => {
    const lastIndex = equationArr.length - 1; 
    const lastEntry = equationArr[lastIndex]; 
    const entryBeforeLast = equationArr[lastIndex - 1];

    if (typeof lastEntry === 'number' && !(isOperator(entryBeforeLast) && (''+lastEntry).length === 1)) { // If entryBeforeLast is operator and the number is a single digit for lastEntry, delete gets stuck turning lastEntry to zero so second check was added
        equationArr[lastIndex] = Math.floor(lastEntry/10); 
    } else {
        equationArr.pop(); 
    }  
    updateOutput(); 
});

clearButton.addEventListener('click', () => {
    equationArr.length = 1; 
    equationArr[0] = 0; 
    updateOutput(); 
}); 

function isOperator(questioned) {
    for (const key in calculator.firstPrecedence){
        if (key === questioned){
            return true; 
        }
    }
    for (const key in calculator.secondPrecedence){
        if (key === questioned){
            return true; 
        }
    }
    return false;
}

function updateOutput(){
    output.textContent = equationArr.join(''); 
}

updateOutput(); 
