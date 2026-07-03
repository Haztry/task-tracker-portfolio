// Configuración de la URL base de tu backend
const API_URL = "https://task-tracker-portfolio.onrender.com/api/tasks";

// Elementos del DOM (HTML)
const btnAddTask = document.getElementById("btn-add-task");
const btnCloseModal = document.getElementById("btn-close-modal");
const taskModal = document.getElementById("task-modal");
const taskForm = document.getElementById("task-form");
const modalTitle = document.getElementById("modal-title");

// Listas de las columnas
const listPendiente = document.getElementById("list-pendiente");
const listEnCurso = document.getElementById("list-en-curso");
const listCompletado = document.getElementById("list-completado");

// Contadores de las columnas
const countPendiente = document.getElementById("count-pendiente");
const countEnCurso = document.getElementById("count-en-curso");
const countCompletado = document.getElementById("count-completado");

// Variables globales del estado de la app
let allTasks = [];

// ==========================================
// 1. CARGAR Y RENDERIZAR TAREAS (READ)
// ==========================================
async function fetchTasks() {
  // 1. Jalamos el token que se guardó en el navegador al iniciar sesión
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No hay un token disponible. Redirigiendo a login...");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        // Mandamos el token en el formato Bearer exacto que pide el requerimiento
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();

    if (result.ok) {
      allTasks = result.data;
      renderBoard();
    } else {
      console.error("Error del servidor:", result.error.message);
    }
  } catch (error) {
    console.error("Error de red al obtener tareas:", error);
  }
}

function renderBoard() {
  // Limpiamos las listas antes de pintar para no duplicar datos
  listPendiente.innerHTML = "";
  listEnCurso.innerHTML = "";
  listCompletado.innerHTML = "";

  // Contadores iniciales
  let cPendiente = 0,
    cEnCurso = 0,
    cCompletado = 0;

  allTasks.forEach((task) => {
    // Creamos el HTML de la tarjeta con Tailwind CSS estilizado
    const taskCard = document.createElement("div");
    taskCard.className =
      "bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-sm hover:border-slate-600 transition-all space-y-3";

    // Color según la prioridad
    const priorityColors = {
      Alta: "bg-red-500/10 text-red-400 border-red-500/20",
      Media: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Baja: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };
    const priorityClass = priorityColors[task.priority] || priorityColors["Media"];

    taskCard.innerHTML = `
            <div class="flex items-start justify-between">
                <span class="text-xs font-semibold px-2 py-0.5 rounded-md border ${priorityClass}">${task.priority}</span>
                <div class="flex space-x-1">
                    <button onclick="openEditModal(${task.id})" class="cursor-pointer text-slate-400 hover:text-indigo-400 text-xs p-1">✏️</button>
                    <button onclick="deleteTask(${task.id})" class="cursor-pointer text-slate-400 hover:text-red-400 text-xs p-1">🗑️</button>
                </div>
            </div>
            <div>
                <h3 class="font-bold text-white text-sm tracking-tight">${task.title}</h3>
                <p class="text-slate-400 text-xs mt-1 line-clamp-2">${task.description || "Sin descripción"}</p>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
                <span>👤 ${task.assignee_name || "Sin asignar"}</span>
                <span>📅 ${new Date(task.created_at).toLocaleDateString()}</span>
            </div>
        `;

    // Inyectamos la tarjeta en la columna que le corresponde según su status
    if (task.status === "Pendiente") {
      listPendiente.appendChild(taskCard);
      cPendiente++;
    } else if (task.status === "En Curso") {
      listEnCurso.appendChild(taskCard);
      cEnCurso++;
    } else if (task.status === "Completado") {
      listCompletado.appendChild(taskCard);
      cCompletado++;
    }
  });

  // Actualizamos los números de los contadores en la cabecera de las columnas
  countPendiente.textContent = cPendiente;
  countEnCurso.textContent = cEnCurso;
  countCompletado.textContent = cCompletado;
}

