document.addEventListener("DOMContentLoaded", function () {
    const loggedIn = localStorage.getItem("loggedIn");

    if (!loggedIn) {
        // Se o usuário não estiver logado, redirecionar de volta para a página de login
        window.location.href = "index.html";
    }

    const logoutButton = document.getElementById("logoutButton");

    logoutButton.addEventListener("click", function () {
        // Limpar o token de autenticação (ou variável de sessão)
        localStorage.removeItem("loggedIn");
        // Redirecionar de volta para a página de login após o logout
        window.location.href = "index.html";
    });
});
