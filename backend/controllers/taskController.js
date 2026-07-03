const Task = require("../models/taskModel");

const taskController = {
  getAllTasks: async (req, res) => {
    try {
      const userId = req.user.id;
      const tasks = await Task.getAll(userId); //mandamos a llamar tasks para obtener los datos
      // Y si sí? entonces respondemos con un success
      console.log("Tareas encontradas en BD:", tasks);
      res.json({
        ok: true,
        data: tasks,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: { code: "SERVER ERROR", message: error.message },
      });
    }
  },

  createTask: async (req, res) => {
    try {
      const userId = req.user.id;
      const newTask = await Task.create(req.body, userId); // create task, le mandamos el body porque es el que regresamos del front
      res.status(201).json({
        ok: true,
        data: newTask,
      });
    } catch (error) {
      res.status(400).json({
        ok: false,
        error: { code: "BAD_REQUEST", message: error.message },
      });
    }
  },

  updateTask: async (req, res) => {
    try {
      const { id } = req.params; // id para actualizar
      const userId = req.user.id;
      const updatedTask = await Task.update(id, req.body, userId);
      if (!updatedTask) {
        return res.status(404).json({
          ok: false,
          error: { code: "NOT_FOUND", message: "La tarea no existe." },
        });
      }
      res.json({
        ok: true,
        data: updatedTask,
      });
    } catch (error) {
      res.status(400).json({
        ok: false,
        error: { code: "BAD_REQUEST", message: error.message },
      });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const deletedTask = await Task.delete(id, userId);

      if (!deletedTask) {
        return res.status(404).json({
          ok: false,
          error: {
            code: "NOT_FOUND_OR_UNOTHORIZED",
            message: "La tarea no existe o no tiene permisos para eliminarla",
          },
        });
      }
      res.json({
        ok: true,
        data: { message: "Tarea eliminada correctamente", task: deletedTask },
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error: { code: "SERVER_ERROR", message: error.message },
      });
    }
  },
};

module.exports = taskController;
