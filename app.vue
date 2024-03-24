<template>
  <Game v-if="gameActive" />
  <StartScreen v-else />
</template>

<script setup lang="ts">
import Game from '~/components/game/Game.vue'
import StartScreen from '~/components/game/StartScreen.vue'

const gameStateStore = useGameStateStore()
const { gameActive } = storeToRefs(gameStateStore)
</script>

<style>
body {
  background-color: #2d3748;
  color: #e2e8f0;
}
</style>
