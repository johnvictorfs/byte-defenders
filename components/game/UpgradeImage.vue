<template>
  <img v-if="images[props.upgrade.name]" width="24" height="24" :src="images[props.upgrade.name]"
    :alt="props.upgrade.name" class="inline" />
  <span v-else>
    {{ props.upgrade.emoji }}
  </span>
</template>

<script lang="ts" setup>
import type { Upgrade } from '~/stores/game'

import { filename } from 'pathe/utils'

const imageGlobs = import.meta.glob('~/assets/powerups/*.png', { eager: true })
const images = Object.fromEntries(
  Object.entries(imageGlobs).map(([key, value]) => [filename(key), (value as any).default])
)

const props = defineProps<{
  upgrade: Upgrade
}>()
</script>
