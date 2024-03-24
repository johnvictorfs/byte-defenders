<template>
  <button v-bind:class="`
                px-4 py-2 rounded-lg shadow-lg w-full
                ${gameStateStore.canAfford(props.upgrade) ? 'hover:bg-green-900' : 'cursor-not-allowed'}
                ${gameStateStore.canAfford(props.upgrade) ? 'bg-green-800' : 'bg-gray-600'}
                ${selectedUpgrade?.name === props.upgrade.name ? 'border-2 border-green-500' : 'border-2 border-gray-800'}
              `" :disabled="!gameStateStore.canAfford(props.upgrade)" @click="gameStateStore.selectUpgrade(props.upgrade)">
    <span class="font-bold">
      {{ props.upgrade.name }} {{ props.upgrade.emoji }}
    </span>

    <span class="text-gray-300">
      <div v-if="props.upgrade.costMoney > 0">
        {{ moneyAsCurrency(props.upgrade.costMoney) }}
      </div>

      <div v-if="props.upgrade.costMemory > 0">
        {{ memoryFormatter(props.upgrade.costMemory) }}
      </div>
    </span>
  </button>
</template>

<script lang="ts" setup>
import type { Upgrade } from '~/stores/game'
import { moneyAsCurrency, memoryFormatter } from '~/utils/formatters'

const gameStateStore = useGameStateStore()
const { selectedUpgrade } = storeToRefs(gameStateStore)

const props = defineProps<{
  upgrade: Upgrade,
}>()
</script>
