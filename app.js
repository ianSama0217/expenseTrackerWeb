const body = document.body;
//視窗新增按鈕
const addPopUpWindow = document.getElementById("addPopUpWindow");
//新增彈跳視窗
const addJumpWindow = document.getElementById("addJumpWindow");
//關閉按鈕
const addJumpWindowCloseBtn = document.getElementById("addJumpWindowCloseBtn");
//add彈跳視窗內的input
const inputText = document.getElementById("inputText");
const inputAmount = document.getElementById("inputAmount");
const incomeCheck = document.getElementById("incomeCheck");
const expenseCheck = document.getElementById("expenseCheck");

//點擊主畫面add按鈕顯示彈跳視窗
addPopUpWindow.addEventListener("click", () => {
  addJumpWindow.style.display = "block";
  body.style.backgroundColor = "rgba(0,0,0,0.5)";
});

//點擊彈跳視窗關閉按鈕,關閉彈跳視窗
addJumpWindowCloseBtn.addEventListener("click", () => {
  addJumpWindow.style.display = "none";
  body.style.backgroundColor = "white";
});

//儲存textValue&amountValue到localstorage內
let projectData = [];

//創建list方法
function createList(text, amount, color, className) {
  //detailListArea用來存放新增的元素
  const detailListArea = document.getElementById("detailListArea");

  let detailListBox = document.createElement("div");
  detailListBox.classList.add("detailListBox");

  let p = document.createElement("p");
  p.classList.add("textValue");
  p.innerHTML = `${text}`;

  let p2 = document.createElement("p");
  p2.classList.add("amountValue");
  p2.innerHTML = `$ ${amount}`;
  //判斷amountValue是income還是expense
  if (color) {
    p2.style.color = color;
  }
  if (className) {
    p2.classList.add("className");
  }

  //用來排版的容器
  let div = document.createElement("div");
  div.classList.add("rightSideBox");

  let deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("id", "deletePopUpWindow");

  //在按鈕內加入文字
  let deleteBtnText = document.createTextNode("Delete");
  deleteBtn.appendChild(deleteBtnText);

  //點擊list的delete按鈕會直接刪除list(沒有彈跳視窗)
  deleteBtn.addEventListener("click", (e) => {
    //從storage的陣列中移除指定資料
    const projectInfo = {
      text: text,
      amount: amount,
      color: color,
      className: className,
    };
    deleteStorageValue(projectInfo);

    //remove只有刪除網頁上的list，沒有刪除storage內的資料
    e.target.parentElement.parentElement.remove();

    setIncome();
    setExpense();
    setBalance();
  });

  //將創建的元素加入置detailListArea子元素內
  detailListArea.appendChild(detailListBox);
  detailListBox.appendChild(p);
  detailListBox.appendChild(div);
  div.appendChild(p2);
  div.appendChild(deleteBtn);

  //創建一個物件保留儲存訊息
  let projectInfo = {
    text: text,
    amount: amount,
    color: color,
    className: className,
  };

  projectData.push(projectInfo);

  //回傳p，p2讓網頁重啟可以用來加入資料
  return { p, p2 };
}

//按下delete後，刪除storage內部資料的方法
function deleteStorageValue(projectInfo) {
  const savedData = JSON.parse(localStorage.getItem("projectData")) || [];
  //從projectData內找到指定projectInfo資料
  let index = savedData.findIndex((element) => {
    return compareProjectInfo(element, projectInfo); //比對兩筆資料是否相同
  });
  //搜尋Data內部是否有指定資料，若沒有澤會回傳-1
  if (index != -1) {
    projectData.splice(index, 1); //從index開始刪除1個項目

    //刪除後更新localstorage資料
    localStorage.setItem("projectData", JSON.stringify(projectData));

    //刪除後更新總值
    setIncome();
    setExpense();
    setBalance();
  }
}

//比對要刪除的資料與storage內部資料是否相同方法
function compareProjectInfo(element1, element2) {
  return (
    element1.text === element2.text &&
    element1.amount === element2.amount &&
    element1.color === element2.color &&
    element1.className === element2.className
  );
}

//典籍彈跳視窗內的addbtn創建List
const addAmount = document.getElementById("addAmount");

addAmount.addEventListener("click", () => {
  const text = inputText.value;
  const amount = inputAmount.value;

  let color = null;
  let className = null;

  if (incomeCheck.checked) {
    color = "#70A53C";
    className = "greenText";
  } else if (expenseCheck.checked) {
    color = "#A53C42";
    className = "redText";
  }
  createList(text, amount, color, className);
  saveValue();
  printValue();

  //印出消費總值
  setIncome();
  setExpense();
  setBalance();

  //創建完之後關閉彈跳視窗
  // addJumpWindow.style.display = "none";
  // body.style.backgroundColor = "white";
});

function saveValue() {
  //在跟storage要資料前，先確認storage內有沒有已存在的資料，
  //如果有，在舊資料後面新增新的資料
  let savedData = JSON.parse(localStorage.getItem("value")) || [];

  //更新資料後將資料儲存到localStorage
  localStorage.setItem("projectData", JSON.stringify(projectData));
  return projectData;
}

//將儲存的值印出顯示在List中
function printValue() {
  let savedData = JSON.parse(localStorage.getItem("projectData"));

  return savedData;
}

//開啟瀏覽器，印出List
window.addEventListener("load", () => {
  let result = printValue();

  //印出storage內的資料
  result.forEach((element) => {
    let getValue = createList(
      element.text,
      element.amount,
      element.color,
      element.className
    );
  });

  setIncome();
  setExpense();
  setBalance();
});

//設定income總值
const printIncomeTotal = document.getElementById("income");

function setIncome() {
  let incomeTotal = 0;

  let result = printValue();
  //console.log(result);

  result.forEach((element) => {
    if (element.className == "greenText") {
      incomeTotal += parseInt(element.amount);
    }
  });

  //將資料放進文字標籤內
  printIncomeTotal.innerHTML = `$ ${incomeTotal}`;

  return incomeTotal;
}

//設定expense總值
const printExpenseTotal = document.getElementById("expense");

function setExpense() {
  let expenseTotal = 0;

  let result = printValue();

  result.forEach((element) => {
    if (element.className == "redText") {
      expenseTotal += parseInt(element.amount);
    }
  });

  //將資料放進文字標籤內
  printExpenseTotal.innerHTML = `$ ${expenseTotal}`;
  return expenseTotal;
}

//設定balance總值
const printBalanceTotal = document.getElementById("balance");

function setBalance() {
  let balanceTotal = 0;
  let income = setIncome();
  let expense = setExpense();

  balanceTotal = income - expense;
  console.log("總收入: " + income);
  console.log("總支出: " + expense);
  console.log("結餘: " + balanceTotal);
  //將資料放進文字標籤內
  printBalanceTotal.innerHTML = `$ ${balanceTotal}`;

  return balanceTotal;
}
