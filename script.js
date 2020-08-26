// DOM
let inputUsername = document.querySelector("input[id='username']");
let btnStart = document.querySelector("input[value=Start]");
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
      btnStart.disabled = false;
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

btnStart.addEventListener("click", createTable);

btnStart.addEventListener("click", function () {
  // Pitanje2: Da li flipCards može da se izvuče iz createTable eventa? Zavistan je od trenutka kada se napravi tabela..
  // flipCards
  let cards = document.querySelectorAll(".card");
  let flipCard = function () {
    this.classList.toggle("flip");
    console.log(this);
  };
  cards.forEach(card => {
    card.addEventListener("click", flipCard);
  });
});

// Timer
let timer = null;
btnStart.addEventListener("click", function () {
  btnStart.classList.toggle("started");
  if (btnStart.className.includes("started")) {
    let ctr = 0;
    if (timer === null) {
      timer = setInterval(() => {
        ctr++;
        divTimer.textContent = ctr;
      }, 1000);
    }
  } else {
    clearInterval(timer);
    divTimer.textContent = 0;
    timer = null;
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
