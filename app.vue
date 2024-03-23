<template>
  <div class="p-4 space-y-4">
    <div class="flex space-x-4">
      <div class="flex p-4 rounded-lg bg-gray-800 shadow-lg gap-2">
        <span class="font-bold">
          Free Memory
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
    </div>

    <div class="flex space-x-4">
      <div class="flex flex-col p-4 rounded-lg bg-gray-800 shadow-lg">
        <div class="space-y-4">
          <div v-for="upgrade in upgradeCosts" :key="upgrade.name" class="flex justify-between">
            <UpgradeButton
              :upgrade="upgrade"
              :selectedUpgrade="selectedUpgrade"
              :canAfford="canAfford"
              :selectUpgrade="selectUpgrade"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-col p-4 rounded-lg bg-gray-800 shadow-lg">
        <div class="grid grid-cols-8 gap-2">
          <div v-for="(row, rowIndex) in boardMatrix" :key="rowIndex" class="flex flex-col">
            <div v-for="(upgrade, cellIndex) in row" :key="upgrade?.name || cellIndex">
              <BoardTile :x="cellIndex" :y="rowIndex" :upgrade="upgrade" :selectedUpgrade="selectedUpgrade"
                :placeUpgrade="placeUpgrade" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Upgrade } from '@/stores/game'
import BoardTile from '~/components/game/BoardTile.vue'
import DownloadRam from '~/components/game/DownloadRam.vue'
import UpgradeButton from '~/components/game/UpgradeButton.vue';
import { moneyAsCurrency, memoryFormatter } from '~/utils/formatters'

const memory = ref(4 * 1024 * 1024 * 1024)

const money = ref(0)
const moneyFormatted = computed(() => moneyAsCurrency(money.value))

function downloadRam(value: number) {
  memory.value += value
}

const selectedUpgrade = ref<Upgrade | null>(null)
function selectUpgrade(upgrade: Upgrade) {
  if (upgrade.name === selectedUpgrade.value?.name) {
    selectedUpgrade.value = null
    return
  }

  selectedUpgrade.value = upgrade
}

const boardMatrix = ref<((null | Upgrade)[][])>([
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
])

function canAfford(upgrade: Upgrade) {
  return memory.value >= upgrade.costMemory && money.value >= upgrade.costMoney
}

function placeUpgrade(x: number, y: number) {
  if (!selectedUpgrade.value || !canAfford(selectedUpgrade.value) || boardMatrix.value[y][x]) {
    return
  }

  boardMatrix.value[y][x] = selectedUpgrade.value
  memory.value -= selectedUpgrade.value.costMemory
  money.value -= selectedUpgrade.value.costMoney
  selectedUpgrade.value = null
}

const upgradeCosts: Upgrade[] = [
  {
    name: 'Firewall',
    costMemory: 500 * 1024 * 1024,
    costMoney: 0,
    emoji: '🔥',
  },
  {
    name: 'Basic Antivirus',
    costMemory: 100 * 1024 * 1024,
    costMoney: 0,
    emoji: '🛡️',
  },
  {
    name: 'Premium Antivirus',
    costMemory: 1000 * 1024 * 1024,
    costMoney: 100,
    emoji: '🔰',
  },
  {
    name: 'Cyber Security Engineer',
    costMemory: 0,
    costMoney: 1000,
    emoji: '👩‍💻',
  }
] as const
</script>

<style>
body {
  background-color: #2d3748;
  color: #e2e8f0;
}
</style>
