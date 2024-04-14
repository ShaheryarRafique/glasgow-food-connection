document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Clear previous error messages
        document.querySelectorAll(".error-message").forEach((e) => e.remove());

        const formData = {
            name: document.getElementById("name").value.trim(),
            quantity:parseInt( document.getElementById("quantity").value.trim()),
            expiry: document.getElementById("expiry").value.trim(),
            foodCategory: document.getElementById("foodCategory").value.trim(),
            pickupPoint: document.getElementById("pickupPoint").value.trim(),
            description: document.getElementById("description").value.trim(),
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

        // Expiry date validation (at least 2 days from today)
        const today = new Date();
        const expiryDate = new Date(formData.expiry);
        const twoDaysFromNow = new Date(today);
        twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

        if (expiryDate < twoDaysFromNow) {
            addErrorMessage(
                document.getElementById("expiry"),
                "Expiry date must be at least 2 days from today"
            );
            isValid = false;
        }

        // If validation fails, stop here
        if (!isValid) return;

        // Proceed with form submission (AJAX)
        fetch("/api/v1/food", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data && data.error) {
                addMessage(form, data.message, "error");
            } else {
                addMessage(form, "Food item added successfully!", "success");
                form.reset(); 
                // Redirect to dashboard page after a short delay
                setTimeout(() => {
                    window.location.href = "/";
                }, 3000); // 3 seconds delay
            }
        })
        .catch((error) => {
            addMessage(form, "Failed to add the food item. Please try again.", "error");
            console.error("Error:", error);
        });
    });
});

function addErrorMessage(element, message) {
    const errorMessage = document.createElement("div");
    errorMessage.textContent = message;
    errorMessage.className = "error-message text-sm italic text-red-500 mt-2";
    element.parentElement.appendChild(errorMessage);
}

function addMessage(formElement, message, type) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.className = `message text-sm mt-2 p-2 ${
        type === "error" ? "text-red-500" : "text-green-500"
    }`;
    formElement.prepend(messageDiv);
}
