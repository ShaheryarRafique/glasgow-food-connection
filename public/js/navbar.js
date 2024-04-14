document.addEventListener("DOMContentLoaded", function () {
  // Check if kd_token cookie exists
  const token = getCookie("kd_token");
  console.log("token", token)
  if (token) {
    // User is authenticated, show user info and logout button
    document.getElementById("auth-buttons").classList.add("hidden");
    document.getElementById("user-info").classList.remove("hidden");

    // Decode the JWT token to get user information
    const decodedToken = parseJwt(token);


  if (decodedToken && decodedToken.email) {
        console.log("decodedToken",decodedToken)
        document.querySelector(".username").textContent = decodedToken.name;
      if(decodedToken.accountType === 'Donor') {
          // Show the "add item" button or section for Donors
          document.getElementById("donor").classList.remove("hidden");
      } else {
          // Optionally hide it for non-Donors, if it's not hidden by default
          document.getElementById("donor").classList.add("hidden");
      }

      console.log(decodedToken.accountType)
      if(decodedToken.accountType === 'Admin') {
        // Show the "add item" button or section for Donors
        document.getElementById("admin").classList.remove("hidden");
    } else {
        // Optionally hide it for non-Donors, if it's not hidden by default
        document.getElementById("admin").classList.add("hidden");
    }

    }
  } else {
    // User is not authenticated, show login and signup buttons
    document.getElementById("auth-buttons").classList.remove("hidden");
    document.getElementById("user-info").classList.add("hidden");
    document.getElementById("donor").classList.add("hidden");
    document.getElementById("admin").classList.add("hidden");
  }

  // Add event listener for logout button
  document
    .getElementById("logoutButton")
    .addEventListener("click", function (e) {
      e.preventDefault();

      // Clear kd_token cookie
      document.cookie =
        "kd_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Redirect to home page
      window.location.href = "/";
    });
});

// Function to get cookie value by name
function getCookie(name) {
    const cookieArray = document.cookie.split(';');
    console.log("cookieArray", cookieArray)
    for (let i = 0; i < cookieArray.length; i++) {
      const cookie = cookieArray[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }
  

// Function to parse JWT token
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}
