document.addEventListener("DOMContentLoaded", () => {
  // Check if the user is logged in
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (!loggedInUser) {
    alert("You must log in to access the dashboard.");
    window.location.href = "login.html";
    return;
  }

  // Parse the logged-in user data
  const user = JSON.parse(loggedInUser);

  // Update the greeting with the user's first name
  const userNameElements = document.querySelectorAll("#user-name, #menu-user-name");
  userNameElements.forEach((el) => {
    if (el) el.textContent = user.first_name + "!";
  });

  // Update the account number in the UI
  const accountNumberElement = document.getElementById("account-number");
  if (accountNumberElement) {
    accountNumberElement.textContent = user.account_number;
  }

  // Handle profile button click to open the side menu
  const profileBtn = document.getElementById("profile-btn");
  const sideMenu = document.getElementById("side-menu");
  const overlay = document.getElementById("overlay");

  if (profileBtn && sideMenu && overlay) {
    profileBtn.addEventListener("click", () => {
      sideMenu.classList.add("active");
      overlay.classList.add("active");
    });

    overlay.addEventListener("click", () => {
      sideMenu.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  // Handle logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("accountNumber");
      alert("You have been logged out.");
      window.location.href = "login.html";
    });
  }

  // Handle navigation to "Send Money" page (for both Send and Transfer buttons)
  const sendMoneyFeature = document.getElementById("send-money-feature");
  const transferFeature = document.getElementById("transfer-feature");
  if (sendMoneyFeature) {
    sendMoneyFeature.addEventListener("click", () => {
      window.location.href = "send-money.html";
    });
  }
  if (transferFeature) {
    transferFeature.addEventListener("click", () => {
      window.location.href = "send-money.html";
    });
  }

  // Handle navigation to "Transactions" page
  const transactionsFeature = document.getElementById("transactions-feature");
  if (transactionsFeature) {
    transactionsFeature.addEventListener("click", () => {
      window.location.href = "transactions.html";
    });
  }

  // Handle "Cash In" button
  const cashInBtn = document.querySelector(".cash-in-btn");
  if (cashInBtn) {
    cashInBtn.addEventListener("click", () => {
      if (comingSoonModal) {
        comingSoonModal.classList.add("active");
      }
    });
  }

  // Handle other menu items (e.g., features under development)
  const menuItems = document.querySelectorAll(
    ".menu-item:not(#send-money-feature):not(#transactions-feature)"
  );
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (comingSoonModal) {
        comingSoonModal.classList.add("active");
      }
    });
  });

  // Handle "Coming Soon" modal
  const comingSoonModal = document.getElementById("coming-soon-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      if (comingSoonModal) {
        comingSoonModal.classList.remove("active");
      }
    });
  }

  // Example: Show "Coming Soon" modal for unimplemented features
  const unimplementedFeatures = document.querySelectorAll(".menu-item:not(#send-money-feature):not(#transactions-feature)");
  unimplementedFeatures.forEach((item) => {
    item.addEventListener("click", () => {
      if (comingSoonModal) {
        comingSoonModal.classList.add("active");
      }
    });
  });

  // Handle "My Account" and "Settings" clicks
  const myAccountBtn = document.getElementById("my-account-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const verificationScreen = document.getElementById("verification-screen");
  const closeVerificationBtn = document.getElementById("close-verification-btn");

  if (myAccountBtn) {
    myAccountBtn.addEventListener("click", () => {
      if (verificationScreen) {
        verificationScreen.style.display = "block";
      }
    });
  }

  // Handle "Settings" click to open the verification screen
  if (settingsBtn) {
    settingsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (verificationScreen) {
        verificationScreen.style.display = "block";
      }
    });
  }

  if (closeVerificationBtn) {
    closeVerificationBtn.addEventListener("click", () => {
      if (verificationScreen) {
        verificationScreen.style.display = "none";
      }
    });
  }

  // Load recent transactions
  loadRecentTransactions();
});

// Function to generate a random account number
function generateAccountNumber() {
  const prefix = "GC";
  const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000); // 10-digit random number
  return `${prefix}${randomNumber}`;
}

// Function to load recent transactions
function loadRecentTransactions() {
  const transactionsList = document.getElementById("recent-transactions-list");
  const noTransactionsElement = document.getElementById("no-recent-transactions");

  if (!transactionsList || !noTransactionsElement) return;

  // Simulate fetching transactions (replace with API call if needed)
  const transactions = []; // Empty array for a new user

  if (transactions.length > 0) {
    noTransactionsElement.style.display = "none";
    transactionsList.innerHTML = ""; // Clear existing transactions

    transactions.forEach((transaction) => {
      const transactionItem = document.createElement("div");
      transactionItem.className = `transaction-item ${transaction.type}`;
      transactionItem.innerHTML = `
        <div class="transaction-content">
          <div class="transaction-details">
            <div class="transaction-title">${transaction.description}</div>
            <div class="transaction-date">${transaction.date}</div>
          </div>
          <div class="transaction-amount ${transaction.type}">
            ${transaction.type === "credit" ? "+" : "-"}₱${transaction.amount.toFixed(2)}
          </div>
        </div>
      `;
      transactionsList.appendChild(transactionItem);
    });
  } else {
    noTransactionsElement.style.display = "block";
  }
}
