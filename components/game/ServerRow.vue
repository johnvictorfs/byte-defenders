<template>
  <div v-for="(server, serverIndex) in serverRow" :key="serverIndex"
    class="flex justify-center p-4 rounded-full bg-slate-700 shadow-lg items-center">
    <div v-if="server.owned" class="animate-pulse">
      ❌
    </div>
    <div v-else>
      <img src="~/assets/Server.png" alt="Server" width="24" height="48">
    </div>
  </div>
</template>

<script lang="ts" setup>
const gameStateStore = useGameStateStore()
const { serverRow } = storeToRefs(gameStateStore)
</script>
