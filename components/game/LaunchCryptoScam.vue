<template>
  <button v-bind:class="`
    px-4 py-2 pb-4 rounded-lg shadow-lg inline-flex items-center border-2 border-orange-700 transition-colors
    ${!cryptoScamCooldown ? 'hover:bg-orange-900' : 'cursor-not-allowed'}
    ${!cryptoScamCooldown ? 'bg-orange-800' : 'bg-gray-600'}
  `" :disabled="cryptoScamCooldown > 0" @click="gameStateStore.launchCryptoScam">
    <div class="flex">
      <CurrencyDollar v-bind:class="`w-6 h-6 mr-3 mt-2 ${cryptoScamCooldown ? 'animate-bounce' : ''}`" />
      <span>
        Launch Crypto Scam
        <LoadingBar :value="cryptoScamCooldown" :max="maxCryptoScamCooldown" />
      </span>
    </div>
  </button>
</template>

<script lang="ts" setup>
import LoadingBar from '~/components/layout/LoadingBar.vue'
import CurrencyDollar from '~/components/icon/CurrencyDollar.vue'

const gameStateStore = useGameStateStore()
const { cryptoScamCooldown, maxCryptoScamCooldown } = storeToRefs(gameStateStore)
</script>
