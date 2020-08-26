// DOM
let inputUsername = document.querySelector("input[id='username']");
let divTimer = document.querySelector("div#timer");

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
  localStorage.setItem("username", username);
  createTable();
  startTimer();
  matchCards();
};

// Table
let createTable = () => {
  // Get difficulty
  let radioDifficultyChecked = document.querySelector("input[name=difficulty]:checked");
  let difficulty = radioDifficultyChecked.id;
  // Get no. of cards
  let nCards = 0;
  difficultyCards.forEach(elem => {
    if (elem.difficulty === difficulty) {
      nCards = elem.cards;
    }
  });
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
}

// Randomize array
let randomizeArr = arr => {
  let temp;
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

// Timer
let startTimer = () => {
  let ctr = 0;
  let timer = setInterval(() => {
    ctr++;
    divTimer.textContent = ctr;
  }, 1000);
};

// Cards
let matchCards = () => {
  let divTable = document.querySelector("#table");
  let ctr = 0;
  let firstCard;
  let secondCard;

  divTable.addEventListener("click", function () {
    let card = event.target.parentNode;
    // 1 is card fliped
    if (card.className.includes("flip")) {
      // 2 yes

      // 3 no
    } else {
      // 4 flip card and add to ctr
      card.classList.add("flip");
      ctr++;

      if (ctr === 1) {
        // 5 set it to firstCard
        firstCard = card;
      } else if (ctr === 2) {
        // 6 set it to secondCard
        secondCard = card;
        ctr = 0;
        console.log(firstCard, secondCard);

        if (firstCard.querySelector(".front").alt === secondCard.querySelector(".front").alt) {
          console.log("Match!");
        } else {
          setTimeout(() => {
            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");
          }, 1000);
        }
      }
    }
  });
};
