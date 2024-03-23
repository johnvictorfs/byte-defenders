<template>
  <div @click="placeUpgrade(props.x, props.y)" @mouseover="isHovering = true" @mouseleave="isHovering = false"
    v-bind:class="`
      flex justify-center items-center rounded-lg bg-gray-700 shadow-lg w-16 h-16 mt-2
      ${props.selectedUpgrade && !props.upgrade ? 'hover:bg-green-900 cursor-pointer' : ''}
    `">
    <div v-if="upgrade">
      {{ upgrade.emoji }}
    </div>

    <div class="opacity-40" v-else-if="selectedUpgrade && isHovering">
      {{ selectedUpgrade.emoji }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Upgrade } from '@/stores/game'

const isHovering = ref(false)

const props = defineProps<{
  x: number,
  y: number,
  upgrade: Upgrade | null,
  selectedUpgrade: Upgrade | null,
  placeUpgrade: (x: number, y: number) => void,
}>()
</script>
