// username
let inputUsername = document.querySelector("input[id='username']");

inputUsername.addEventListener("keydown", function () {
  if (event.keyCode === 13) {
    // validation
    let username = this.value;
    if (username.trim() === "" || username === null) {
      alert("Please enter a valid username");
    } else {
      localStorage.setItem("username", username);
    }
  }
});
