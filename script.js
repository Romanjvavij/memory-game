// DOM
let inputUsername = document.querySelector("input[id='username']");
let divTimer = document.querySelector("div#timer");

// Username
inputUsername.addEventListener("keydown", function () {
  if (event.keyCode === 13) {
    // Validation
    let username = this.value;
    if (username.trim() === "" || username === null) {
      alert("Please enter a valid username");
    } else {
      localStorage.setItem("username", username);
      this.placeholder = this.value;
      this.value = "";
    }
  }
});

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
  randomizeArr(imagesRndm); // Pitanje1: Funkcija randomizeArr() je definisana kasnije, zašto radi? Async?

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
        img.classList = "back";
      } else {
        img.src = `./img/front_face/${imagesRndm[i]}`;
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

inputUsername.addEventListener("keydown", function () {
  if (event.keyCode === 13) {
    createTable();
  }
});

// Cards
let flipCards = () => {
  let cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    card.addEventListener("click", function () {
      this.classList.toggle("flip");
    });
  });
};

inputUsername.addEventListener("keydown", function () {
  if (event.keyCode === 13) {
    flipCards();
  }
});

// Timer
let startTimer = () => {
  let ctr = 0;
  let timer = setInterval(() => {
    ctr++;
    divTimer.textContent = ctr;
  }, 1000);
};

inputUsername.addEventListener("keydown", function () {
  if (event.keyCode === 13) {
    startTimer();
  }
});

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
