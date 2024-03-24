<template>
  <Game v-if="gameActive" />
  <StartScreen v-else />

  <a title="View Source" href="https://github.com/johnvictorfs/byte-defenders" class="absolute top-4 right-4 hover:opacity-75 transition-opacity duration-300 cursor-pointer bg-gray-800 p-2 rounded-lg">
    <GitHub />
  </a>
</template>

<script setup lang="ts">
import Game from '~/components/game/Game.vue'
import StartScreen from '~/components/game/StartScreen.vue'
import GitHub from '~/components/icon/GitHub.vue';

const gameStateStore = useGameStateStore()
const { gameActive } = storeToRefs(gameStateStore)
</script>

<style>
body {
  background-color: #172554;
  color: #e2e8f0;
}
</style>
