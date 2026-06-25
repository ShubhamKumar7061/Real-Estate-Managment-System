const list = document.getElementById("messageList");
const chatBox = document.getElementById("chatBox");

let currentReceiver = null;

// ================= LOAD MESSAGES =================
function loadMessages() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Login first ❌");
    window.location = "login.html";
    return;
  }

  fetch(`http://localhost:3000/messages/${user.user_id}`)
    .then(res => res.json())
    .then(data => {

      list.innerHTML = "";

      if (!data || data.length === 0) {
        list.innerHTML = "<h3>No messages ❌</h3>";
        return;
      }

      data.forEach(m => {
        const li = document.createElement("li");

        
        const otherUser =
          m.sender_id === user.user_id ? m.receiver_id : m.sender_id;

        li.innerHTML = `
          <b>${m.name}</b><br>
          Property: ${m.title}<br>
          Message: ${m.message}<br>

          <button onclick="openChat(${otherUser})">💬 Chat</button>

          <hr>
        `;

        list.appendChild(li);
      });
    })
    .catch(err => {
      console.log("ERROR:", err);
      list.innerHTML = "Error loading messages ❌";
    });
}

// ================= OPEN CHAT =================
function openChat(receiverId) {
  currentReceiver = receiverId;

  const user = JSON.parse(localStorage.getItem("user"));

  fetch(`http://localhost:3000/chat/${user.user_id}/${receiverId}`)
    .then(res => res.json())
    .then(data => {

      let chat = "";

      data.forEach(m => {
        const isMe = m.sender_id === user.user_id;

        chat += `
          <div style="
            margin:8px 0;
            text-align:${isMe ? "right" : "left"};
          ">
            <span style="
              display:inline-block;
              padding:8px 12px;
              border-radius:10px;
              background:${isMe ? "#007bff" : "#e4e6eb"};
              color:${isMe ? "white" : "black"};
              max-width:60%;
            ">
              ${m.message}
            </span>
          </div>
        `;
      });

      chatBox.innerHTML = chat;
    });
}

// ================= SEND REPLY =================
function sendReply() {
  const user = JSON.parse(localStorage.getItem("user"));
  const input = document.getElementById("msgInput");
  const msg = input.value.trim();

  if (!msg) {
    alert("Enter message ❌");
    return;
  }

  if (!currentReceiver) {
    alert("Select chat first ❌");
    return;
  }

  fetch("http://localhost:3000/send-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      property_id: 1,
      sender_id: user.user_id,
      receiver_id: currentReceiver,
      message: msg
    })
  })
  .then(() => {
    input.value = "";
    openChat(currentReceiver); 
  });
}

// ================= INIT =================
loadMessages();