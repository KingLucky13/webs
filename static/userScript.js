// let userName = Напишите сюда код чтоб брать логин пользователя или типа;
// login.innerHTML = userName;
// let futureMoney = это код на бюджет в будущем
// let futbug = document.getElementById("future-budget");
// futbug.innerHTML = futureMoney;

// основные переменные
let time, sum;
let tableSum = [];
let newPrice = 1;
//alert(userBalance);
// переменные даты
var today = new Date();
document.getElementById("time").placeholder =
  `${today.getDate()}.
${+today.getMonth() + 1}.
${today.getFullYear().toString().slice(2, 4)}`;
//переменные для внесения значений на этот месяц
let prices = new Map();
let labels = [];
let nowCosts = [];
for (let i = 1; i <= new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); i++) labels.push(i);
for (let i = 0; i < new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate(); i++) nowCosts.push(0);

// переменные для внесения значений на месяца этого года
let monthsPrices = new Map();
let monthsNum = []
let monthsLabels = [
  "Январь", "Февраль", "Март", "Апрель",
  "Май", "Июнь", "Июль", "Август",
  "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
let monthsCosts = []
for (let i = 1; i < 13; i++) monthsNum.push(i);
for (let i = 1; i < 13; i++) monthsCosts.push(0);

// переменные для внесения значений на разные года
let yearsPrices = new Map();
let yearsLabels = [];
let yearsCosts = [];
for (let i = today.getFullYear() - 20; i <= today.getFullYear(); i++) yearsLabels.push(i);
for (let i = 0; i < yearsLabels.length; i++) yearsCosts.push(0);

//переменные для графика
let data = {
  labels: labels,
  datasets: [{
    label: 'Траты',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: nowCosts
  }]
};

let config = {
  type: 'line',
  data: data,
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
};

let myChart = new Chart(
  document.getElementById('myChart'),
  config
);
var table = document.getElementById("expanses");
function fillTable(data) {
	for (var i = 0; i < data.length; i++) {
		var tr = document.createElement('tr');
		
		for (var j = 0; j < data[i].length; j++) {
			var td = document.createElement('td');
      if(j==data[i].length-1){
        td.innerHTML =Math.round(data[i][j]/newPrice);
      }
      else{
			td.innerHTML = data[i][j];
      }
			tr.appendChild(td);
		}
		
		table.appendChild(tr);
	}
}
function refillTable(data){
  while(table.rows.length > 2) {
    table.deleteRow(-1);
  }
  fillTable(data);
}
function updateGraphic(date,type,sum){
  timeDate = +date.split(".")[0];
  timeMonth = date.split(".")[1] ? +date.split(".")[1] : +today.getMonth()+1
  timeYear = date.split(".")[2] ? +date.split(".")[2] : +(today.getFullYear().toString().slice(2));
  if(type=="расход"){
  if (+today.getFullYear().toString().slice(2) != timeYear) {  
    setYearsData(timeYear, sum);
    console.log("заработал иф на другой год")
    myChart.update();
  }
  // проверка на другой месяц
  if(today.getMonth()+1 != timeMonth){
    console.log("Я заработал");
    setYearsData(timeYear, sum);
    setMonthsData(timeMonth,sum);
    myChart.update();
  }
  setYearsData(timeYear, sum);
  setMonthsData(timeMonth,sum);
  updateNowPrices(timeDate, sum);
}
}
function addExpanse(form){
  let formTitle = form.title.value;
  let formType = form.type.value;
  let formCategory = form.category.value;
  let formTime = form.time.value;
  let formSum =Number( form.sum.value);
  usData.push([formTitle,formType,formCategory,formTime,formSum]);
  updateGraphic(formTime,formType,formSum);
  refillTable(usData);
  if(formType=="расход"){
    updateBalance(-formSum);
  }
  else{
    updateBalance(formSum);
  }
  document.getElementById("title").value = "";
  document.getElementById("type").value = "";
  document.getElementById("category").value = "";
  document.getElementById("time").value = "";
  document.getElementById("sum").value = "";
}
fillTable(usData);
refillTable(usData);
let csvContent = "data:text/csv;charset=utf-8,";
function filter(){
  let filtered=[];
  for(let i=0;i<usData.length;i++){
      if(usData[i][2]==document.getElementById("categoryFilter").value){
          if(usData[i][3].split(".")[1]=="2"){
              filtered.push(usData[i]);
          }
      }
  }
 refillTable(filtered);
}
function exportToCsv(){
usData.forEach(function(rowArray) {
  let row = rowArray.join(",");
  csvContent += row + "\r\n";
});
var encodedUri = encodeURI(csvContent);
window.open(encodedUri);
}
function predict(){
  let now=(usData[0][3].split(".")[1]);
  let monthSr=[];
  let nowSm=0;
  for(let i=0;i<usData.length;i++){
      if(usData[i][3].split(".")[1]!=now){
          monthSr.push(nowSm);
          nowSm=usData[i][4];
          now=usData[i][3].split(".")[1];
      }
      else{
        if(usData[i][1]=="расход"){
          nowSm+=usData[i][4];
        }
      }
  }
  let allSum=0
  for(let i=0;i<monthSr.length;i++){
      allSum+=monthSr[i];
  }
  finalSr=allSum/(monthSr.length);
  prognoz=finalSr-nowSm;
  alert("Вы потратите: "+prognoz.toString()+" к концу месяца");
  }
/*
function addFromTable(form){
  let formTitle = form.title.value;
  let formType = form.type.value;
  let formCategory = form.category.value;
  let formTime = form.time.value;
  let formSum = form.sum.value;

  addItem(formType,formCategory,formTime,formTitle,formSum);
}

function addItem(formType,formCategory,formTime,formTitle,formSum) {
  alert("add");
  // Вносит данные в таблицу, на основе данных использует другие функции
  // Беру данные с формы
 

  // if (formTitle == 0 || formType == 0  || formCategory == 0 || formTime == 0 || formSum == 0){  //проверка на вводимые данные
  //     alert("Вы не заполнили полностью таблицу!");
  //     return;
  // } //раскоменть по надобности
  tableSum.push(formSum);
  console.log(`Времена: ${timeMonth}, ${timeYear}`)
  //Добавляю всё нужное в таблицу!
  let items = [formTitle, formType, formCategory, formTime, formSum]
  let table = document.getElementById("data");
  let row = table.insertRow(0);
  let newCell, text;

  for (let i = 0; i < 5; i++) {
    newCell = row.insertCell(i);
    text = document.createTextNode(items[i]);
    newCell.appendChild(text);
  }
  newCell.classList.add("tablePrices"); //Добавил класс ячейке, чтоб не расслаблялась

  // обнуляю инпуты

  document.getElementById("title").value = "";
  document.getElementById("type").value = "";
  document.getElementById("category").value = "";
  document.getElementById("time").value = "";
  document.getElementById("sum").value = "";

  updateBalance(-formSum); //Обновляю баланс при новой сумме

  // проверка на другой год
  if (+today.getFullYear().toString().slice(2) != timeYear) {  
    setYearsData(timeYear, formSum);
    console.log("заработал иф на другой год")
    updateTable();
    myChart.update();
    return;
  }

  // проверка на другой месяц
  if(today.getMonth()+1 != timeMonth){
    console.log("Я заработал");
    setYearsData(timeYear, formSum);
    setMonthsData(timeMonth,formSum);
    updateTable();
    myChart.update();
    return;
  }
  setYearsData(timeYear, formSum);
  setMonthsData(timeMonth,formSum);
  updateNowPrices(timeDate, formSum);
}
*/
function setMonthsData(month, sum) {
  // При вводе другого месяца вносит данные в нужные переменные
  if (monthsPrices.has(month)) {
    let sumValue = +(monthsPrices.get(month));
    monthsPrices.set(month, (sumValue + sum)); //если время было введено, добавляет новую сумму
  } else {
    monthsPrices.set(month, +sum);
  }
  updateMonthPrice()

}

function setYearsData(year, sum) {
  // При вводе другого года вносит данные в нужные переменные
  if (yearsPrices.has(year)) {
    let sumValue = +(yearsPrices.get(year));
    yearsPrices.set(year, (sumValue + sum)); //если время было введено, добавляет новую сумму
  } else {
    yearsPrices.set(year, +sum);
  }
  updateYearPrice();

}

// Функции, обновляющие что-то на странице и/или некоторые переменные

function updateNowPrices(time, sum) {
  // Обновляет map nowPrices при вводе новых значений в таблицу
  // добавляю в мап prices данные 

  if (prices.has(time)) {
    let sumValue = +(prices.get(time));
    prices.set(time, (sumValue + sum)); //если время было введено, добавляет новую сумму
    updatePrice();
    updateTable();
    myChart.update();
    return
  }

  prices.set(time, sum);
  updatePrice();
  updateTable();
  myChart.update();
}

function updateBalance(sum) {
  // Обновляет баланс на странице и переменную
  balance = balance + sum;
  let bal = document.getElementById("balance");
  showBalance = Math.round(balance / newPrice);
  inflation();
  bal.innerHTML = showBalance;
}

function updatePrice() {
  // Функция для обновления цен графика по дням

  for (let i = 0; i < labels.length; i++) {
    if (prices.has(labels[i])) {
      if (!(+prices.get(labels[i]) / newPrice)) return;
      nowCosts[i] = (+prices.get(labels[i]) / newPrice);
    }
  }
  prices.delete(NaN);
}

function updateMonthPrice(){
  // Функция для обновления цен графика по месяцам
  for (let i = 0; i < monthsLabels.length; i++) {
    if (monthsPrices.has(+monthsNum[i])) {
      monthsCosts[i] = (+monthsPrices.get(monthsNum[i]) / newPrice);
    }
  }
}

function updateYearPrice(){
  //  // Функция для обновления цен графика по годам
  for (let i = 0; i < yearsLabels.length; i++) {
    if (yearsPrices.has(+yearsLabels[i].toString().slice(2))) {
      yearsCosts[i] = (+yearsPrices.get(+yearsLabels[i].toString().slice(2)) / newPrice);
    }
  }
}
function updateTable() {
  // обновляет таблицу при вводе условной цены

  let tablePrices = document.getElementsByClassName("tablePrices")
  let revTS = tableSum.concat([]);
  revTS.reverse()
  for (let i = 0; i < tablePrices.length; i++) {
    tablePrices[i].innerHTML = Math.round((+revTS[i]) / newPrice * 1000) / 1000;
  }
}

// функции, которые берут переменные со страницы
function getBalance(bal) {
  // берёт баланс со страницы
  balance = bal.value;
  updateBalance(0);
}

function getPrice(price) {
  // Берём цену, введёную пользователем, обнуляем инпут
  newPrice = +price.value;
  price.value = "";

  if (!newPrice) { newPrice = 1; return alert("Введите число!") } //Проверка на число
  refillTable(usData);
  price.placeholder = newPrice;
  updateBalance(0);
  updateYearPrice();
  updateMonthPrice()
  updatePrice();
  updateTable();
  myChart.update()
}

// Функции, обновляющие граф по датам

function nowGraph() {
  // текущий месяц
  data.labels = labels;
  data.datasets[0].data = nowCosts;
  myChart.update();
}

function monthsGraph() {
  // месяца в этом году
  data.labels = monthsLabels;
  data.datasets[0].data = monthsCosts;
  myChart.update();
}

function yearsGraph() {
  // Года
  data.labels = yearsLabels;
  data.datasets[0].data = yearsCosts;
  myChart.update();
}
function inflation(){
  index=1.012;
  if(document.getElementById("threeMonths").checked){
    months=3;
  }
  else if(document.getElementById("sixMonths").checked){
    months=6;
  }
  else{
    months=12;
  }
   document.getElementById("futureBudget").innerHTML=Math.round(balance/(index**months)/newPrice);
}