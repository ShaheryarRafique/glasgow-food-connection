document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Clear previous error messages
    document.querySelectorAll(".error-message").forEach((e) => e.remove());

    const formData = {
      fullname: document.getElementById("fullname").value.trim(),
      email: document.getElementById("email").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    let isValid = true;

    // Check for empty fields and add error messages
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        addErrorMessage(
          document.getElementById(key),
          "This field cannot be empty"
        );
        isValid = false;
      }
    });

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      addErrorMessage(
        document.getElementById("email"),
        "Please enter a valid email address"
      );
      isValid = false;
    }

    // If validation fails, stop here
    if (!isValid) return;

    // Proceed with form submission (AJAX or otherwise)
    fetch("http://localhost:8015/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.error) {
          // Display server-side validation error
          addMessage(form, data.message, "error");
        } else {
          addMessage(
            form,
            "Successfully contact message submitted.",
            "success"
          );
          // Redirect to dashboard page after a short delay
          setTimeout(() => {
            window.location.href = "/contact";
          }, 3000); // 3 seconds delay
        }
      })
      .catch((error) => {
        // Handle network errors
        addMessage(form, "Failed to login. Please try again.", "error");
        console.error("Error:", error);
      });
  });
});

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function addErrorMessage(element, message) {
  const errorMessage = document.createElement("div");
  errorMessage.textContent = message;
  errorMessage.className = "error-message text-sm italic text-red-500 mt-2";
  element.parentElement.appendChild(errorMessage);
}

function addMessage(formElement, message, type) {
  const messageDiv = document.createElement("div");
  messageDiv.textContent = message;
  messageDiv.className = `error-message text-sm mt-2 p-2 ${
    type === "error" ? "text-red-500" : "text-green-500"
  }`;
  formElement.prepend(messageDiv);
}
