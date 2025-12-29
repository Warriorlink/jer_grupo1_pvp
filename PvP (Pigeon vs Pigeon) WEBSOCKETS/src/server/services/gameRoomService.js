/**
 * Game Room service - manages active game rooms and game state
 */
export function createGameRoomService() {
  const rooms = new Map(); // roomId -> room data
  let nextRoomId = 1;

  //Posiciones de aparición de objetos y churros
  const itemSpawnPositions = [
    { x: 560, y: 45 },
    { x: 415, y: 200 },
    { x: 790, y: 115 },
    { x: 790, y: 280 },
    { x: 126, y: 115 },
    { x: 126, y: 280 },
    { x: 560, y: 455 }
  ];

  const powerUps = [
    'avena',
    'basura',
    'pluma'
  ];

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

      churro: null,
      powerUp: null,
      itemTimers: [],


      ballActive: true // Track if ball is in play (prevents duplicate goals)
    };

    rooms.set(roomId, room);

    // Store room ID on WebSocket for quick lookup
    player1Ws.roomId = roomId;
    player2Ws.roomId = roomId;
    startItemTimers(room);

    return roomId;
  }


  /**
   * Handle paddle movement from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {number} y - Paddle Y position
   */
  function handlePaddleMove(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    // Relay to the other player
    const opponent = room.player1.ws === ws ? room.player2.ws : room.player1.ws;

    if (opponent.readyState === 1) { // WebSocket.OPEN
      opponent.send(JSON.stringify({
        type: 'paddleUpdate',
        x: data.x,
        y: data.y,
        anim: data.anim,
        facing: data.facing
      }));

    }
  }

  function spawnItem(room, type) {

    const ref = type === 'churro' ? 'churro' : 'powerUp';

    if (room[ref]) return; // Ya existe

    const availablePositions = getAvailablePositions(room);
    if (availablePositions.length === 0) return;

    const pos = availablePositions[
      Math.floor(Math.random() * availablePositions.length)
    ];

    const item = {
      id: Date.now(),
      type,
      x: pos.x,
      y: pos.y
    };

    room[ref] = item;

    if (ref === 'powerUp') {
      setTimeout(() => {
        if (room.active && room.powerUp?.id === item.id) {
          despawnItem(room, 'powerUp');
        }
      }, 9000);
    }


    const msg = {
      type: 'itemSpawn',
      item
    };

    room.player1.ws.send(JSON.stringify(msg));
    room.player2.ws.send(JSON.stringify(msg));
  }


  function startItemTimers(room) {

    const churroTimer = setInterval(() => {
      if (!room.active || room.churro) return;
      spawnItem(room, 'churro');
    }, 5000);

    const powerUpTimer = setInterval(() => {
      if (!room.active || room.powerUp) return;
      const type = powerUps[Math.floor(Math.random() * powerUps.length)];
      spawnItem(room, type);
    }, 7000);

    room.itemTimers.push(churroTimer, powerUpTimer);
  }

  //Manejar la recogida de objetos
  function handleItemTouch(ws, data) {
    const room = rooms.get(ws.roomId);
    if (!room || !room.active) return;

    const item =
      room.churro?.id === data.itemId ? room.churro :
        room.powerUp?.id === data.itemId ? room.powerUp :
          null;

    if (!item) return;

    const playerId = room.player1.ws === ws ? 'player1' : 'player2';

    // Resolver efecto aquí (score, buffs, etc.)
    // TODO: aplicar lógica de efecto

    despawnItem(room, item.type === 'churro' ? 'churro' : 'powerUp');
  }


  function despawnItem(room, ref) {

    const item = room[ref];
    if (!item) return;

    const msg = {
      type: 'itemDespawn',
      itemId: item.id,
      itemType: ref
    };

    room.player1.ws.send(JSON.stringify(msg));
    room.player2.ws.send(JSON.stringify(msg));

    room[ref] = null;
  }


  function getAvailablePositions(room) {
    return itemSpawnPositions.filter(pos => {

      if (room.churro &&
        room.churro.x === pos.x &&
        room.churro.y === pos.y) {
        return false;
      }

      if (room.powerUp &&
        room.powerUp.x === pos.x &&
        room.powerUp.y === pos.y) {
        return false;
      }

      return true;
    });
  }


  /**
   * Handle attack from a player
   * @param {WebSocket} ws - Player's WebSocket
   * @param {number} y - Paddle Y position
   */
  function handleAttack(ws, data) {
    const roomId = ws.roomId;
    if (!roomId) return;

    const room = rooms.get(roomId);
    if (!room || !room.active) return;

    const attackerId = room.player1.ws === ws ? 'player1' : 'player2';
    const defenderId = attackerId === 'player1' ? 'player2' : 'player1';

    // Broadcast a AMBOS
    const msg = {
      type: 'attackResolve',
      attackerId,
      defenderId,
      facing: data.facing,
      x: data.x,
      y: data.y
    };

    room.player1.ws.send(JSON.stringify(msg));
    room.player2.ws.send(JSON.stringify(msg));
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

      // Mark room as inactive
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
    if (room.itemTimers) {
      room.itemTimers.forEach(timer => clearInterval(timer));
    }
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
    handleAttack,
    handleGoal,
    spawnItem,
    despawnItem,
    getAvailablePositions,
    startItemTimers,
    handleDisconnect,
    getActiveRoomCount,
    handleItemTouch
  };
}
