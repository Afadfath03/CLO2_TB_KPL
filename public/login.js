document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const emailOrUsername = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailOrUsername, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.error);
                return;
            }

            const { token } = await response.json();
            localStorage.setItem("token", token);

            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            if (decodedToken.role === 0) {
                window.location.href = "admin.html";
            } else {
                window.location.href = "user.html";
            }
        } catch (err) {
            console.error("Login failed:", err);
            alert("Login failed. Please try again.");
        }
    });
});