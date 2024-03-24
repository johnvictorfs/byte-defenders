<template>
  <button v-bind:class="`
    px-4 py-2 pb-4 rounded-lg shadow-lg inline-flex items-center
    ${!downloadRamCooldown ? 'hover:bg-blue-900' : 'cursor-not-allowed'}
    ${!downloadRamCooldown ? 'bg-blue-900' : 'bg-gray-600'}
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
