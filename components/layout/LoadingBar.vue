<template>
  <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-400">
    <div v-bind:class="`bg-${props.color || 'blue'}-600 h-2.5 rounded-full transition-all duration-500 ease-in-out`" v-bind:style="`width: ${percentage}%`"></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  value: number,
  max: number,
  /**
   * @default 'blue'
   */
  color?: 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink' | 'gray' | 'black' | 'white'
}>()

const percentage = computed(() => (props.value / props.max) * 100)
</script>
