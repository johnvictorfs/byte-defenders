<template>
  <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-400">
    <div v-bind:class="`${backgroundClassName} h-2.5 rounded-full transition-all duration-500 ease-in-out`" v-bind:style="`width: ${percentage}%`"></div>
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

const backgroundClassName = computed(() => {
  switch (props.color) {
    case 'red':
      return 'bg-red-600'
    case 'yellow':
      return 'bg-yellow-600'
    case 'green':
      return 'bg-green-600'
    case 'blue':
      return 'bg-blue-600'
    case 'indigo':
      return 'bg-indigo-600'
    case 'purple':
      return 'bg-purple-600'
    case 'pink':
      return 'bg-pink-600'
    case 'gray':
      return 'bg-gray-600'
    case 'black':
      return 'bg-black'
    case 'white':
      return 'bg-white'
    default:
      return 'bg-blue-600'
  }
})
</script>
