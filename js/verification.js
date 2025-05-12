document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("verification-form");

  if (!form) {
    console.error("Form with id 'verification-form' not found.");
    return;
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("Form submitted");

    const userId = document.getElementById("user_id")?.value;
    const name = document.getElementById("name")?.value;
    const email = document.getElementById("email")?.value;
    const phone = document.getElementById("phone")?.value;
    const idFront = document.getElementById("id-front")?.files[0];
    const idBack = document.getElementById("id-back")?.files[0];

    if (!name || !email || !phone) {
      alert("Please fill in all required fields.");
      return;
    }

    if (idFront && idBack) {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("id_front", idFront);
      formData.append("id_back", idBack);

      try {
        console.log("Sending FormData payload to /verification");

        const response = await fetch("http://localhost:7860/verification", {
          method: "POST",
          body: formData, // Do not set Content-Type; the browser handles it
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server responded with an error:", errorText);
          alert(`Verification failed: ${errorText}`);
          return;
        }

        const result = await response.json();
        console.log("Server response:", result);

        if (result.success) {
          alert(result.message || "Verification documents submitted successfully!");
          window.location.href = "dashboard.html";
        } else {
          alert(result.error || "Verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Network or server error occurred:", error.message, error.stack);
        alert("An error occurred while submitting your verification. Please try again.");
      }
    } else {
      alert("Please upload both front and back of your ID card.");
    }
  });
});
