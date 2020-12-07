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
  let player1 = Player(prompt("Name of Player 1 (X)", "Player1"), "X");
  if (player1.getName() === null) {
    player1 = Player(prompt("Please enter a valid name for Player 1"), "X");
  }

  let player2 = Player(prompt("Name of Player 2 (O)", "Player2"), "O");
  if (player2.getName() === null) {
    player2 = Player(prompt("Please enter a valid name for Player 2"), "O");
  }

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
    renderBoard.setNames(player1, player2);
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
      });
    });
  };

  const checkValidity = (element) => {
    if (element.textContent === "X" || element.textContent === "O") {
      alert("This field is already marked");
      return false;
    } else {
      return true;
    }
  };

  const checkScore = (move, player) => {
    playCount++;
    console.log(playCount);
    if (player.getSign() === "X") {
      player1Moves.push(move);
    } else {
      player2Moves.push(move);
    }

    //player1Win
    for (let item of winningCond) {
      let res = item.every((val) => player1Moves.indexOf(val) !== -1);
      if (res) {
        gameEnd(player1.getName());
        break;
      }
    }

    //player2win
    for (let item of winningCond) {
      let res = item.every((val) => player2Moves.indexOf(val) !== -1);
      if (res) {
        gameEnd(player2.getName());
        break;
      }
    }

    if (playCount >= 9) {
      gameEnd("NOBODY");
    }
  };

  const gameEnd = (player) => {
    alert(`${player} has won`);
    let anotherGame = prompt("Want another game? (Y for yes)").toLowerCase();
    if (anotherGame === "y") {
      player1Moves = [];
      player2Moves = [];
      gameBoard.resetField();
      renderBoard.resetBoard();
      renderBoard.generateBoard();
      startGame();
    }
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

  let leftSide = document.querySelector("#left-side");
  let rightSide = document.querySelector("#right-side");
  const setNames = (player1, player2) => {
    let player1Name = document.createElement("h1");
    player1Name.textContent = player1.getName();
    let player1Sign = document.createElement("p");
    player1Sign.textContent = "X";
    leftSide.appendChild(player1Name);
    leftSide.appendChild(player1Sign);
    let player2Name = document.createElement("h1");
    player2Name.textContent = player2.getName();
    let player2Sign = document.createElement("p");
    player2Sign.textContent = "O";
    rightSide.appendChild(player2Name);
    rightSide.appendChild(player2Sign);
  };

  const updateBoard = (field, player) => {
    field.firstChild.innerText = player.getSign();
  };

  const resetBoard = () => {
    while (board.firstChild) {
      board.removeChild(board.lastChild);
    }
    while (leftSide.firstChild) {
      leftSide.removeChild(leftSide.lastChild);
      rightSide.removeChild(rightSide.lastChild);
    }
  };

  return {
    generateBoard,
    updateBoard,
    resetBoard,
    setNames,
  };
})();

renderBoard.generateBoard();
gameLogic.startGame();
renderBoard.setNames();
