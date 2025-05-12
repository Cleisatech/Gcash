document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signup-form");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const signupBtn = document.getElementById("signup-btn");
  const errorMessage = document.getElementById("error-message");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate inputs
      if (
        !firstNameInput.value ||
        !lastNameInput.value ||
        !emailInput.value ||
        !passwordInput.value
      ) {
        errorMessage.textContent = "Please fill in all fields";
        errorMessage.style.display = "block";
        return;
      }

      // Send data to the backend
      try {
        const response = await fetch("http://127.0.0.1:7860/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: firstNameInput.value,
            last_name: lastNameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Signup successful!");
          window.location.href = "login.html"; // Redirect to login page
        } else {
          errorMessage.textContent = result.error || "Signup failed";
          errorMessage.style.display = "block";
        }
      } catch (error) {
        errorMessage.textContent = "An error occurred. Please try again.";
        errorMessage.style.display = "block";
      } finally {
        signupBtn.textContent = "Create Account";
        signupBtn.disabled = false;
      }
    });
  }
});
