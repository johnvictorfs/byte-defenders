<template>
  <button v-bind:class="`
    px-4 py-2 pb-4 rounded-lg shadow-lg inline-flex items-center border-2 border-sky-700 transition-colors
    ${!downloadRamCooldown ? 'hover:bg-sky-900' : 'cursor-not-allowed'}
    ${!downloadRamCooldown ? 'bg-sky-800' : 'bg-gray-600'}
  `" :disabled="downloadRamCooldown > 0" @click="gameStateStore.downloadRam">
    <div class="flex">
      <ArrowDownTray v-bind:class="`w-6 h-6 mr-3 mt-2 ${downloadRamCooldown ? 'animate-bounce' : ''}`" />
      <span>
        Download Ram
        <LoadingBar :value="downloadRamCooldown" :max="maxDownloadRamCooldown" />
      </span>
    </div>
  </button>
</template>

<script lang="ts" setup>
import LoadingBar from '~/components/layout/LoadingBar.vue'
import ArrowDownTray from '~/components/icon/ArrowDownTray.vue'
const gameStateStore = useGameStateStore()
const { downloadRamCooldown, maxDownloadRamCooldown } = storeToRefs(gameStateStore)
</script>
