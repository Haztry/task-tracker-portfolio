const db = require("../config/db");

const Task = {
  // 1. OBTENER TODAS LAS TAREAS
  getAll: async (userId) => {
    const qry = `
            SELECT t.*, u.username as assignee_name 
            FROM tasks t
            LEFT JOIN users u ON t.assigned_to = u.id
            WHERE t.assigned_to = $1
            ORDER BY t.created_at DESC
        `;
    const { rows } = await db.query(qry, [userId]);
    return rows;
  },

  create: async (taskData, userId) => {
    const { title, description, status, priority } = taskData;
    const qry = `
            INSERT INTO tasks (title, description, status, priority, assigned_to)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
    // Forzamos que el creador/asignado sea el usuario logueado
    const { rows } = await db.query(qry, [title, description, status, priority, userId]);
    return rows[0];
  },
  // 3. ACTUALIZAR UNA TAREA (Cambiar estado, prioridad, etc.)
  update: async (id, taskData, userId) => {
    const { title, description, status, priority, assigned_to } = taskData;
    const qry = `
            UPDATE tasks 
            SET title = $1, description = $2, status = $3, priority = $4, assigned_to = $5, updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *
        `;
    // El returning es un superpoder de postgres mejor que mysql, te devuelve la fila afectada, no necesitas un select..
    const { rows } = await db.query(qry, [title, description, status, priority, assigned_to, id, userId]);
    return rows[0]; // Retorna la tarea modificada
  },

  // 4. ELIMINAR UNA TAREA
  delete: async (id, userId) => {
    const qry = `DELETE FROM tasks WHERE id = $1 RETURNING *`;
    const { rows } = await db.query(qry, [id, userId]);
    return rows[0]; // Retorna la tarea que fue eliminada
  },
};

module.exports = Task;
