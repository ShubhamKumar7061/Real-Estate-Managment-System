const user = JSON.parse(localStorage.getItem("user"));

const form = document.getElementById("propertyForm");
const propertyList = document.getElementById("propertyList");

// ================= LOAD =================
function loadProperties() {
  fetch("http://localhost:3000/properties")
    .then(res => res.json())
    .then(data => {
      propertyList.innerHTML = "";

      data.forEach(p => {
        const li = document.createElement("li");

        li.innerHTML = `
        <div class="property-card">

          <div class="property-info">
            <img src="${p.image ? 'http://localhost:3000/uploads/' + p.image : 'https://via.placeholder.com/80'}">
            <span><b>${p.title}</b> - ${p.location} - ₹${p.price}</span>
          </div>

          <div class="actions">

            ${user && user.role === "seller" ? `
              <button onclick="deleteProperty(${p.property_id})">❌</button>
              <button onclick="editProperty(${p.property_id}, '${p.title}', '${p.location}', ${p.price})">✏</button>
            ` : ""}

            ${user && user.role === "buyer" ? `
              <button onclick="bookProperty(${p.property_id})">📅</button>
              <button onclick="contactSeller(${p.property_id})">💬</button>
            ` : ""}

          </div>

        </div>
        `;

        propertyList.appendChild(li);
      });
    });
}

// ================= ADD =================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Login first ❌");
    window.location = "login.html";
    return;
  }

  if (user.role !== "seller") {
    alert("Only seller can add property ❌");
    return;
  }

  const title = document.getElementById("title").value.trim();
  const location = document.getElementById("location").value.trim();
  const price = document.getElementById("price").value.trim();
  const image = document.getElementById("image").files[0];

  if (!title || !location || !price) {
    alert("All fields required ❌");
    return;
  }

  if (price <= 0) {
    alert("Price must be greater than 0 ❌");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("location", location);
  formData.append("price", price);
  formData.append("owner", user.user_id);

  if (image) {
    formData.append("image", image);
  }

  fetch("http://localhost:3000/add-property", {
    method: "POST",
    body: formData
  })
  .then(() => {
    form.reset();
    loadProperties();
  });
});

// ================= DELETE =================
function deleteProperty(id) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "seller") {
    alert("Only seller can delete ❌");
    return;
  }

  if (!confirm("Delete this property?")) return;

  fetch(`http://localhost:3000/delete-property/${id}`, {
    method: "DELETE"
  }).then(() => loadProperties());
}

// ================= UPDATE =================
function editProperty(id, title, location, price) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "seller") {
    alert("Only seller can edit ❌");
    return;
  }

  const t = prompt("Enter title", title);
  const l = prompt("Enter location", location);
  const p = prompt("Enter price", price);

  if (!t || !l || !p) {
    alert("All fields required ❌");
    return;
  }

  fetch(`http://localhost:3000/update-property/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: t,
      location: l,
      price: p
    })
  }).then(() => loadProperties());
}

// ================= BOOK =================
function bookProperty(id) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Login first ❌");
    window.location = "login.html";
    return;
  }

  if (user.role !== "buyer") {
    alert("Only buyer can book ❌");
    return;
  }

  fetch("http://localhost:3000/book-property", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      property_id: id,
      user_id: user.user_id
    })
  })
  .then(() => alert("Property Booked ✅"));
}

// ================= CONTACT SELLER =================
function contactSeller(propertyId) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Login first ❌");
    window.location = "login.html";
    return;
  }

  if (user.role !== "buyer") {
    alert("Only buyer can message ❌");
    return;
  }

  const msg = prompt("Enter your message");

  if (!msg) return;

  fetch("http://localhost:3000/send-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      sender_id: user.user_id,
      property_id: propertyId,
      message: msg
    })
  })
  .then(() => alert("Message Sent to Seller ✅"));
}

// ================= LOGOUT =================
function logout() {
  localStorage.removeItem("user");
  window.location = "login.html";
}

// ================= INIT =================
loadProperties();


function searchProperty() {
  const search = document.getElementById("searchBox").value.toLowerCase();

  const properties = document.querySelectorAll(".property-card");

  properties.forEach(card => {
    const text = card.innerText.toLowerCase();

    if (text.includes(search)) {
      card.parentElement.style.display = "block";
    } else {
      card.parentElement.style.display = "none";
    }
  });
}