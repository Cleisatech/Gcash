document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate inputs
      if (!emailInput.value || !passwordInput.value) {
        errorMessage.textContent = "Please enter both Email and Password";
        errorMessage.style.display = "block";
        return;
      }

      // Send data to the backend
      try {
        const response = await fetch("http://127.0.0.1:7860/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          // Save user data and login status in localStorage
          localStorage.setItem("loggedInUser", JSON.stringify(result));
          localStorage.setItem("isLoggedIn", "true");
          alert("Login successful!");
          window.location.href = "dashboard.html"; // Redirect to dashboard
        } else {
          errorMessage.textContent = result.error || "Login failed";
          errorMessage.style.display = "block";
        }
      } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again.";
        errorMessage.style.display = "block";
      }
    });
  }
});
