<template>
  <div class="flex space-x-2 items-center">
    <UTooltip :text="$t('switchMode', { mode: $t(`${nextMode}Mode`) })">
      <UButton
        @click="toggleMode"
        :label="nextModeIcon"
        color="gray"
        variant="ghost"
        class="hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 text-gray-500 text-2xl"
      />
    </UTooltip>
  </div>
</template>

<script setup>
const colorMode = useColorMode()

// 日間 / 夜間模式
const modes = ['light', 'dark']

// 模式圖標
const nextModeIcons = {
  light: '🌞',
  dark: '🌜'
}

/**
 * 下個模式
 * @returns {String}
 */
const nextMode = computed(() => {
  const currentModeIndex = modes.indexOf(colorMode.preference)
  let nextModeIndex = null
  if (currentModeIndex + 1 === modes.length) {
    nextModeIndex = 0
  } else {
    nextModeIndex = currentModeIndex + 1
  }

  return modes[nextModeIndex]
})

/**
 * 下個模式圖標
 * @returns {String}
 */
const nextModeIcon = computed(() => nextModeIcons[nextMode.value])

/**
 * 切換模式
 */
const toggleMode = () => (colorMode.preference = nextMode.value)
</script>
