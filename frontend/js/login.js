const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const errorMessage = document.getElementById("error-message");

// URL de tu API de autenticación (ajústala si tu ruta es diferente, ej: /api/auth/login)
const AUTH_URL = "https://task-tracker-portfolio.onrender.com/api/auth/login";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita que la página se recargue

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Ocultamos el error anterior si es que había uno
  loginError.classList.add("hidden");

  try {
    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok && result.ok) {
      // 1. Guardamos el token que mandó tu backend en el almacenamiento local del navegador
      // Nota: Revisa si tu backend lo devuelve como result.token o result.data.token
      const token = result.token || result.data?.token;

      localStorage.setItem("token", token);

      // 2. Redireccionamos al tablero de tareas
      // Cambia 'index.html' por el nombre de tu archivo del tablero si es diferente
      window.location.href = "./index.html";
    } else {
      // Si el backend responde con un error estructurado (como el catch que hicimos)
      const msg = result.error?.message || "Error al iniciar sesión";
      showError(msg);
    }
  } catch (error) {
    console.error("Error en la petición de login:", error);
    showError("No se pudo conectar con el servidor.");
  }
});

function showError(message) {
  errorMessage.textContent = message;
  loginError.classList.remove("hidden");
}
