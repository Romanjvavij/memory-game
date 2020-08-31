// DOM
let inputUsername = document.querySelector("input[id='username']");
let divTimer = document.querySelector("div#timer");
let divLeaderboardDiffBtns = document.querySelector("#leaderboardDiffBtns");

// Dependencies
let timer;
let player = {};
// called in: createCardTable()
function randomizeArr(arr) {
  let temp;
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};
// called in: createPlayer()
function getUsername() { return inputUsername.value };
// called in: createPlayer(), createCardTable(), matchCards()
function getDifficulty() { return document.querySelector("input[name=difficulty]:checked").id };
// called in: createCardTable(), matchCards()
function getNumOfCards(difficulty) {
  let nCards = 0;
  difficultyCards.forEach(elem => {
    if (elem.difficulty === difficulty) {
      nCards = elem.cards;
    }
  });
  return nCards;
};
// called in: refreshLeaderboardOnClick(), checkTime()
function getTopPlayersFromLS(diff) {
  key = "topPlayers" + diff.charAt(0).toUpperCase() + diff.slice(1);
  return JSON.parse(localStorage.getItem(key));
};
// called in: refreshLeaderboardOnClick(), matchCards()
function refreshLeaderboard(diff) {
  // table refresh
  // get trs
  let trs = Array.from(document.querySelector("#leaderboardTable").querySelectorAll("tr"));
  trs.shift();
  // get topPlayers
  let topPlayers = getTopPlayersFromLS(diff);
  // if player does not exist then set "", else set player data
  for (let i = 0; i < trs.length; i++) {
    let tds = trs[i].querySelectorAll("td");
    if (topPlayers === null || topPlayers[i] === undefined) {
      tds.forEach(td => {
        td.textContent = "";
      });
    } else {
      tds[0].textContent = i + 1;
      tds[1].textContent = topPlayers[i].username;
      tds[2].textContent = topPlayers[i].time;
    }
  }

  divLeaderboardDiffBtns.querySelectorAll("input").forEach(input => {
    input.removeAttribute("class", "target");
  });
  let value = diff.charAt(0).toUpperCase() + diff.slice(1);
  divLeaderboardDiffBtns.querySelector(`input[value =${value}]`).className = "target";
}

// Input
inputUsername.addEventListener("keydown", function validate() {
  if (event.keyCode === 13) {
    let isValidUsername = this.value.trim() !== "" && this.value !== null;
    if (isValidUsername) {
      startGame();
    } else {
      alert("Please enter a valid username");
    }
  }
});

// Start
// called in: validate(), showVictoryMessage()
function startGame() {
  createPlayer();
  createCardTable();
  startTimer();
  matchCards();
};

// Player
function createPlayer() {
  player = {
    username: getUsername(),
    difficulty: getDifficulty(),
    time: null
  };
};

// Table
function createCardTable() {
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
  randomizeArr(imagesRndm);
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
function startTimer() {
  let ctr = 0;
  timer = setInterval(() => {
    ctr++;
    divTimer.textContent = ctr;
  }, 1000);
};

// Cards
function matchCards() {
  let divTable = document.querySelector("#table");
  let ctrCard = 0;
  let firstCard;
  let secondCard;
  let ctrSuccess = 0;
  let difficulty = getDifficulty();
  let noCards = getNumOfCards(difficulty);
  let isCardBusy = false;

  divTable.addEventListener("click", function runMatchCards() {
    if (event.target.tagName === "IMG" && isCardBusy === false) {
      let card = event.target.parentNode;
      // Is card fliped
      if (!card.className.includes("flip")) {
        // No, flip card and add to ctr
        card.classList.add("flip");
        ctrCard++;
        if (ctrCard === 1) {
          // Set it to firstCard
          firstCard = card;
        } else if (ctrCard === 2) {
          // Set it to secondCard
          secondCard = card;
          ctrCard = 0;
          // isMatch
          let isMatch = firstCard.querySelector(".front").alt === secondCard.querySelector(".front").alt;
          if (isMatch) {
            ctrSuccess++;
            if (ctrSuccess === noCards / 2) {
              // Victory
              divTable.removeEventListener("click", runMatchCards);
              clearInterval(timer);
              checkTime();
              refreshLeaderboard(difficulty);
              showVictoryMessage();
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

function checkTime() {
  player.time = Number(divTimer.textContent);

  let topPlayers = getTopPlayersFromLS(player.difficulty);
  if (topPlayers === null) {
    topPlayers = [];
  }
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

function showVictoryMessage() {
  let winTime = divTimer.textContent;
  setTimeout(() => {
    let newGame = confirm(`Victory!
Congratulations ${player.username} on beating the game :)
Your time is ${winTime} seconds.
Do you wish to start a new game?`);
    // if yes start newGame from time=0
    if (newGame) {
      startGame();
    }
    // if no let timer stay
  }, 100);
};

divLeaderboardDiffBtns.addEventListener("click", function refreshLeaderboardOnClick() {
  let btn = event.target;
  if (btn.tagName === "INPUT") {
    let diff = btn.value;

    refreshLeaderboard(diff);
  }
});

refreshLeaderboard("easy");
