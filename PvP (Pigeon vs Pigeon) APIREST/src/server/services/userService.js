/**
 * Servicio de gestión de usuarios usando closures
 * Este servicio mantiene el estado de los usuarios en memoria
 * y proporciona métodos para realizar operaciones CRUD
 */

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.resolve('users.json');

function loadUsersFromDisk() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return { users: [], nextId: 1 };
    }

    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);

    return {
      users: data.users || [],
      nextId: data.nextId || 1
    };
  } catch (err) {
    console.error('Error cargando usuarios:', err);
    return { users: [], nextId: 1 };
  }
}

function saveUsersToDisk(users, nextId) {
  const data = {
    users,
    nextId
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function createUserService() {
  // Estado privado: almacén de usuarios
  let { users, nextId } = loadUsersFromDisk();

  /**
   * Crea un nuevo usuario
   * @param {Object} userData - {name, player1Win, player2Win}
   * @returns {Object} Usuario creado
   */
  function createUser(userData) {
    // 1. Validar que el nombre no exista ya
    const existingUser = users.find(u => u.name === userData.name);
    if (existingUser) {
      throw new Error('Ya hay un usuario con ese nombre');
    }

    // 2. Crear objeto usuario con id único y createdAt
    const newUser = {
      id: String(nextId),
      name: userData.name,
      player1Win: userData.player1Win || 0,
      player2Win: userData.player2Win || 0,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    nextId++;

    saveUsersToDisk(users, nextId);
    return newUser;
  }

  /**
   * Obtiene todos los usuarios
   * @returns {Array} Array de usuarios
   */
  function getAllUsers() {
    // TODO: Implementar
    // Retornar una copia del array de usuarios
    return users.slice();
  }

  /**
   * Busca un usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  function getUserById(id) {
    const user = users.find(u => u.id === id);
    return user || null;
  }

  /**
   * Busca un usuario por nombre
   * @param {string} name - Nombre del usuario
   * @returns {Object|null} Usuario encontrado o null
   */
  function getUserByName(name) {
    // TODO: Implementar
    // Buscar y retornar el usuario por name, o null si no existe
    // IMPORTANTE: Esta función será usada por el chat para verificar name
    const user = users.find(u => u.name === name);
    return user || null;
  }

  /**
   * Actualiza un usuario
   * @param {string} id - ID del usuario
   * @param {Object} updates - Campos a actualizar
   * @returns {Object|null} Usuario actualizado o null si no existe
   */
  function updateUser(id, updates) {
    // TODO: Implementar
    // 1. Buscar el usuario por id
    // 2. Si no existe, retornar null
    // 3. Actualizar solo los campos permitidos (player1Win, player2Win)
    // 4. NO permitir actualizar id, email, o createdAt
    // 5. Retornar el usuario actualizado
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return null;
    }
    const user = users[userIndex];
    const updatedUser = {
      ...user,
      player1Win: updates.player1Win || user.player1Win,
      player2Win: updates.player2Win || user.player2Win
    };
    users[userIndex] = updatedUser;
    saveUsersToDisk(users, nextId);
    return updatedUser;
  }

  /**
   * Elimina un usuario
   * @param {string} id - ID del usuario
   * @returns {boolean} true si se eliminó, false si no existía
   */
  function deleteUser(id) {
    // TODO: Implementar
    // 1. Buscar el índice del usuario
    // 2. Si existe, eliminarlo del array
    // 3. Retornar true si se eliminó, false si no existía
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return false;
    }
    users.splice(userIndex, 1);
    saveUsersToDisk(users, nextId);
    return true;
  }

  // Exponer la API pública del servicio
  return {
    createUser,
    getAllUsers,
    getUserById,
    getUserByName,
    updateUser,
    deleteUser
  };
}
