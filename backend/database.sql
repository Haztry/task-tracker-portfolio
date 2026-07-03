

-- PRE FORMATO DE COMO QUEDÓ LA BASE DE DATOS


-- 1. Crear la base de datos (Ejecutar por separado en tu cliente de Postgres si es necesario)
-- CREATE DATABASE task_tracker;

-- 2. Asegurar que estamos usando tipos de datos limpios para estados y prioridades

-- Tabla de Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Aquí guardaremos el hash de la contraseña
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Tareas
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    
    -- Estado de la tarea
    status VARCHAR(20) DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'En Curso', 'Completado')),
    
    -- Prioridad de la tarea
    priority VARCHAR(10) DEFAULT 'Media' CHECK (priority IN ('Baja', 'Media', 'Alta')),
    
    -- Usuario asignado (Relación foreign key)
    assigned_to INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE tasks 
ADD CONSTRAINT fk_tasks_user 
FOREIGN KEY (assigned_to) REFERENCES users(id) 
ON DELETE SET NULL;

INSERT INTO users (username, email, password) VALUES 
('omar_dev', 'omar@example.com', 'password123'), -- Nota: En producción irá encriptada
('ana_manager', 'ana@example.com', 'password123');

INSERT INTO tasks (title, description, status, priority, assigned_to) VALUES 
('Configurar el backend', 'Crear el servidor de Node.js y conectar Postgres', 'En Curso', 'Alta', 1),
('Diseñar el Frontend', 'Crear la vista de 3 columnas con HTML y CSS', 'Pendiente', 'Media', 1),
('Presentar el Assessment', 'Exponer el funcionamiento del Task Tracker', 'Pendiente', 'Alta', 2),
('Pruebas unitarias', 'Verificar que los endpoints respondan JSON correctamente', 'Completado', 'Baja', NULL);