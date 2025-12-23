/**
 * Item Spawner Service
 * Instanciable por sala. Genera items (churro / powerups) en posiciones aleatorias
 * y notifica mediante callback cuando aparece o desaparece un item.
 */
export function createItemSpawner(config = {}) {
  const spawnPositions = config.spawnPositions || [
    { x: 560, y: 45 },
    { x: 415, y: 200 },
    { x: 790, y: 115 },
    { x: 790, y: 280 },
    { x: 126, y: 115 },
    { x: 126, y: 280 },
    { x: 560, y: 455 }
  ];

  const powerUps = config.powerUps || ['avena', 'basura', 'pluma'];

  const onSpawn = typeof config.onSpawn === 'function' ? config.onSpawn : () => {};
  const onRemove = typeof config.onRemove === 'function' ? config.onRemove : () => {};

  let items = new Map(); // id -> {id, type, x, y}
  let nextId = 1;
  let timers = [];

  function randPos(excludePositions = []) {
    const available = spawnPositions.filter(p => !excludePositions.some(e => e.x === p.x && e.y === p.y));
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
  }

  function addItem(item) {
    items.set(item.id, item);
    onSpawn(item);
  }

  function removeItem(id) {
    const it = items.get(id);
    if (!it) return;
    items.delete(id);
    onRemove(it);
  }

  function spawnRandom(type) {
    // Enforce single churro and single power-up at a time
    const existing = Array.from(items.values());
    const hasChurro = existing.some(i => i.type === 'churro');
    const hasPowerUp = existing.some(i => i.type !== 'churro');

    // Decide desired type
    const desiredType = type || (Math.random() < 0.5 ? 'churro' : powerUps[Math.floor(Math.random() * powerUps.length)]);

    if (desiredType === 'churro' && hasChurro) return null;
    if (desiredType !== 'churro' && hasPowerUp) return null;

    // Ensure we don't spawn on top of existing items
    const occupied = existing.map(i => ({ x: i.x, y: i.y }));
    const pos = randPos(occupied);
    if (!pos) return null;

    const id = `item_${nextId++}`;
    const item = { id, type: desiredType, x: pos.x, y: pos.y };
    addItem(item);

    return item;
  }

  function getItems() {
    return Array.from(items.values());
  }

  function clear() {
    items.clear();
    timers.forEach(t => clearTimeout(t));
    timers = [];
  }

  function startAutoSpawn() {
    // churro every ~5s, powerup every ~7s (approximate)
    function scheduleChurro() {
      const t = setTimeout(() => {
        // Only spawn if there is space
        spawnRandom('churro');
        scheduleChurro();
      }, 5000 + Math.floor(Math.random() * 1000));
      timers.push(t);
    }

    function schedulePowerup() {
      const t = setTimeout(() => {
        spawnRandom();
        schedulePowerup();
      }, 7000 + Math.floor(Math.random() * 1500));
      timers.push(t);
    }

    scheduleChurro();
    schedulePowerup();
  }

  return {
    spawnRandom,
    getItems,
    removeItem,
    clear,
    startAutoSpawn
  };
}
