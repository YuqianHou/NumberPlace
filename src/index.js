// window.onload = () => {
//   document.getElementsByClassName("ranking_btn", openChart);
// };

let levelBlank = {
  "EASY": 15,
  "NORMAL": 30,
  "HARD": 45
};

let numPl; //保存完整数独表的二维数组
let curNumPl; //保存当前游戏的数独表的二维数组
let status = 0; //0：准备  1：游戏中
let time; //保存游戏开始的时间或者游戏所用时间

//randomBlank
//params: level 难度级别
//return blanks 所有空格的坐标
let randomBlank = function(level) {
  let blankNum = levelBlank[level];
  let blanks = [];
  for (let i = 0; i < blankNum; i++) {
    let blank = {
      row: Math.floor(Math.random() * 9),
      column: Math.floor(Math.random() * 9)
    };
    let isIn = false;
    for (let j = 0; j < blanks.length; j++) {
      if (blank.row === blanks[j].row && blank.column === blanks[j].column) {
        isIn = true;
        break;
      }
    }
    if (!isIn) {
      blanks.push(blank);
    } else {
      i--;
    }
  }
  return blanks;
};

//showNumPl
//params:
//return
//开始游戏，生成完整数独表的二维数组，保存在numPl中，初始化curNumPl，渲染数独游戏界面
let showNumPl = function() {
  let level = document.getElementsByClassName("select")[0].value;
  let blankIndexs = randomBlank(level);
  try {
    numPl = NumPl.gennerateNumPl();
    console.log(numPl);
    status = 1;

    curNumPl = new Array(9);
    for (let i = 0; i < numPl.length; i++) {
      curNumPl[i] = [];
      for (let j = 0; j < numPl[i].length; j++) {
        curNumPl[i].push(numPl[i][j]);
      }
    }
    let board = document.getElementsByClassName("game")[0];
    let inputs = board.children;
    for (let i = 0; i < blankIndexs.length; i++) {
      let row = blankIndexs[i].row;
      let column = blankIndexs[i].column;
      curNumPl[row][column] = 0;
    }
    for (let i = 0; i < curNumPl.length; i++) {
      for (let j = 0; j < curNumPl[i].length; j++) {
        inputs[j * 9 + i].id = i + "&" + j;
        if (curNumPl[i][j] != 0) {
          inputs[j * 9 + i].value = curNumPl[i][j];
          inputs[j * 9 + i].readOnly = "readonly";
          inputs[j * 9 + i].style.backgroundColor = "";
        } else {
          inputs[j * 9 + i].value = "";
          inputs[j * 9 + i].readOnly = "";
          inputs[j * 9 + i].style.backgroundColor = "white";
          inputs[j * 9 + i].addEventListener("change", handleChange);
        }
      }
    }
    time = new Date().getTime();
  } catch (e) {
    console.log(e);
  }
};

//handleChange
//params: e 空格的值发生改变的事件
//return
//当空格填入的值发生改变时，对值进行监测，检查是否冲突，进行提示
let handleChange = function(e) {
  let element = e.currentTarget;
  let indexs = element.id.split("&");
  curNumPl[indexs[0]][indexs[1]] = element.value == "" ? 0 : element.value;
  let tip = document.getElementsByClassName("cur_situation")[0].children[0];
  if (
    !(
      NumPl.checkRow(indexs[0], indexs[1], element.value, curNumPl) &&
      NumPl.checkColumn(indexs[0], indexs[1], element.value, curNumPl) &&
      NumPl.checkNine(indexs[0], indexs[1], element.value, curNumPl)
    )
  ) {
    tip.innerHTML = "\nRow " + indexs[0] + ", column " + indexs[1] + " collides!";
    element.style.backgroundColor = "#f34949";
  } else {
    tip.innerHTML = "";
    element.style.backgroundColor = "white";
  }
};

//isAnswerRight
//params:
//return boolean 提交的答案是否正确
let isAnswerRight = function() {
  for (let i = 0; i < numPl.length; i++) {
    for (let j = 0; j < numPl[i].length; j++) {
      if (curNumPl[i][j] != numPl[i][j]) {
        return false;
      }
    }
  }
  return true;
};

//isAnswerFull
//params:
//return boolean 提交的数独表是否已经填满
let isAnswerFull = function() {
  for (let i = 0; i < curNumPl.length; i++) {
    for (let j = 0; j < curNumPl[i].length; j++) {
      if (curNumPl[i][j] == 0) {
        return false;
      }
    }
  }
  return true;
};

