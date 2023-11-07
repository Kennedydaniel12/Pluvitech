document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Verificar as credenciais (por exemplo, com uma solicitação ao servidor)
        const usuario = "teste";
        const senha = "1010";

        const usuarioEsperado = loginForm.querySelector("#usuario").value;
        const senhaEsperada = loginForm.querySelector("#senha").value;

        if (usuarioEsperado === usuario && senhaEsperada === senha) {
            // Se as credenciais estiverem corretas, definir um token ou variável de sessão
            localStorage.setItem("loggedIn", "true");
            // Redirecionar para a página "home"
            window.location.href = "home.html";
        } else {
            alert("Credenciais inválidas. Tente novamente.");
        }
    });
});
