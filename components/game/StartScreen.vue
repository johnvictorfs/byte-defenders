<template>
  <div class="flex flex-col items-center justify-center h-full p-12">
    <h1 class="text-4xl font-bold">🖥️ Byte Defenders 🦠</h1>
    <Button class="mt-4" variant="primary" @click="startGame">Start Game</Button>
  </div>
</template>

<script lang="ts" setup>
import Button from '~/components/layout/Button.vue'

const { startGame } = useGameStateStore()
</script>
