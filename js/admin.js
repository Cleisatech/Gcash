document.addEventListener("DOMContentLoaded", () => {
  const userDropdown = document.getElementById("user-dropdown");
  const fundUserForm = document.getElementById("fund-user-form");
  const verifiedUserDropdown = document.getElementById("verified-user-dropdown");
  const verifiedUserDetails = document.getElementById("verified-user-details");
  const verifiedName = document.getElementById("verified-name");
  const verifiedEmail = document.getElementById("verified-email");
  const verifiedPhone = document.getElementById("verified-phone");
  const verifiedIdFront = document.getElementById("verified-id-front");
  const verifiedIdBack = document.getElementById("verified-id-back");
  const logoutBtn = document.getElementById("logout-btn");

  // Fetch all users and populate the dropdown
  async function fetchUsers() {
    try {
      const response = await fetch("http://localhost:7860/users");
      const users = await response.json();

      userDropdown.innerHTML = '<option value="" disabled selected>Select a user</option>'; // Reset dropdown
      users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id; // Use user ID as the value
        option.textContent = `${user.name} (Account #: ${user.id})`;
        userDropdown.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  // Fund a user
  fundUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = userDropdown.value;
    const amount = parseFloat(document.getElementById("amount").value);

    if (!userId || isNaN(amount) || amount <= 0) {
      alert("Please select a valid user and enter a valid amount.");
      return;
    }

    try {
      const response = await fetch("http://localhost:7860/fund-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, amount }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Funds added successfully!");
        fetchUsers(); // Refresh user list
      } else {
        alert(result.error || "Failed to add funds.");
      }
    } catch (error) {
      console.error("Error funding user:", error);
      alert("An error occurred. Please try again.");
    }
  });

  // Fetch verified users and populate the dropdown
  async function fetchVerifiedUsers() {
    try {
      const response = await fetch("http://localhost:7860/verified-users");
      const verifiedUsers = await response.json();

      verifiedUserDropdown.innerHTML = '<option value="" disabled selected>Select a verified user</option>'; // Reset dropdown
      verifiedUsers.forEach((user, index) => {
        const option = document.createElement("option");
        option.value = index; // Use index as the value
        option.textContent = user.name;
        verifiedUserDropdown.appendChild(option);
      });

      // Handle verified user selection
      verifiedUserDropdown.addEventListener("change", () => {
        const selectedIndex = verifiedUserDropdown.value;
        if (selectedIndex !== "") {
          const selectedUser = verifiedUsers[selectedIndex];
          verifiedName.textContent = selectedUser.name;
          verifiedEmail.textContent = selectedUser.email;
          verifiedPhone.textContent = selectedUser.phone;
          verifiedIdFront.href = selectedUser.idFront;
          verifiedIdBack.href = selectedUser.idBack;
          verifiedUserDetails.style.display = "block";
        } else {
          verifiedUserDetails.style.display = "none";
        }
      });
    } catch (error) {
      console.error("Error fetching verified users:", error);
    }
  }

  // Logout functionality
  logoutBtn.addEventListener("click", () => {
    // Clear localStorage or session data
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("isLoggedIn");

    // Redirect to the admin login page
    window.location.href = "admin-login.html";
  });

  // Initial fetch of users and verified users
  fetchUsers();
  fetchVerifiedUsers();
});
