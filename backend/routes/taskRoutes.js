const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");

// 1. Ruta para OBTENER todas las tareas
// GET /api/tasks
router.get("/", protect, taskController.getAllTasks);
// 2. Ruta para CREAR una tarea
// POST /api/tasks
router.post("/", protect, taskController.createTask);
// 3. Ruta para ACTUALIZAR una tarea específica (requiere ID)
// PUT /api/tasks/:id
router.put("/:id", protect, taskController.updateTask);

// 4. Ruta para ELIMINAR una tarea específica (requiere ID)
// DELETE /api/tasks/:id
router.delete("/:id", protect, taskController.deleteTask);

module.exports = router;