// ==========================================
// 2. CREAR O ACTUALIZAR TAREA (MUTACIONES)
// ==========================================
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita que la página se recargue

  const id = document.getElementById("task-id").value;
  const taskData = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    priority: document.getElementById("priority").value,
    status: document.getElementById("status").value,
    assigned_to: document.getElementById("assigned_to").value
      ? parseInt(document.getElementById("assigned_to").value)
      : null,
  };

  try {
    const token = localStorage.getItem("token");
    // 2. Definimos los headers reutilizables que AMBOS fetch necesitan obligatoriamente
    const authHeaders = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    let response;
    if (id) {
      // Si el input oculto tiene ID, estamos EDITANDO (PUT)
      response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: authHeaders, // <-- Le pasamos los headers con el JWT
        body: JSON.stringify(taskData),
      });
    } else {
      // Si no tiene ID, estamos CREANDO una nueva tarea (POST)
      response = await fetch(API_URL, {
        method: "POST",
        headers: authHeaders, // <-- Le pasamos los mismos headers con el JWT
        body: JSON.stringify(taskData),
      });
    }

    const result = await response.json();
    if (result.ok) {
      closeModal();
      fetchTasks(); // Refrescamos el tablero de inmediato
    } else {
      alert(`Error: ${result.error.message}`);
    }
  } catch (error) {
    console.error("Error al guardar la tarea:", error);
  }
});

// ==========================================
// 3. ELIMINAR TAREA (DELETE)
// ==========================================
async function deleteTask(id) {
  const token = localStorage.getItem("token");
  if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.ok) {
        fetchTasks(); // Refrescamos el tablero
      }
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  }
}

// ==========================================
// 4. CONTROL DEL MODAL (INTERFAZ)
// ==========================================
btnAddTask.addEventListener("click", () => {
  modalTitle.textContent = "Nueva Tarea";
  taskForm.reset();
  document.getElementById("task-id").value = ""; // Limpiamos el ID oculto
  taskModal.classList.remove("hidden");
});

// Función auxiliar para loguear o registrar automáticamente en el backend
async function simulateLogin(username, email, password) {
  try {
    // Intentamos hacer login directo
    let response = await fetch("https://task-tracker-portfolio.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let result = await response.json();

    // Si no existe el usuario (401), lo registramos primero automáticamente
    if (!result.ok) {
      console.log("Usuario no encontrado, registrando...");
      const regRes = await fetch("https://task-tracker-portfolio.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const regResult = await regRes.json();

      if (!regResult.ok) throw new Error(regResult.error.message);

      // Volvemos a intentar login ahora que ya existe
      response = await fetch("https://task-tracker-portfolio.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      result = await response.json();
    }

    if (result.ok) {
      // Guardamos el JWT sin estado de forma real en el localStorage del navegador
      localStorage.setItem("token", result.data.token);
      document.getElementById("current-user").textContent = `Sesión: ${result.data.user.username}`;
      document.getElementById("current-user").className = "text-xs text-emerald-400 px-2 font-bold";

      // Refrescamos las tareas. El backend automáticamente filtrará las de ESTE usuario
      fetchTasks();
    }
  } catch (error) {
    alert(`Error en simulación de Auth: ${error.message}`);
  }
}
// Escuchadores de eventos para los botones del Header
document.getElementById("auth-user-1").addEventListener("click", () => {
  simulateLogin("omar_dev", "omar@example.com", "password123");
});

document.getElementById("auth-user-2").addEventListener("click", () => {
  simulateLogin("evaluador_sr", "evaluador@test.com", "securepass456");
});

// Modificación rápida al inicio de tu DOMContentLoaded existente:
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    document.getElementById("current-user").textContent = "Sesión Activa";
    document.getElementById("current-user").className = "text-xs text-indigo-400 px-2 font-bold";
    fetchTasks();
  }
});

function openEditModal(id) {
  const task = allTasks.find((t) => t.id === id);
  if (!task) return;

  modalTitle.textContent = "Editar Tarea";
  document.getElementById("task-id").value = task.id;
  document.getElementById("title").value = task.title;
  document.getElementById("description").value = task.description || "";
  document.getElementById("priority").value = task.priority;
  document.getElementById("status").value = task.status;
  document.getElementById("assigned_to").value = task.assigned_to || "";

  taskModal.classList.remove("hidden");
}

function closeModal() {
  taskModal.classList.add("hidden");
}

btnCloseModal.addEventListener("click", closeModal);

// Inicialización de la aplicación al cargar la página
document.addEventListener("DOMContentLoaded", fetchTasks);
