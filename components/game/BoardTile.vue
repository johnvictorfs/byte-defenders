<template>
  <div @click="placeUpgrade(props.x, props.y)" @mouseover="isHovering = true" @mouseleave="isHovering = false"
    v-bind:class="`
      flex justify-center items-center rounded-lg bg-gray-700 shadow-lg w-16 h-16 mt-2
      ${props.selectedUpgrade && !props.upgrade ? 'hover:bg-green-900 cursor-pointer' : ''}
      ${props.upgrade && props.enemy ? 'animate-bounce' : ''}
    `">

    <div v-if="props.selectedUpgrade && isHovering && !props.upgrade" class="flex flex-col items-center opacity-30">
      {{ props.selectedUpgrade.emoji }}
    </div>

    <div v-if="props.upgrade" class="flex flex-col items-center">
      <span v-bind:class="`pb-1 ${upgradeDeath ? 'animate-ping' : ''}`">
        {{ props.upgrade.emoji }}
      </span>

      <LoadingBar :color="upgradeLifePercentage > 50 ? 'green' : 'yellow'" v-if="props.upgrade.maxLife && props.upgrade.life" :max="props.upgrade.maxLife" :value="props.upgrade.life" />
    </div>

    <div v-if="props.enemy" v-bind:class="`flex flex-col items-center ${enemyDamage ? 'animate-ping' : ''}`">
      <span v-bind:class="`pb-1 ${enemyDeath ? 'animate-bounce' : ''}`">
        {{ props.enemy.emoji }}
      </span>
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
  killCell: (x: number, y: number, type: 'enemy' | 'upgrade') => void,
  enemy?: Enemy | null,
  upgrade?: Upgrade | null,
  selectedUpgrade?: Upgrade | null,
  placeUpgrade: (x: number, y: number) => void,
}>()

const upgradeDeath = ref(false)

const upgradeLife = computed(() => {
  if (!props.upgrade) {
    return 0
  }

  return props.upgrade.life
})

const enemyDamage = ref(false)
const enemyDeath = ref(false)

watch(upgradeLife, (newLife, oldLife) => {
  if (newLife === oldLife || !newLife) {
    return
  }

  upgradeDeath.value = true
  setTimeout(() => {
    upgradeDeath.value = false
  }, 200)

  if (newLife <= 0) {
    setTimeout(() => {
      props.killCell(props.x, props.y, 'upgrade')
    }, 200)
  }
})

const enemyLife = computed(() => {
  if (!props.enemy) {
    return 0
  }

  return props.enemy.life
})

watch(enemyLife, (newLife, oldLife) => {
  if (newLife === oldLife) {
    return
  }

  enemyDamage.value = true
  setTimeout(() => {
    enemyDamage.value = false
  }, 200)

  if (newLife <= 0) {
    setTimeout(() => {

      props.killCell(props.x, props.y, 'enemy')
    }, 200)
  }
})

const upgradeLifePercentage = computed(() => {
  if (!props.upgrade || !props.upgrade.life || !props.upgrade.maxLife) {
    return 0
  }

  return (props.upgrade.life / props.upgrade.maxLife) * 100
})
</script>
