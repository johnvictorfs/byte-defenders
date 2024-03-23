<template>
  <div @click="placeUpgrade(props.x, props.y)" @mouseover="isHovering = true" @mouseleave="isHovering = false"
    v-bind:class="`
      flex justify-center items-center rounded-lg bg-gray-700 shadow-lg w-16 h-16 mt-2
      ${props.selectedUpgrade && !props.upgrade ? 'hover:bg-green-900 cursor-pointer' : ''}
    `">

    <div v-if="props.selectedUpgrade && isHovering" class="flex flex-col items-center opacity-30">
      {{ props.selectedUpgrade.emoji }}
    </div>

    <div v-if="props.upgrade" class="flex flex-col items-center">
      <div class="pb-1">
        {{ props.upgrade.emoji }}
      </div>

      <LoadingBar :color="upgradeLifePercentage > 50 ? 'green' : 'yellow'" v-if="props.upgrade.maxLife && props.upgrade.life" :max="props.upgrade.maxLife" :value="props.upgrade.life" />
    </div>

    <div v-if="props.enemy" class="flex flex-col items-center">
      {{ props.enemy.emoji }}
      <LoadingBar color="red" v-if="props.enemy.maxLife && props.enemy.life" :max="props.enemy.maxLife" :value="props.enemy.life" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Upgrade, Enemy } from '@/stores/game'
import LoadingBar from '~/components/layout/LoadingBar.vue';

const isHovering = ref(false)

const props = defineProps<{
  x: number,
  y: number,
  enemy?: Enemy | null,
  upgrade?: Upgrade | null,
  selectedUpgrade?: Upgrade | null,
  placeUpgrade: (x: number, y: number) => void,
}>()

const upgradeLifePercentage = computed(() => {
  if (!props.upgrade || !props.upgrade.life || !props.upgrade.maxLife) {
    return 0
  }

  return (props.upgrade.life / props.upgrade.maxLife) * 100
})

const enemyLifePercentage = computed(() => {
  if (!props.enemy || !props.enemy.life || !props.enemy.maxLife) {
    return 0
  }

  return (props.enemy.life / props.enemy.maxLife) * 100
})
</script>
