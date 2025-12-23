/**
 * Game Room service - manages active game rooms and game state
 */
import { createItemSpawner } from './itemSpawnerService.js';

export function createGameRoomService() {
  const rooms = new Map(); // roomId -> room data
  let nextRoomId = 1;

  /**
   * Create a new game room with two players
   * @param {WebSocket} player1Ws - Player 1's WebSocket
   * @param {WebSocket} player2Ws - Player 2's WebSocket
   * @returns {string} Room ID
   */
  function createRoom(player1Ws, player2Ws) {
    const roomId = `room_${nextRoomId++}`;

    const room = {
      id: roomId,
      player1: {
        ws: player1Ws,
        score: 0
      },
      player2: {
        ws: player2Ws,
        score: 0
      },
      active: true,
      ballActive: true // Track if ball is in play (prevents duplicate goals)
    };

    // Items state for the room
    room.items = [];

    // Create item spawner for this room
    room.spawner = createItemSpawner({
      onSpawn: (item) => {
        room.items.push(item);
        broadcastState(room);
      },
      onRemove: (item) => {
        room.items = room.items.filter(i => i.id !== item.id);
        broadcastState(room);
      }
    });

    // Start auto spawns
    room.spawner.startAutoSpawn();

    rooms.set(roomId, room);

    // Store room ID on WebSocket for quick lookup
    player1Ws.roomId = roomId;
    player2Ws.roomId = roomId;

    // Send initial empty state to both players
    broadcastState(room);

    return roomId;
  }

  function sendToRoom(room, msg) {
    try {
      const raw = JSON.stringify(msg);
      if (room.player1.ws && room.player1.ws.readyState === 1) room.player1.ws.send(raw);
      if (room.player2.ws && room.player2.ws.readyState === 1) room.player2.ws.send(raw);
    } catch (e) {
      console.error('Error sending to room:', e);
    }
  }

  function buildState(room) {
    return {
      players: {
        player1: { score: room.player1.score },
        player2: { score: room.player2.score }
      },
      items: room.items.slice()
    };
  }

  function broadcastState(room) {
    const stateMsg = { type: 'state', state: buildState(room) };
    sendToRoom(room, stateMsg);
  }

  /**
   * Handle spawn command from a client (manual spawn for testing or admin)
   * @param {WebSocket} ws
   * @param {string} type - optional 'churro' or powerup type
   */
  function handleSpawnCommand(ws, type) {
    const roomId = ws.roomId;
    if (!roomId) return;
    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    const item = room.spawner.spawnRandom(type);
    if (item) broadcastState(room);
  }

  /**
   * Handle paddle movement from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {number} y - Paddle Y position
   */
  function handlePaddleMove(ws, y) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Relay to the other player
    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify({
        type: 'paddleUpdate',
        y
      }));
    }
  }

  /**
   * Handle goal event from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {string} side - Which side scored ('left' or 'right')
   */
  function handleGoal(ws, side) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Prevent duplicate goal detection (both clients send goal event)
    // Only process goal if ball is active
    if (!room.ballActive) {
      return; // Ball not in play, ignore goal
    }
    room.ballActive = false; // Mark ball as inactive until relaunched

    // Update scores
    // When ball hits LEFT goal (x=0), player2 scores (player1 missed)
    // When ball hits RIGHT goal (x=800), player1 scores (player2 missed)
    if (side === 'left') {
      room.player2.score++;
    } else if (side === 'right') {
      room.player1.score++;
    }

    // Broadcast score update to both players
    const scoreUpdate = {
      type: 'scoreUpdate',
      player1Score: room.player1.score,
      player2Score: room.player2.score
    };

    room.player1.ws.send(JSON.stringify(scoreUpdate));
    room.player2.ws.send(JSON.stringify(scoreUpdate));

    // Check win condition (first to 2)
    if (room.player1.score >= 2 || room.player2.score >= 2) {
      const winner = room.player1.score >= 2 ? 'player1' : 'player2';

      const gameOverMsg = {
        type: 'gameOver',
        winner,
        player1Score: room.player1.score,
        player2Score: room.player2.score
      };

      room.player1.ws.send(JSON.stringify(gameOverMsg));
      room.player2.ws.send(JSON.stringify(gameOverMsg));

      // Mark room as inactive and clear spawner
      try { if (room.spawner && typeof room.spawner.clear === 'function') room.spawner.clear(); } catch (e) {}
      room.active = false;
    } else {
      // Relaunch ball after 1 second delay
      setTimeout(() => {
        if (room.active) {
          // Generate new ball direction
          const angle = (Math.random() * 60 - 30) * (Math.PI / 180); // -30 to 30 degrees
          const speed = 300;
          const ballData = {
            x: 400,
            y: 300,
            vx: speed * Math.cos(angle),
            vy: speed * Math.sin(angle)
          };

          // Send ball relaunch to both players
          const relaunchMsg = {
            type: 'ballRelaunch',
            ball: ballData
          };

          room.player1.ws.send(JSON.stringify(relaunchMsg));
          room.player2.ws.send(JSON.stringify(relaunchMsg));

          // Mark ball as active again
          room.ballActive = true;
        }
      }, 1000);
    }
  }

  /**
   * Handle player disconnection
   * @param {WebSocket} ws - Disconnected player's WebSocket
   */
  function handleDisconnect(ws) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room) return;

    // Only notify the other player if the game is still active
    // If the game already ended (room.active = false), don't send disconnect message
    if (room.active) {
      const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

      if (opponent.readyState === 1) { // WebSocket.OPEN
        opponent.send(JSON.stringify({
          type: 'playerDisconnected'
        }));
      }
    }

    // Clean up room
    room.active = false;
    try {
      if (room.spawner && typeof room.spawner.clear === 'function') room.spawner.clear();
    } catch (e) {}
    rooms.delete(roomId);
  }

  /**
   * Get number of active rooms
   * @returns {number} Number of active rooms
   */
  function getActiveRoomCount() {
    return Array.from(rooms.values()).filter(room => room.active).length;
  }

  return {
    createRoom,
    handlePaddleMove,
    handleGoal,
    handleDisconnect,
    getActiveRoomCount,
    handleSpawnCommand
  };
}
