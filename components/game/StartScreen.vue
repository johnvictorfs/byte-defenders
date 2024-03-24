<template>
  <div class="flex flex-col items-center justify-center h-full p-12">
    <h1 class="text-4xl font-bold">🖥️ Byte Defenders 🦠</h1>
    <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" @click="startGame">Start Game</button>
  </div>
</template>

<script lang="ts" setup>
const { startGame } = useGameStateStore()
</script>
