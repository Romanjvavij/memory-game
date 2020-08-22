// DOM
let inputUsername = document.querySelector("input[id='username']");
let btnStart = document.querySelector("input[value=Start]");

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

// Difficulty
let difficultyCards = [
  {
    difficulty: "easy",
    cards: 16
  },
  {
    difficulty: "medium",
    cards: 36
  },
  {
    difficulty: "hard",
    cards: 64
  },
  {
    difficulty: "expert",
    cards: 100
  },
];

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
  // Create divTableNew
  let divTableNew = document.createElement("div");
  divTableNew.id = "table";
  divTableNew.className = `t-${difficulty}`;
  for (let i = 0; i < nCards; i++) {
    let div = document.createElement("div");
    let img = document.createElement("img");
    img.setAttribute("src", `./img/question.png`);
    div.appendChild(img);
    divTableNew.appendChild(div);
  }
  // Replace divTable
  let divTable = document.querySelector("div#table");
  divTable.replaceWith(divTableNew);
}

btnStart.addEventListener("click", createTable);
