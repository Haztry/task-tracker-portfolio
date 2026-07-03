const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");

// 1. Ruta GET
router.get("/", protect, taskController.getAllTasks);
// 2. Ruta crear
router.post("/", protect, taskController.createTask);
// 3. Ruta para actualizar
router.put("/:id", protect, taskController.updateTask);
// 4. Eliminar
router.delete("/:id", protect, taskController.deleteTask);

module.exports = router;
