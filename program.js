// const numbers = document.querySelector('.numbers'); 

// for (let i = 0; i < 10; i++){
//     const button = document.createElement('button');
//     button.classList.add('number');
//     button.setAttribute('data-number', i); 
//     button.textContent = i; 
//     numbers.appendChild(button); 
// } 

const calculator = {
    '.': (x, y) => +`${x}.${y}`, //special operator
    '*': (x, y) => x * y, 
    '/': (x, y) => x / y, 
    '+': (x, y) => x + y, 
    '-': (x, y) => x - y
};

const output = document.querySelector('.output'); 

const numberButtons = document.querySelectorAll('button.number'); 
const operatorButtons = document.querySelectorAll('button.operator'); 

const deleteButton = document.querySelector('.delete'); 
const clearButton = document.querySelector('.clear'); 
const equateButton = document.querySelector('.equate'); 

const decimalizer = document.querySelector(".special-operator[data-operator='.']"); 

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

decimalizer.addEventListener('click', () => {
    const op = '.'; 
    
    const lastIndex = equationArr.length - 1; 
    const lastEntry = equationArr[lastIndex]; 
    const entryBeforeLast = equationArr[lastIndex - 1];

    if (isOperator(lastEntry)){
        equationArr[lastIndex] = op; 
    } else if (entryBeforeLast === op){
        return; 
    } else {
        equationArr.push(op); 
    }
    updateOutput(); 

});

deleteButton.addEventListener('click', () => {
    const lastIndex = equationArr.length - 1; 
    const lastEntry = equationArr[lastIndex]; 
    const entryBeforeLast = equationArr[lastIndex - 1];

    if (typeof lastEntry === 'number' && !(isOperator(entryBeforeLast) && (''+lastEntry).length === 1)) { // If entryBeforeLast is operator and the number is a single digit for lastEntry, delete gets stuck turning lastEntry to zero so second check was added
        equationArr[lastIndex] = (lastEntry < 0) ? Math.floor(lastEntry*-1/10)*-1 : Math.floor(lastEntry/10); 
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

equateButton.addEventListener('click', () => {
    if (isOperator(equationArr[equationArr.length - 1])) {
        equationArr.pop(); 
    }

    conductOperations(equationArr, '.'); 
    conductOperations(equationArr, '*', '/'); 
    conductOperations(equationArr, '+', '-'); 
    let result = equationArr[0];
    if (!Number.isInteger(result)) { //Must split apart a decimal result so it can be deleted properly (adding a decimal operation will recombine it for later us)
        const stringedResult = (''+result); 
        const dotInd = stringedResult.indexOf('.');
        const firstHalf = stringedResult.slice(0, dotInd);  
        const secondHalf = stringedResult.slice(dotInd+1, stringedResult.length); 
        equationArr[0] = +firstHalf;  
        equationArr[1] = '.'; 
        equationArr[2] = +secondHalf; 
    }
    updateOutput(); 
});

updateOutput(); 

function conductOperations(arr, ...args){
    

    const ops = args; 

    let lastIndexFound = arr.findIndex((entry) => ops.includes(entry)); 
 
    while (lastIndexFound > -1) {
        const opFound = arr[lastIndexFound]; 
        const x = arr[lastIndexFound - 1]; 
        const y = arr[lastIndexFound + 1];  
        const result = calculator[opFound](x, y);
        arr.splice(lastIndexFound-1, 3, result); 
        lastIndexFound = arr.findIndex((entry) => ops.includes(entry)); 
    }  
}

function isOperator(questioned) {
    for (const key in calculator){
        if (key === questioned){
            return true; 
        }
    }
    return false;
}

function updateOutput(){
    output.textContent = equationArr.join(''); 
}

