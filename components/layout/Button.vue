<template>
  <button v-bind:class="variants[props.variant || 'default']">
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps<{
  variant?: keyof typeof variants
}>()

const variants = {
  default: 'p-2 rounded-md shadow-lg bg-slate-600 border-2 border-slate-500 hover:bg-slate-700 shadow-lg transition-colors',
  primary: 'p-2 rounded-md shadow-lg border-2 border-blue-500 hover:bg-blue-500 shadow-lg hover:bg-blue-800 transition-colors',
} as const
</script>
