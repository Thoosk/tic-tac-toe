///// GAMEBOARD
const gameBoard = (() => {
  let _playField = [];

  const initField = () => {
    for (let j = 0; j < 3; j++) {
      for (let i = 0; i < 3; i++) {
        _playField.push(`${j}${i}`);
      }
    }
  };

  const displayField = () => {
    return _playField;
  };

  const updateField = (move, player) => {
    const foundIndex = _playField.findIndex((field) => field === move);

    _playField[foundIndex] = player.getSign();
  };

  const resetField = () => {
    _playField = [];
    initField();
  };

  if (_playField.length === 0) {
    initField();
  }

  return {
    displayField,
    updateField,
    resetField,
  };
})();

////// PLAYER
const Player = (name, sign) => {
  const getName = () => name;
  const getSign = () => sign;

  return { getName, getSign };
};

////// GAMELOGIC
const gameLogic = (() => {
  const player1 = Player("Thomas", "X");
  const player2 = Player("Niko", "O");
  let player1Moves = [];
  let player2Moves = [];
  let currentPlayer = 1;
  let playCount = 0;
  const winningCond = [
    ["00", "01", "02"],
    ["10", "11", "12"],
    ["20", "21", "22"],
    ["00", "10", "20"],
    ["01", "11", "21"],
    ["02", "12", "22"],
    ["00", "11", "22"],
    ["02", "11", "20"],
  ];

  const startGame = () => {
    let square = Array.from(document.querySelectorAll(".square"));
    square.forEach((element) => {
      element.addEventListener("click", (event) => {
        if (checkValidity(element) === true) {
          if (currentPlayer === 1) {
            gameBoard.updateField(element.value, player1);
            renderBoard.updateBoard(element, player1);
            checkScore(element.value, player1);
            currentPlayer = 2;
          } else {
            gameBoard.updateField(element.value, player2);
            renderBoard.updateBoard(element, player2);
            checkScore(element.value, player2);
            currentPlayer = 1;
          }
        }

        console.log(gameBoard.displayField());
        console.log(element);
        console.log(element.value);
      });
    });
  };

  const checkValidity = (element) => {
    if (element.textContent === "X" || element.textContent === "O") {
      alert("This field is already used");
      return false;
    } else {
      return true;
    }
  };

  const checkScore = (move, player) => {
    playCount++;
    if (player.getSign() === "X") {
      player1Moves.push(move);
    } else {
      player2Moves.push(move);
    }

    console.log(player1Moves);

    //player1Win
    for (let item of winningCond) {
      let res = item.every((val) => player1Moves.indexOf(val) !== -1);
      if (res) {
        console.log("p1win");
        break;
      }
    }

    //player2win
    for (let item of winningCond) {
      let res = item.every((val) => player2Moves.indexOf(val) !== -1);
      if (res) {
        console.log("p2win");
        break;
      }
    }

    // for (let item of winningCond) {
    //   console.log(item.compareArrays(player1Moves));
    //   if (item.includes(player1Moves)) {
    //     console.log("Win");
    //   }
    // }

    // let isOverNineteen = winningCond.some(
    //   (cond) => cond.sort() == player1Moves.sort()
    // );
    // console.log(isOverNineteen);

    // winningCond.forEach((condition) => {
    //   console.log(condition);
    //   condition.forEach((num) => {
    //     if (player1Moves.includes(num))
    //   })
    //   if (condition == player1Moves) {
    //     console.log("win");
    //   }
    // });
  };

  const gameEnd = () => {
    alert(`${Player2} has won`);
    gameBoard.resetField();
  };

  return { startGame, currentPlayer };
})();

/// HTML RENDERING
const renderBoard = (() => {
  let board = document.querySelector("#gameboard");
  const generateBoard = () => {
    let newBoard = gameBoard.displayField();
    newBoard.forEach((element) => {
      let square = document.createElement("div");
      let sign = document.createElement("p");
      square.value = element;
      sign.textContent = " ";
      square.appendChild(sign);
      square.classList.add("square");
      board.appendChild(square);
    });
  };

  const updateBoard = (field, player) => {
    field.firstChild.innerText = player.getSign();
  };

  return {
    generateBoard,
    updateBoard,
  };
})();

renderBoard.generateBoard();
gameLogic.startGame();

// gameBoard.displayField();
// gameBoard.updateField("a3");
// gameBoard.displayField();
// gameBoard.updateField("a6");
// gameBoard.displayField();
