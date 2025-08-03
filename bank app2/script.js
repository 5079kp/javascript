// ===========================
// GLOBAL ELEMENTS
// ===========================
const loginForm = document.getElementById("loginForm");
const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");
const profilePhoto = document.getElementById("profilePhoto"); // ✅ FIXED: Renamed from profile-Photo
const sidebarName = document.getElementById("sidebarName");
const sidebarEmail = document.getElementById("sidebarEmail");
const totalAmount = document.getElementById("totalAmount");
const historyList = document.getElementById("historyList");

let currentBalance = 30000; // Initial balance in INR

// ===========================
// LOGIN EVENT
// ===========================
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const user = document.getElementById("username").value.trim();
  const account = document.getElementById("account").value.trim();

  // Show Dashboard
  loginScreen.style.display = "none";
  dashboardScreen.style.display = "flex";

  // Sidebar Update
  sidebarName.textContent = user;
  sidebarEmail.textContent = account;

  // Update Card Holder Name and Number (only if exists)
  const cardHolder = document.querySelector(".card-holder");
  const cardNumber = document.querySelector(".card-number");

  if (cardHolder) cardHolder.textContent = user;
  if (cardNumber) {
    const last4Digits = account.slice(-4).padStart(4, "0");
    cardNumber.textContent = `•••• •••• •••• ${last4Digits}`;
  }

  setProfilePhoto(user);
  updateBalance();
  loadChart();
});

// ===========================
// SET PROFILE PHOTO
// ===========================
function setProfilePhoto(name) {
  const boyNames = ["kuldeep", "rahul", "rohit", "amit", "arjun"];
  const girlNames = ["priya", "neha", "riya", "anita", "sonam"];

  const lowerName = name.toLowerCase();

  if (boyNames.includes(lowerName)) {
    profilePhoto.src = "image/images1.jpeg"; // Boy avatar
  } else if (girlNames.includes(lowerName)) {
    profilePhoto.src = "image/images2.jpeg"; // Girl avatar
  } else {
    profilePhoto.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // Default neutral avatar
  }
}

// ===========================
// BALANCE & HISTORY FUNCTIONS
// ===========================
function updateBalance() {
  totalAmount.textContent = `₹${currentBalance.toLocaleString("en-IN")}`;
}

function addHistory(entry) {
  const li = document.createElement("li");

  const now = new Date();
  const day = now.getDate().toString().padStart(2, "0");
  const month = now.toLocaleString("en-IN", { month: "short" });
  const year = now.getFullYear();

  li.textContent = `${entry} - ${day} ${month} ${year}`;
  historyList.prepend(li);

  // Keep only latest 10 entries
  while (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

// ===========================
// CREDIT / DEBIT / CARD
// ===========================
function handleCredit() {
  const amount = parseFloat(prompt("Enter amount to credit:"));
  if (!isNaN(amount) && amount > 0) {
    currentBalance += amount;
    updateBalance();
    addHistory(`Credited: ₹${amount.toLocaleString("en-IN")}`);
  } else {
    alert("Please enter a valid amount.");
  }
}

function handleDebit() {
  const amount = parseFloat(prompt("Enter amount to debit:"));
  if (!isNaN(amount) && amount > 0 && amount <= currentBalance) {
    currentBalance -= amount;
    updateBalance();
    addHistory(`Debited: ₹${amount.toLocaleString("en-IN")}`);
  } else {
    alert("Invalid or insufficient amount.");
  }
}

function payWithCard() {
  const amount = parseFloat(prompt("Enter amount to pay using card:"));
  if (!isNaN(amount) && amount > 0 && amount <= currentBalance) {
    currentBalance -= amount;
    updateBalance();
    addHistory(`Paid via Card: ₹${amount.toLocaleString("en-IN")}`);

    const cardBalance = document.getElementById("cardBalance");
    if (cardBalance && cardBalance.style.display === "block") {
      cardBalance.textContent = `₹${currentBalance.toLocaleString("en-IN")}`;
    }
  } else {
    alert("Invalid or insufficient amount.");
  }
}

function toggleCardBalance() {
  const cardBalance = document.getElementById("cardBalance");
  if (cardBalance.style.display === "none") {
    cardBalance.textContent = `₹${currentBalance.toLocaleString("en-IN")}`;
    cardBalance.style.display = "block";
  } else {
    cardBalance.style.display = "none";
  }
}

// ===========================
// CHART FUNCTION
// ===========================
function loadChart() {
  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"],
      datasets: [
        {
          label: "2024",
          data: [40, 50, 60, 30, 70, 85, 79, 84],
          backgroundColor: "red",
        },
        {
          label: "2023",
          data: [35, 45, 50, 25, 60, 75, 75, 80],
          backgroundColor: "#ffcc00",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Recent History" },
      },
    },
  });
}
