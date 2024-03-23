<template>
  <button v-bind:class="`
                px-4 py-2 rounded-lg shadow-lg w-full
                ${canAfford(props.upgrade) ? 'hover:bg-green-900' : 'cursor-not-allowed'}
                ${canAfford(props.upgrade) ? 'bg-green-800' : 'bg-gray-600'}
                ${props.selectedUpgrade?.name === props.upgrade.name ? 'border-2 border-green-500' : 'border-2 border-gray-800'}
              `" :disabled="!canAfford(props.upgrade)" @click="selectUpgrade(props.upgrade)">
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

const props = defineProps<{
  upgrade: Upgrade,
  selectedUpgrade: Upgrade | null,
  canAfford: (upgrade: Upgrade) => boolean,
  selectUpgrade: (upgrade: Upgrade) => void,
}>()
</script>
