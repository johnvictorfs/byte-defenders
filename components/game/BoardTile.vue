<template>
  <div @click="gameStateStore.placeUpgrade(props.x, props.y)" @mouseover="isHovering = true"
    @mouseleave="isHovering = false" v-bind:class="`
      flex justify-center items-center rounded-lg shadow-md w-16 h-16 mt-2 transition-colors
      ${selectedUpgrade && !props.upgrade ? 'hover:bg-green-900 cursor-pointer' : ''}
      ${props.upgrade && props.enemy ? 'animate-pulse' : ''}
    `">

    <div v-if="selectedUpgrade && isHovering && !props.upgrade" class="flex flex-col items-center opacity-30">
      {{ selectedUpgrade.emoji }}
    </div>

    <div v-if="props.upgrade" class="flex flex-col items-center" :title="props.upgrade.name">
      <span v-bind:class="`pb-1 ${upgradeDeath ? 'animate-ping' : ''} ${upgradeLaunchedAttack ? 'animate-spin' : ''}`">
        {{ props.upgrade.emoji }}
      </span>

      <LoadingBar :color="upgradeLifePercentage > 50 ? 'green' : 'yellow'"
        v-if="props.upgrade.maxLife && props.upgrade.life" :max="props.upgrade.maxLife" :value="props.upgrade.life" />
    </div>

    <div v-if="props.enemy"
      v-bind:class="`flex flex-col items-center animate-bounce ${enemyDamage ? 'animate-ping' : ''}`"
      :title="props.enemy.name">
      <span v-bind:class="`pb-1 ${enemyDeath ? 'animate-pulse' : ''}`">
        {{ props.enemy.emoji }}
      </span>
      <LoadingBar color="red" v-if="props.enemy.maxLife && props.enemy.life" :max="props.enemy.maxLife"
        :value="props.enemy.life" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGameStateStore, type Upgrade, type Enemy } from '~/stores/game'
import LoadingBar from '~/components/layout/LoadingBar.vue';

const gameStateStore = useGameStateStore()
const { selectedUpgrade } = storeToRefs(gameStateStore)

const isHovering = ref(false)

const props = defineProps<{
  x: number,
  y: number,
  enemy?: Enemy | null,
  upgrade?: Upgrade | null,
}>()

const upgradeDeath = computed(() => {
  if (!props.upgrade || props.upgrade.life === undefined) {
    return false
  }

  return props.upgrade.life <= 0
})

const upgradeLife = computed(() => {
  if (!props.upgrade) {
    return 0
  }

  return props.upgrade.life
})

const enemyDamage = ref(false)
const enemyDeath = computed(() => {
  if (!props.enemy) {
    return false
  }

  return props.enemy.life <= 0
})

const upgradeLaunchedAttack = computed(() => {
  if (!props.upgrade) {
    return
  }

  return props.upgrade.launchedAttack
})

watch(upgradeLife, (newLife) => {
  if (newLife !== undefined && newLife <= 0) {
    setTimeout(() => {
      if (props.upgrade?.id) {
        gameStateStore.killCellById(props.upgrade.id)
      }
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
  if (newLife <= 0) {
    setTimeout(() => {
      if (props.enemy?.id) {
        gameStateStore.killCellById(props.enemy.id)
      }
    }, 200)
  }

  if (newLife === oldLife) {
    return
  }

  enemyDamage.value = true
  setTimeout(() => {
    enemyDamage.value = false
  }, 200)
})

const upgradeLifePercentage = computed(() => {
  if (!props.upgrade || !props.upgrade.life || !props.upgrade.maxLife) {
    return 0
  }

  return (props.upgrade.life / props.upgrade.maxLife) * 100
})
</script>
