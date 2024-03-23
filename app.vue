<template>
  <div class="p-4 space-y-4">
    <div class="flex space-x-4">
      <div class="flex p-4 rounded-lg bg-gray-800 shadow-lg gap-2">
        <span class="font-bold">
          Memory
        </span>
        {{ memoryFormatter(memory) }}
      </div>

      <div class="flex p-4 rounded-lg bg-gray-800 shadow-lg gap-2">
        <span class="font-bold">
          Money
        </span>
        {{ moneyFormatted }}
      </div>

      <DownloadRam :downloadRam="downloadRam" />
      <LaunchCryptoScam :launchScam="launchCryptoScam" />
    </div>

    <div class="flex space-x-4">
      <div class="flex flex-col p-4 rounded-lg bg-gray-800 shadow-lg">
        <div class="space-y-4">
          <div class="w-full flex gap-2">
            <button class="w-full px-4 py-2 rounded-lg shadow-lg bg-gray-600">
              Uninstall 🗑️
            </button>

            <button class="w-full px-4 py-2 rounded-lg shadow-lg bg-gray-600">
              Fire 🪓
            </button>
          </div>

          <hr />

          <div v-for="upgrade in upgradeCosts" :key="upgrade.name" class="flex justify-between">
            <UpgradeButton :upgrade="upgrade" :selectedUpgrade="selectedUpgrade" :canAfford="canAfford"
              :selectUpgrade="selectUpgrade" />
          </div>
        </div>
      </div>

      <div class="flex flex-col p-4 rounded-lg bg-gray-800 shadow-lg">
        <div class="grid grid-cols-8 gap-2">
          <div v-for="(server, serverIndex) in serverRow" :key="serverIndex"
            class="flex justify-center p-4 rounded-lg bg-gray-500 shadow-lg">
            <div v-if="server.owned">
              ❌
            </div>
            <div v-else>
              {{ server.emoji }}
            </div>
          </div>

          <div v-for="(row, rowIndex) in boardMatrix" :key="rowIndex" class="flex flex-col">
            <div v-for="({ upgrade, enemy }, cellIndex) in row"
              :key="`${upgrade?.id}-${enemy?.id}-${rowIndex}-${cellIndex}`">
              <BoardTile :killCell="killCell" :x="cellIndex" :y="rowIndex" :enemy="enemy" :upgrade="upgrade"
                :selectedUpgrade="selectedUpgrade" :placeUpgrade="placeUpgrade" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Upgrade, Enemy } from '@/stores/game'
import BoardTile from '~/components/game/BoardTile.vue'
import DownloadRam from '~/components/game/DownloadRam.vue'
import UpgradeButton from '~/components/game/UpgradeButton.vue';
import LaunchCryptoScam from '~/components/game/LaunchCryptoScam.vue';
import { moneyAsCurrency, memoryFormatter } from '~/utils/formatters'

const memory = ref(4 * 1024 * 1024 * 1024)

const money = ref(0)
const moneyFormatted = computed(() => moneyAsCurrency(money.value))

function downloadRam(value: number) {
  memory.value += value
}

function launchCryptoScam(value: number) {
  money.value += value
}

function killCell(x: number, y: number, type: 'enemy' | 'upgrade') {
  boardMatrix.value[y][x][type] = undefined
}

let lastFrameTime = performance.now();
let rafId: number;
let enemyGenerationTimer = 0;
let moveEnemiesTimer = 0;

function gameLoop(timestamp: number) {
  const deltaTime = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  enemyGenerationTimer += deltaTime;
  moveEnemiesTimer += deltaTime;

  if (enemyGenerationTimer >= 4500) {
    generateEnemies();
    enemyGenerationTimer = 0;
  }

  if (moveEnemiesTimer >= 2500) {
    moveEnemies();
    moveEnemiesTimer = 0;
  }

  // Request next frame
  rafId = requestAnimationFrame(gameLoop);
}

