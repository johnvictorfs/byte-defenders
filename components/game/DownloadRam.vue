<template>
  <button v-bind:class="`
    px-4 py-2 pb-4 rounded-lg shadow-lg inline-flex items-center
    ${!currentDownloadRamCooldown ? 'hover:bg-blue-900' : 'cursor-not-allowed'}
    ${!currentDownloadRamCooldown ? 'bg-blue-900' : 'bg-gray-600'}
  `" :disabled="currentDownloadRamCooldown > 0" @click="buyMemory">
  <div class="flex">
    <ArrowDownTray v-bind:class="`w-6 h-6 mr-3 mt-2 ${!currentDownloadRamCooldown ? 'animate-bounce' : ''}`" />
    <span>
      Download Ram
      <LoadingBar :value="currentDownloadRamCooldown" :max="DOWNLOAD_RAM_COOLDOWN" />
    </span>
  </div>
</button>
</template>

<script lang="ts" setup>
import LoadingBar from '~/components/layout/LoadingBar.vue'
import ArrowDownTray from '~/components/icon/ArrowDownTray.vue'

const props = defineProps<{
  downloadRam: (value: number) => void
}>()

const DOWNLOAD_RAM_COOLDOWN = 30
const currentDownloadRamCooldown = ref(0)

const buyMemory = () => {
  if (currentDownloadRamCooldown.value > 0) {
    return
  }

  currentDownloadRamCooldown.value = DOWNLOAD_RAM_COOLDOWN

  const cooldownInterval = setInterval(() => {
    currentDownloadRamCooldown.value--

    if (currentDownloadRamCooldown.value === 0) {
      clearInterval(cooldownInterval)
    }
  }, 1000)

  props.downloadRam(1024 * 1024 * 1024)
}
</script>
