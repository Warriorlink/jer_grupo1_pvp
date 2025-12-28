/**
 * Servicio de gestión de mensajes usando closures
 *
 * TODO:
 * Implementar este servicio siguiendo el patrón usado en userService.js
 *
 * Requisitos:
 * - Usar closures para mantener estado privado
 * - Mantener un array de mensajes en memoria
 * - Cada mensaje debe tener: {id, email, message, timestamp}
 * - IMPORTANTE: Verificar que el email existe usando userService.getUserByEmail()
 *   antes de crear un mensaje
 */

export function createMessageService(userService) {
  // TODO: Declarar variables privadas
  // - Array de mensajes
  // - Contador para IDs
  const messages = [];
  let nextId = 1;

  /**
   * Crea un nuevo mensaje
   * @param {string} email - Email del usuario que envía
   * @param {string} message - Contenido del mensaje
   * @returns {Object} Mensaje creado
   * @throws {Error} Si el email no existe
   */
  function createMessage(email, message) {
    // TODO: Implementar
    // 1. Verificar que el usuario existe (userService.getUserByEmail)
    // 2. Si no existe, lanzar error
    // 3. Crear objeto mensaje con id, email, message, timestamp
    // 4. Agregar a la lista
    // 5. Retornar el mensaje creado
    const newMessage = {
      id: String(nextId),
      email,
      message,
      timestamp: new Date().toISOString()
    };
    messages.push(newMessage);
    nextId++;
    return newMessage;
  }

  /**
   * Obtiene los últimos N mensajes
   * @param {number} limit - Cantidad de mensajes a retornar
   * @returns {Array} Array de mensajes
   */
  function getRecentMessages(limit = 50) {
    // TODO: Implementar
    // Retornar los últimos 'limit' mensajes, ordenados por timestamp
    return messages.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
  }

  /**
   * Obtiene mensajes desde un timestamp específico
   * @param {string} since - Timestamp ISO
   * @returns {Array} Mensajes nuevos desde ese timestamp
   */
  function getMessagesSince(since) {
    // TODO: Implementar
    // Filtrar mensajes cuyo timestamp sea mayor que 'since'
    const sinceDate = new Date(since);
    return messages.filter(msg => new Date(msg.timestamp) > sinceDate);
  }

  // Exponer la API pública del servicio
  return {
    createMessage,
    getRecentMessages,
    getMessagesSince
  };
}