function generateEnemies() {
  const random = Math.random();
  if (random < 0.9) {
    const enemy = {
      id: crypto.randomUUID(),
      name: 'Basic Virus',
      life: 30,
      maxLife: 30,
      damage: 5,
      emoji: '🦠'
    };
    const randomColumn = Math.floor(Math.random() * 8);
    boardMatrix.value[randomColumn][7].enemy = enemy;
  }
}

function moveEnemies() {
  boardMatrix.value.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.enemy) {
        const reachedServer = x === 0;
        if (reachedServer) {
          if (serverRow.value[y].owned) {
            alert('Game over!');
            cancelAnimationFrame(rafId);
            return;
          }

          serverRow.value[y].owned = true;
          killCell(x, y, 'enemy');
          return;
        }

        const nextDefender = cell.upgrade;

        if (nextDefender?.life) {
          if (cell.enemy.damage) {
            nextDefender.life -= cell.enemy.damage;
          }

          if (nextDefender.attack) {
            cell.enemy.life -= nextDefender.attack;
          }

          return;
        }

        // Move up
        boardMatrix.value[y][x - 1].enemy = cell.enemy;
        killCell(x, y, 'enemy');
      }
    });
  });
}

onMounted(() => {
  rafId = requestAnimationFrame(gameLoop);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
});

const selectedUpgrade = ref<Upgrade | null>(null)
function selectUpgrade(upgrade: Upgrade) {
  if (upgrade.name === selectedUpgrade.value?.name) {
    selectedUpgrade.value = null
    return
  }

  selectedUpgrade.value = upgrade
}

type CellValue = {
  upgrade?: Upgrade
  enemy?: Enemy
}

const serverRow = ref([
  { emoji: '🖥️', owned: false },
  { emoji: '🖥️', owned: false },
  { emoji: '🖥️', owned: false },
  { emoji: '🖥️', owned: false },
  { emoji: '🖥️', owned: false },
  { emoji: '🖥️', owned: false },
  { emoji: '🖥️', owned: false },
  { emoji: '🖥️', owned: false },
])

const boardMatrix = ref<((CellValue)[][])>([
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}],
])

function canAfford(upgrade: Upgrade) {
  return memory.value >= upgrade.costMemory && money.value >= upgrade.costMoney
}

function placeUpgrade(x: number, y: number) {
  if (!selectedUpgrade.value || !canAfford(selectedUpgrade.value) || boardMatrix.value[y][x].upgrade) {
    return
  }

  const upgradeClone = { ...selectedUpgrade.value }
  upgradeClone.id = crypto.randomUUID()

  boardMatrix.value[y][x].upgrade = upgradeClone
  memory.value -= upgradeClone.costMemory
  money.value -= upgradeClone.costMoney
  selectedUpgrade.value = null
}

const upgradeCosts: Upgrade[] = [
  {
    name: 'Firewall',
    costMemory: 500 * 1024 * 1024,
    costMoney: 0,
    emoji: '🔥',
    upgradeType: 'software',
    life: 200,
    maxLife: 200,
    attack: 0
  },
  {
    name: 'Basic Antivirus',
    costMemory: 100 * 1024 * 1024,
    costMoney: 0,
    emoji: '🛡️',
    upgradeType: 'software',
    life: 50,
    maxLife: 50,
    attack: 10
  },
  {
    name: 'Premium Antivirus',
    costMemory: 1000 * 1024 * 1024,
    costMoney: 100,
    emoji: '🔰',
    upgradeType: 'software',
    life: 200,
    maxLife: 200,
    attack: 30
  },
  {
    name: 'Cyber Security Engineer',
    costMemory: 0,
    costMoney: 1000,
    emoji: '👩‍💻',
    upgradeType: 'person',
    life: 20,
    maxLife: 20,
    attack: 50
  }
] as const
</script>

<style>
body {
  background-color: #2d3748;
  color: #e2e8f0;
}
</style>
