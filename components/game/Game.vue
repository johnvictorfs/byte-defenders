<template>
  <div class="p-4 space-y-4 flex flex-col items-center">
    <div class="flex space-x-4">
      <button class="px-4 py-2 rounded-lg shadow-lg bg-gray-600" @click="gameStateStore.startGame()">
        Reset Game
      </button>

      <div class="flex p-4 rounded-lg bg-gray-800 shadow-lg gap-2">
        <span class="font-bold">
          Memory
        </span>
        {{ memoryFormatter(resources.memory) }}
      </div>

      <div class="flex p-4 rounded-lg bg-gray-800 shadow-lg gap-2">
        <span class="font-bold">
          Money
        </span>
        {{ moneyFormatted }}
      </div>

      <DownloadRam />
      <LaunchCryptoScam />
    </div>

    <div class="flex space-x-4 pt-4">
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
            <UpgradeButton :upgrade="upgrade" />
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

          <div v-for="(row, rowIndex) in boardState" :key="rowIndex" class="flex flex-col">
            <div v-for="({ upgrade, enemy }, cellIndex) in row"
              :key="`${upgrade?.id}-${enemy?.id}-${rowIndex}-${cellIndex}`">
              <BoardTile :x="cellIndex" :y="rowIndex" :enemy="enemy" :upgrade="upgrade" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import BoardTile from '~/components/game/BoardTile.vue'
import DownloadRam from '~/components/game/DownloadRam.vue'
import UpgradeButton from '~/components/game/UpgradeButton.vue';
import LaunchCryptoScam from '~/components/game/LaunchCryptoScam.vue';
import { moneyAsCurrency, memoryFormatter } from '~/utils/formatters'

const gameStateStore = useGameStateStore()
const {
  boardState,
  upgradeCosts,
  resources,
  serverRow
} = storeToRefs(gameStateStore)

const moneyFormatted = computed(() => moneyAsCurrency(resources.value.money))

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
    gameStateStore.generateEnemy();
    enemyGenerationTimer = 0;
  }

  if (moveEnemiesTimer >= 2500) {
    gameStateStore.moveEnemies(rafId);
    moveEnemiesTimer = 0;
  }

  // Request next frame
  rafId = requestAnimationFrame(gameLoop);
}

onMounted(() => {
  rafId = requestAnimationFrame(gameLoop);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
});
</script>
