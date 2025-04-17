function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

if (window.location.pathname === "/index.html" || window.location.pathname === "/") {
    logout();
}

if (!localStorage.getItem("token") && window.location.pathname !== "/login.html") {
    logout();
}