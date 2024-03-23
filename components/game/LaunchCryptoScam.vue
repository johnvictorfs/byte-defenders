<template>
  <button v-bind:class="`
    px-4 py-2 pb-4 rounded-lg shadow-lg inline-flex items-center
    ${!currentCooldown ? 'hover:bg-orange-900' : 'cursor-not-allowed'}
    ${!currentCooldown ? 'bg-orange-900' : 'bg-gray-600'}
  `" :disabled="currentCooldown > 0" @click="launchCryptoScam">
    <div class="flex">
      <CurrencyDollar v-bind:class="`w-6 h-6 mr-3 mt-2 ${currentCooldown ? 'animate-bounce' : ''}`" />
      <span>
        Launch Crypto Scam
        <LoadingBar :value="currentCooldown" :max="LAUNCH_COOLDOWN" />
      </span>
    </div>
  </button>
</template>

<script lang="ts" setup>
import LoadingBar from '~/components/layout/LoadingBar.vue'
import CurrencyDollar from '~/components/icon/CurrencyDollar.vue'

const props = defineProps<{
  launchScam: (value: number) => void
}>()

const LAUNCH_COOLDOWN = 120
const currentCooldown = ref(0)

const launchCryptoScam = () => {
  if (currentCooldown.value > 0) {
    return
  }

  currentCooldown.value = LAUNCH_COOLDOWN

  const cooldownInterval = setInterval(() => {
    currentCooldown.value--

    if (currentCooldown.value === 0) {
      props.launchScam(200)
      clearInterval(cooldownInterval)
    }
  }, 1000)
}

onMounted(launchCryptoScam)
</script>
