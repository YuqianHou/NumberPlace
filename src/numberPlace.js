// numberPlace.js
// 闭包
// 立即执行函数，暴露了生成数独的函数，但是其他私有函数没有暴露出来
let NumPl = (function() {
  let gennerateArr = function () {
    let arr = new Array(9);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(9);
      arr[i].fill(0, 0, 9);
    }
    return arr
  }

  let init = function(firstRow) {
    for (let i = 0; i < firstRow.length; i++) {
      while (true) {
        let rand = Math.floor(Math.random() * 9 + 1);
        if (firstRow.indexOf(rand) === -1) {
          firstRow[i] = rand;
          break;
        }
      }
    }
  }

  let judge = function(row, column, num, numPl) {
    //judge row
    for (let i = 0; i < column; i++) {
      if (numPl[row][i] === num) {
        return false;
      }
    }
    //judge column
    for (let i = 0; i < row; i++) {
      if (numPl[i][column] === num) {
        return false;
      }
    }
    //judge local
    let count = column % 3 + row % 3 * 3;
    while (count--) {
      if (numPl[row - row % 3 + Math.floor(count / 3)][column - column % 3 + count % 3] === num) {
        return false;
      }
    }
    return true;
  }

  let gennerateNumPl = function() {
    let numPl = gennerateArr();
    init(numPl[0]);
    let filltime = 0;

    for (let i = 1; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        filltime = 0;
        while(filltime < 10) {
          let num = Math.floor(Math.random() * 9 + 1);
          if (judge(i, j, num, numPl)) {
            numPl[i][j] = num;
            break;
          } else {
            filltime++;
          }
        }
        if (filltime >= 10) {
          if (j === 0) {
            i--;
            j = 8;
          } else {
            j--;
            j--;
          }
        }
      }
    }
    return numPl;
  }

  let checkRow = function(row, column, num, curNumPl) {
    for (let i = 0; i < 9; i++) {
      if (curNumPl[row][i] == 0) {
        continue;
      }
      if (curNumPl[row][i] == num && i != column) {
        return false;
      }
    }
    return true;
  }
  
  let checkColumn = function(row, column, num, curNumPl) {
    for (let i = 0; i < 9; i++) {
      if (curNumPl[i][column] == 0) {
        continue;
      }
      if (curNumPl[i][column] == num && i != row) {
        return false;
      }
    }
    return true;
  }
  
  let checkNine = function (row, column, num, curNumPl) {
    let j = Math.floor(row / 3) * 3;
    let k = Math.floor(column / 3) * 3;
    // 循环比较
    for (let i = 0; i < 8; i++) {
      if (curNumPl[j + Math.floor(i / 3)][k + i % 3] == 0) {
        continue;
      }
      if (curNumPl[j + Math.floor(i / 3)][k + Math.round(i % 3)] == num && row != j + Math.floor(i / 3) && column != k + Math.round(i % 3)) {
        return false;
      }
    }
    return true;
  }

  return {
    gennerateNumPl: gennerateNumPl,
    judge: judge,
    checkRow: checkRow,
    checkColumn: checkColumn,
    checkNine: checkNine
  };
})()
