document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Clear previous error messages
    document.querySelectorAll(".error-message").forEach((e) => e.remove());

    const formData = {
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
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

    // Proceed with form submission (AJAX)
    fetch("http://localhost:8015/api/v1/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        if (data.redirect) {
          console.log("Hello 1")
          window.location.href = data.redirectUrl; 
        } else if (data.error) {
          console.log("Hello 2")
          // Handle the error message from the backend
          addMessage(form, data.message, "error");
        } else {
          console.log("Hello 3")
          addMessage(form, "Successfully logged in. Redirecting...", "success");
          // Redirect non-admin users to the dashboard page after a short delay
          setTimeout(() => {
            window.location.href = "/"; // Replace with the actual path to your dashboard
          }, 3000); // 3 seconds delay
        }
      })
      .catch((error) => {
        // Handle errors
        addMessage(form, error.message, "error");
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
  messageDiv.className = `error-message text-sm mt-2 p-2 ${type === "error" ? "text-red-500" : "text-green-500"
    }`;
  formElement.prepend(messageDiv);
}
