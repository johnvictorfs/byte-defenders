<template>
  <button @mouseenter="hoverIn" @mouseleave="hoverOut" v-bind:class="`
                px-4 py-2 rounded-lg shadow-lg w-full transition-colors
                ${gameStateStore.canAfford(props.upgrade) ? 'hover:bg-sky-800' : 'cursor-not-allowed'}
                ${gameStateStore.canAfford(props.upgrade) ? 'bg-sky-700' : 'bg-gray-600'}
                ${selectedUpgrade?.name === props.upgrade.name ? 'border-2 border-sky-300' : 'border-2 border-gray-800'}
              `" :disabled="!gameStateStore.canAfford(props.upgrade)"
    @click="gameStateStore.selectUpgrade(props.upgrade)" :title="props.upgrade.description">
    <span class="font-bold">
      {{ props.upgrade.name }} {{ props.upgrade.emoji }}
    </span>

    <div class="text-gray-300 flex flex-col text-sm items-center space-y-3">
      <div v-if="props.upgrade.costMoney > 0" class="flex">
        {{ moneyAsCurrency(props.upgrade.costMoney) }}
      </div>

      <div v-if="props.upgrade.costMemory > 0" class="flex">
        {{ memoryFormatter(props.upgrade.costMemory) }}
      </div>

      <div v-if="hovering" class="flex flex-col items-center space-y-1">
        <div v-if="props.upgrade.maxLife" class="flex items-center">
          <IconHeart class="mr-3 mb-1 w-4 h-4" /> {{ props.upgrade.maxLife }}
        </div>

        <div v-if="props.upgrade.attack" class="flex items-center">
          <IconSword class="mr-3 mb-1 w-4 h-4" /> {{ props.upgrade.attack }}
          <span v-if="props.upgrade.attackRange" class="pl-2">
            (Range: {{ props.upgrade.attackRange }})
          </span>
        </div>
      </div>
    </div>
  </button>
</template>

<script lang="ts" setup>
import type { Upgrade } from '~/stores/game'
import { moneyAsCurrency, memoryFormatter } from '~/utils/formatters'

const props = defineProps<{
  upgrade: Upgrade,
}>()

const gameStateStore = useGameStateStore()
const { selectedUpgrade } = storeToRefs(gameStateStore)

const hovering = ref(false)

function hoverIn() {
  hovering.value = true
}

function hoverOut() {
  hovering.value = false
}
</script>

<style scoped>
button {
  overflow: hidden;
  transition: height 0.3s ease-out;
  height: auto;
}
</style>
