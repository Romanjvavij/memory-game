// DOM
let inputUsername = document.querySelector("input[id='username']");
let divTimer = document.querySelector("div#timer");
let timer;
let player = {};

let divLeaderboardDiffBtns = document.querySelector("#leaderboardDiffBtns");

let showLeaderboard = function () {
  let btn = event.target;
  if (btn.tagName === "INPUT") {
    let diff = btn.value;

    let createLbTable = () => {
      let table = document.createElement("table");
      table.id = "leaderboardTable";
      for (let i = 0; i < 6; i++) {
        let tr = document.createElement("tr");
        table.appendChild(tr);
        if (i === 0) {
          for (let j = 0; j < 3; j++) {
            let th = document.createElement("th");
            if (j === 0) {
              th.textContent = "Place";
            } else if (j === 1) {
              th.textContent = "Username";
            } else {
              th.textContent = "Time";
            }
            tr.appendChild(th);
          }
        } else {
          let getTopPlayersFromLS = diff => { // createLbTable()
            key = "topPlayers" + diff.charAt(0).toUpperCase() + diff.slice(1);
            return JSON.parse(localStorage.getItem(key));
          };
          let topPlayers = getTopPlayersFromLS(diff);
          let player;
          topPlayers === null ? player = null : player = topPlayers[i - 1];
          if (player === null || player === undefined) {
            for (j = 0; j < 3; j++) {
              let td = document.createElement("td");
              td.textContent = "";
              tr.appendChild(td);
            }
          } else {
            for (j = 0; j < 3; j++) {
              let td = document.createElement("td");
              if (j === 0) {
                td.textContent = i;
              } else if (j === 1) {
                td.textContent = player.username;
              } else {
                td.textContent = player.time;
              }
              tr.appendChild(td);
            }
          }
        }
      }
      return table;
    };
    let newTable = createLbTable();

    let tableLeaderboard = document.querySelector("#leaderboardTable");
    let replaceLbTable = () => {
      tableLeaderboard.replaceWith(newTable);
    };
    replaceLbTable();
  }
};

divLeaderboardDiffBtns.addEventListener("click", showLeaderboard);

inputUsername.addEventListener("keydown", function () {
  if (event.keyCode === 13) {
    let isValidUsername = this.value.trim() !== "" && this.value !== null;
    if (isValidUsername) {
      startGame();
    } else {
      alert("Please enter a valid username");
    }
  }
});

let startGame = () => {
  createPlayer();
  createCardTable();
  startTimer();
  matchCards();
};

// Dependencies
let randomizeArr = arr => {
  let temp;
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};

let getUsername = () => inputUsername.value;

let getDifficulty = () => document.querySelector("input[name=difficulty]:checked").id;

let getNumOfCards = (difficulty) => {
  let nCards = 0;
  difficultyCards.forEach(elem => {
    if (elem.difficulty === difficulty) {
      nCards = elem.cards;
    }
  });
  return nCards;
};

// Player
let createPlayer = () => {
  player = {
    username: getUsername(),
    difficulty: getDifficulty(),
    time: null
  };
};

// Table
let createCardTable = () => {
  // Get difficulty
  let difficulty = getDifficulty();
  // Get no. of cards
  let nCards = getNumOfCards(difficulty);
  // Create and randomize img array
  let imagesRndm = [];
  for (let i = 0; i < nCards / 2; i++) {
    imagesRndm[2 * i] = images[i];
    imagesRndm[2 * i + 1] = images[i];
  }
  // randomizeArr(imagesRndm);
  // Create divTableNew
  let divTableNew = document.createElement("div");
  divTableNew.id = "table";
  divTableNew.className = `${difficulty}`;
  for (let i = 0; i < nCards; i++) {
    let div = document.createElement("div");
    div.className = "card";
    for (let j = 0; j < 2; j++) {
      let img = document.createElement("img");
      // Prevent img drag and drop
      img.setAttribute("onmousedown", "return false");
      if (j === 0) {
        img.src = `./img/back_face/question.png`;
        img.alt = `question`;
        img.classList = "back";
      } else {
        img.src = `./img/front_face/${imagesRndm[i]}`;
        img.alt = `${imagesRndm[i].slice(0, -4)}`;
        img.classList = "front";
      }
      div.appendChild(img);
    }
    divTableNew.appendChild(div);
  }
  // Replace divTable
  let divTable = document.querySelector("div#table");
  divTable.replaceWith(divTableNew);
};

// Timer
let startTimer = () => {
  let ctr = 0;
  timer = setInterval(() => {
    ctr++;
    divTimer.textContent = ctr;
  }, 1000);
};

// Cards
let matchCards = () => {
  let divTable = document.querySelector("#table");
  let ctrCard = 0;
  let firstCard;
  let secondCard;
  let ctrSuccess = 0;
  let difficulty = getDifficulty();
  let noCards = getNumOfCards(difficulty);
  let isCardBusy = false;

  divTable.addEventListener("click", function () {
    if (event.target.tagName === "IMG" && isCardBusy === false) {
      let card = event.target.parentNode;
      // 1 is card fliped
      if (card.className.includes("flip")) {
        // 2 yes

        // 3 no
      } else {
        // 4 flip card and add to ctr
        card.classList.add("flip");
        ctrCard++;

        if (ctrCard === 1) {
          // 5 set it to firstCard
          firstCard = card;
        } else if (ctrCard === 2) {
          // 6 set it to secondCard
          secondCard = card;
          ctrCard = 0;
          // isMatch
          let isMatch = firstCard.querySelector(".front").alt === secondCard.querySelector(".front").alt;
          if (isMatch) {
            ctrSuccess++;
            if (ctrSuccess === noCards / 2) {
              victory();
            }
          } else {
            isCardBusy = true;
            setTimeout(() => {
              firstCard.classList.remove("flip");
              secondCard.classList.remove("flip");
              isCardBusy = false;
            }, 1000);
          }
        }
      }
    }
  });
};

let victory = () => {
  checkTime();
  showVictoryMessage();
};

let checkTime = () => {
  player.time = Number(divTimer.textContent);

  let key = "topPlayers" + player.difficulty.charAt(0).toUpperCase() + player.difficulty.slice(1);
  // 1st time loading, if topPlayersDiff dosen't exist, create []
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, "[]");
  }
  let topPlayers = JSON.parse(localStorage.getItem(key));
  // add
  topPlayers.push(player);
  // sort
  let i = topPlayers.length - 1;
  for (let j = i - 1; j >= 0; j--) {
    if (topPlayers[i].time < topPlayers[j].time) {
      let temp = topPlayers[i];
      topPlayers[i] = topPlayers[j];
      topPlayers[j] = temp;
      i--;
    }
  }
  // remove 6th
  if (topPlayers.length === 6) {
    topPlayers.pop();
  }

  localStorage.setItem(key, JSON.stringify(topPlayers));
};

let showVictoryMessage = () => {
  let winTime = divTimer.textContent;
  clearInterval(timer);
  setTimeout(() => {
    let newGame = confirm(`Victory!
    Congradulations ${player.username} on beating the game :)
    Youre time is ${winTime} seconds.
    Do you wish to start a new game?`);
    // if yes start newGame from time=0
    if (newGame) {
      startGame();
    }
    // if no let timer stay
  }, 100);
};
