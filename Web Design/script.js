document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Check if user has a saved theme preference
    if (localStorage.getItem("theme") === "dark") {
        body.classList.add("dark");
    }

    themeToggle.addEventListener("click", () => {
        body.classList.toggle("dark");

        // Save user preference
        if (body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
        } else {
            localStorage.setItem("theme", "light");
        }
    });
});
