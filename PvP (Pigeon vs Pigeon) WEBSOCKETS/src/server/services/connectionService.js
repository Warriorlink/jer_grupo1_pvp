/**
 * Service para gestionar las conexiones activas de usuarios
 */
export function createConnectionService() {
  //Map para almacenar sesiones conectadas: sessionId -> timestamp de última conexión
  const connectedSessions = new Map();

  //Configuración de timeout (3 segundos sin actividad = desconectado)
  const CONNECTION_TIMEOUT = 3000; //3 segundos en milisegundos
  const CLEANUP_INTERVAL = 1000;    //Limpiar cada segundo

  //Limpiar sesiones inactivas periódicamente
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [sessionId, lastSeen] of connectedSessions) {
      if (now - lastSeen > CONNECTION_TIMEOUT) {
        connectedSessions.delete(sessionId);
      }
    }
  }, CLEANUP_INTERVAL);

  return {
    /**
     * Registrar o actualizar la conexión de una sesión
     * @param {string} sessionId - ID único de la sesión del cliente
     * @returns {number} Número total de sesiones conectadas
     */
    updateConnection(sessionId) {
      connectedSessions.set(sessionId, Date.now());
      //Consolo.log del usuario conectado
      return connectedSessions.size;
    },

    /**
     * Obtener el número de sesiones conectadas
     * @returns {number}
     */
    getConnectedCount() {
      return connectedSessions.size;
    },

    /**
     * Detener el cleanup interval (útil para testing o shutdown)
     */
    stopCleanup() {
      clearInterval(cleanupInterval);
    }
  };
}