//submitAnswer
//params:
//return
//提交答案时的总处理函数
let submitAnswer = function() {
  if (status != 1) {
    alert("Let's choose a level to start the game!");
  } else if (!isAnswerFull()) {
    alert("Please fill the blank!");
  } else if (isAnswerRight() && status == 1) {
    time = ((new Date().getTime() - time) / 1000 / 60).toFixed(2);
    let tip = document.getElementsByClassName("cur_situation")[0].children[0];
    tip.innerHTML = "Please choose a level to start a new game!";
    status = 0;
    showElement("username-box");
    let timeLable = document.getElementsByClassName("time")[0];
    timeLable.innerHTML = time;
    let inputs = document.getElementsByClassName("game")[0].children;
    Array.from(inputs).forEach(element => {
      element.value = "";
      element.style.backgroundColor = "#bebebe";
      element.readOnly = "readonly";
    });
  } else if (!isAnswerRight()) {
    alert("FAIL...");
  }
};

//showElement
//params: className 需要展示的DOM元素的class样式选择器
//return
//在浏览器界面中展示某个Dom元素
let showElement = function(className) {
  document.getElementsByClassName(className)[0].style.display = "block";
  document.getElementsByClassName("game")[0].style.opacity = 0.5;
  document.getElementsByClassName("info")[0].style.opacity = 0.5;
};

//hideElement
//params: className 需要隐藏的DOM元素的class样式选择器
//return
//在浏览器界面中隐藏某个Dom元素
let hideElement = function(className) {
  document.getElementsByClassName(className)[0].style.display = "none";
  document.getElementsByClassName("game")[0].style.opacity = 1;
  document.getElementsByClassName("info")[0].style.opacity = 1;
};

//submitGrade
//params
//return
//提交成绩
let submitGrade = function() {
  // 首先判断用户名是否为空
  // let temp = document.getElementsByClassName("username")[0].value;
  // // 若为空则报错
  // if (!temp) {
  //   alert("Please enter your username!");
  //   // return;
  // }
  // 若不为空则存储用户名和时间，关闭输入框
  storeGrade();
  hideElement("username-box");
};

//closeChart
//params
//return
//关闭成绩榜单
let closeChart = function(e) {
  hideElement("rank-chart");
};

//openChart
//params
//return
//打开成绩榜单
let openChart = function() {
  showElement("rank-chart");
  let rankLis = document.getElementsByClassName("rank-li")[0].children;
  // 异步执行，当.then()前的方法执行完后再执行then()内部的程序
  request.getRanks().then(res => {
    let ranks = res;
    let maxGrade;
    for (let i = 0; i < ranks.length; i++) {
      rankLis[i].getElementsByClassName("username")[0].innerHTML =
        ranks[i].username;
      rankLis[i].getElementsByClassName("user-time")[0].innerHTML =
        ranks[i].time;

      if ((maxGrade && maxGrade.time > ranks[i].time) || !maxGrade) {
        maxGrade = ranks[i];
      }
    }
    document.getElementsByClassName("b-username")[0].innerHTML =
      maxGrade.username;
    document.getElementsByClassName("b-time")[0].innerHTML = maxGrade.time;
    for (let i = ranks.length; i < 10; i++) {
      rankLis[i].getElementsByClassName("username")[0].innerHTML = "";
      rankLis[i].getElementsByClassName("user-time")[0].innerHTML = "";
    }
  });
};

//getRank
//params
//return ranks 最近的十次成绩
//得到最近的十次成绩
let getRank = function() {
  let rankStr = "";
  let ranks = [];
  request.getRanks().then(res => {});
  if (localStorage.getItem("rank")) {
    rankStr = localStorage.getItem("rank");
    let rankArr = rankStr.split("||");
    for (let i = 0; i < rankArr.length; i++) {
      let tmp = rankArr[i].split("&");
      ranks.push({
        username: tmp[0].split("=")[1],
        time: tmp[1].split("=")[1]
      });
    }
  }
  return ranks;
};

//getMaxGrade
//params
//return maxGrade
//得到最好的一次成绩
let getMaxGrade = function() {
  let maxGradeStr = "";
  if (localStorage.getItem("maxGrade")) {
    maxGradeStr = localStorage.getItem("maxGrade");
  }
  let maxGrade = {
    username: "",
    time: ""
  };
  if (maxGradeStr) {
    let arr = maxGradeStr.split("&");
    let user = arr[0].split("=");
    let time = arr[1].split("=");
    maxGrade.username = user[1];
    maxGrade.time = time[1];
  }
  return maxGrade;
};

//storeGrade
//params
//return
//处理得到最终成绩并保存
let storeGrade = function() {
  let username = document.getElementsByClassName("username")[0].value;
  // 首先判断用户名是否为空，若为空则报错
  if (!username) {
    alert("please enter your name!");
    return;
  }
  let user = {
    username: username,
    time: time
  };
  request.updateRanks(user).then(res => {
    console.log(res);
  });
  // storeRank(user);
};
