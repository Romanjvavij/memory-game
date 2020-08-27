// DOM
let inputUsername = document.querySelector("input[id='username']");
let divTimer = document.querySelector("div#timer");
let isVictory = false;
let timer;

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
  let username = inputUsername.value;
  localStorage.setItem("username", username);
  createTable();
  startTimer();
  matchCards();
  victory();
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

// Table
let createTable = () => {
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
              isVictory = true;
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
  let divTable = document.querySelector("#table");
  divTable.addEventListener("click", function () {
    if (isVictory) {
      let winTime = divTimer.textContent;
      clearInterval(timer);
      let name = localStorage.getItem("username");
      alert(`Victory!
      Congradulations ${name} on beating the game :)
      Youre time is ${winTime} seconds.
      Try other difficulties to test your skill.`);
    }
  });
};
