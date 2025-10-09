const socket = io();

const messages = document.getElementById("messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const onlineUsersList = document.getElementById("online-users");
const toggleModeBtn = document.getElementById("toggle-mode");

const username = localStorage.getItem("username");

if (!username) {
  window.location.href = "/";
}

// Send login info to server
socket.emit("login", username);

// Listen for messages
socket.on("chat message", (msg) => {
  const li = document.createElement("li");
  li.textContent = msg;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

// Listen for online users update
socket.on("online users", (users) => {
  onlineUsersList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user;
    onlineUsersList.appendChild(li);
  });
});

// Send chat message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

// Dark/Light mode toggle
toggleModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
});
