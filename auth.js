document.addEventListener("DOMContentLoaded", () => {
  const signInTab = document.getElementById("signInTab");
  const signUpTab = document.getElementById("signUpTab");
  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");

  const signinError = document.getElementById("signinError");
  const signupError = document.getElementById("signupError");
  const signupSuccess = document.getElementById("signupSuccess");

  // Tab switching
  signInTab.addEventListener("click", () => {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
    signinError.style.display = "none";
  });

  signUpTab.addEventListener("click", () => {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
    signupError.style.display = "none";
    signupSuccess.style.display = "none";
  });

  // --- Sign Up ---
  signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("signupUsername").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const confirmPassword = document.getElementById("signupConfirmPassword").value.trim();

    if (password !== confirmPassword) {
      signupError.textContent = "Passwords do not match!";
      signupError.style.display = "block";
      return;
    }

    // Load existing users from localStorage
    let users = JSON.parse(localStorage.getItem("closetteUsers")) || [];

    // Check if username/email already exists
    if (users.some(u => u.username === username || u.email === email)) {
      signupError.textContent = "Username or Email already exists!";
      signupError.style.display = "block";
      return;
    }

    // Save new user
    users.push({ username, email, password });
    localStorage.setItem("closetteUsers", JSON.stringify(users));

    signupSuccess.textContent = "Account created! You can now Sign In.";
    signupSuccess.style.display = "block";
    signupError.style.display = "none";

    // Clear form
    signUpForm.reset();
  });

  // --- Sign In ---
  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("signinUsername").value.trim();
    const password = document.getElementById("signinPassword").value.trim();

    let users = JSON.parse(localStorage.getItem("closetteUsers")) || [];

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", user.username);
      window.location.href = "index.html"; // Redirect to main page
    } else {
      signinError.textContent = "Invalid username or password!";
      signinError.style.display = "block";
    }
  });
});