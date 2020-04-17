let from = "RUB";
let to = "USD";

let leftInputAmount = 1;// 1 - input, 2 - output

//=================================================================================================================
//
const constCurrencySymbolsLeftSide = document.querySelectorAll(
  ".first-block-convert .select-currency span"
);
const selectableCurrencySymbolsLeftSide = document.querySelector(
  ".first-block-convert select"
);

const constantCurrencySymbolsRightSide = document.querySelectorAll(
  ".second-block-convert .select-currency span"
);
const selectableCurrencySymbolsRightSide = document.querySelector(
  ".second-block-convert select"
);

const loading = document.querySelector(".loading-alert");//finding element with indicated class

const infoTextLeft = document.querySelector(".convert-first span");
const infoTextRight = document.querySelector(".convert-sec span");

// Get the input box
const input = document.getElementById("add-number-to-convert");
const output = document.getElementById("get-converted-number");
//==================================================================================================================

// change background color of currency indicator on input side on event "click"
// find the selected currency

constCurrencySymbolsLeftSide.forEach((element) => {
  element.addEventListener("click", changeLeftSideConstSymbols);
});
selectableCurrencySymbolsLeftSide.addEventListener("click", changeLeftSideSelectSymbols);

//from currency (not select)
//makes changes in classList of the elements. constant input side Currency Symbols
function changeLeftSideConstSymbols(e) {
  constCurrencySymbolsLeftSide.forEach((element) => {
    element.classList.remove("active-insert");
  });
  e.target.classList.add("active-insert");
  updateAmount();
}

// from currency (select)
//makes changes in classList of the elements. selectable input side currency symbols
function changeLeftSideSelectSymbols() {
  constCurrencySymbolsLeftSide.forEach((element) => {
    element.classList.remove("active-insert");
  });
  updateAmount();
}

// change background color of currency indicator on output side on event "click"
// find the selected currency
constantCurrencySymbolsRightSide.forEach((event) => {
  event.addEventListener("click", changeRightSideConstSymbols);
});
selectableCurrencySymbolsRightSide.addEventListener("click", changeRightSideSelectSymbols);

//to currency (not selected)
//makes changes in classList of the elements. constant output side Currency Symbols
function changeRightSideConstSymbols(e) {
  constantCurrencySymbolsRightSide.forEach((element) => {
    element.classList.remove("active-get");
  });
  e.target.classList.add("active-get");
  updateAmount();
}

//to currency
//makes changes in classList of the elements. selectable output side currency symbols
function changeRightSideSelectSymbols() {
  constantCurrencySymbolsRightSide.forEach((element) => {
    element.classList.remove("active-get");
  });
  updateAmount();
}

//======================================================================================================
//identify which currency is selected
function selectedCurrency() {
  let currencyLeftSide;
  let currencyRightSide;
  //if there is no symbol with mentioned class, then currency on left side equals to the value of selected currency
  if (document.querySelector(".active-insert") == null) {
    currencyLeftSide = selectableCurrencySymbolsLeftSide.value;
  } else {//otherwise it equals to the innerText of the currency with mentioned class name
    currencyLeftSide = document.querySelector(".active-insert").innerText;
  }

  if (document.querySelector(".active-get") == null) {
    currencyRightSide = selectableCurrencySymbolsRightSide.value;
  } else {
    currencyRightSide = document.querySelector(".active-get").innerText;
  }
  return [currencyLeftSide, currencyRightSide];//function returns array of currency names right and left side respectively
}

//==================================================================================================================
// Init a timeout variable to be used below
let timeout = null;

// Listen for keystroke events
input.addEventListener("keyup", (e) => {
  let event = e;
  // Clear the timeout if it has already been set.
  // This will prevent the previous task from executing
  // if it has been less than <MILLISECONDS>
  clearTimeout(timeout);
  // Make a new timeout set to go off in 2000ms (2 second)
  timeout = setTimeout(function (e) {
    leftInputAmount = 1;
    updateAmount();
  }, 2000);
});

// Listen for keystroke events
output.addEventListener("keyup", (e) => {
  let event = e;
  // Clear the timeout if it has already been set.
  // This will prevent the previous task from executing
  // if it has been less than <MILLISECONDS>
  clearTimeout(timeout);
  // Make a new timeout set to go off in 2000ms (2 second)
  timeout = setTimeout(function () {
    leftInputAmount = 2;
    updateAmount();
  }, 2000);
});

//=============================================================================================================
//function that sends request to the server via API
function updateAmount() {
  let currencyLeftSide = selectedCurrency()[0];//0th element of the function's return
  let currencyRightSide = selectedCurrency()[1];//1st element of the function's return

  loading.style.display = "flex";

  const reqPromise = fetch(
    `https://api.ratesapi.io/api/latest?base=${currencyLeftSide}&symbols=${currencyRightSide}`
  );

  reqPromise
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      exchangeRate = result.rates[currencyRightSide];

      if (leftInputAmount == 1) {
        output.value = (input.value * exchangeRate).toFixed(4);
      } else {
        input.value = (output.value / exchangeRate).toFixed(4);
      }
      loading.style.display = "none";

      infoTextLeft.innerHTML = `1 ${currencyLeftSide} = ${(
        result.rates[currencyRightSide]
      ).toFixed(4)} ${currencyRightSide}`;
      infoTextRight.innerHTML = `1 ${currencyRightSide} = ${(1 / result.rates[
        currencyRightSide
      ]).toFixed(4)} ${currencyLeftSide}`;

    });
}

//==================================================================================================================
//

let swap = document.querySelector(".swap");
swap.addEventListener("click", swapActive);
function swapActive() {

  //
  let firstNum = output.value;
  let secondNum = input.value;

  input.value = firstNum;
  output.value = secondNum;

  let firstInfoTex = infoTextLeft.innerText;
  let secondInfoTex = infoTextRight.innerText;

  infoTextLeft.innerHTML = secondInfoTex;
  infoTextRight.innerHTML = firstInfoTex;
  

  
  // checking if insert/get currency row/select are set 
  insertSelectIsSet = true;
  getSelectIsSet = true;

  let insert = null;
  let get = null;
  constCurrencySymbolsLeftSide.forEach((element, i) => {
    if (element.classList.contains("active-insert")) {
      insertSelectIsSet = false;
      insert = i;
      element.classList.remove("active-insert");
    }
  });

  constantCurrencySymbolsRightSide.forEach((element, i) => {
    if (element.classList.contains("active-get")) {
      getSelectIsSet = false;// if tab selected, then <select></select> is not selected.
      get = i;
      element.classList.remove("active-get");
    }
  });

  constCurrencySymbolsLeftSide.forEach((element, i) => {
    if (i == get) {
      element.classList.add("active-insert");
      currencyLeftSide = element.value;
    }
  });

  constantCurrencySymbolsRightSide.forEach((element, i) => {
    if (i == insert) {
      element.classList.add("active-get");
      currencyRightSide = element.value;
    }
  });

  //swapping the values of selectable currency
  swapCurrencyLeftSide = selectableCurrencySymbolsLeftSide.value;
  swapCurrencyRightSide = selectableCurrencySymbolsRightSide.value;

  if (insertSelectIsSet) {
    selectableCurrencySymbolsRightSide.value = swapCurrencyLeftSide;
  } 

  if (getSelectIsSet) {
    selectableCurrencySymbolsLeftSide.value = swapCurrencyRightSide;
  }
}

updateAmount();//calling the function