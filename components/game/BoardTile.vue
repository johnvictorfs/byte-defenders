<template>
  <div @click="placeUpgrade(props.x, props.y)" @mouseover="isHovering = true" @mouseleave="isHovering = false"
    v-bind:class="`
      flex justify-center items-center rounded-lg bg-gray-700 shadow-lg w-16 h-16 mt-2
      ${props.selectedUpgrade && !props.upgrade ? 'hover:bg-green-900 cursor-pointer' : ''}
    `">
    <div v-if="props.upgrade" class="flex flex-col items-center">
      <div class="pb-1">
        {{ props.upgrade.emoji }}
      </div>

      <LoadingBar :color="lifePercentage > 50 ? 'green' : lifePercentage > 25 ? 'yellow' : 'red'" v-if="props.upgrade.maxLife && props.upgrade.life" :max="props.upgrade.maxLife" :value="props.upgrade.life" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Upgrade } from '@/stores/game'
import LoadingBar from '~/components/layout/LoadingBar.vue';

const isHovering = ref(false)

const props = defineProps<{
  x: number,
  y: number,
  upgrade?: Upgrade | null,
  selectedUpgrade?: Upgrade | null,
  placeUpgrade: (x: number, y: number) => void,
}>()

const lifePercentage = computed(() => {
  if (!props.upgrade || !props.upgrade.life || !props.upgrade.maxLife) {
    return 0
  }

  return (props.upgrade.life / props.upgrade.maxLife) * 100
})
</script>
