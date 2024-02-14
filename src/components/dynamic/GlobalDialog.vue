<template>
  <div v-if="visible" class="custom-dialog-mask">
    <transition name="custom-dialog-transition">
      <div :class="['custom-dialog', { 'custom-dialog-maximized': maximized }]">
        <div class="flex justify-content-between custom-dialog-header">
          <div class="flex align-items-center gap-2">
            <i v-if="icon" :class="icon"></i>
            <span>{{ title }}</span>
          </div>
          <div>
            <button class="custom-dialog-maximize-btn" @click="toggleMaximized">&#9635;</button>
            <button class="custom-dialog-close-btn" @click="handleClose">&#10005;</button>
          </div>
        </div>
        <div class="custom-dialog-content" :style="{ maxHeight: maximized ? windowHeight : bodyMaxHeight }">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="custom-dialog-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps(['visible', 'title', 'icon']);

const emit = defineEmits(['close']);

const maximized = ref(false);

const handleClose = () => {
  emit('close');
};

const toggleMaximized = () => {
  maximized.value = !maximized.value;
};

const bodyMaxHeight = ref('70vh'); // Adjust the maximum height as needed

const windowHeight = computed(() => `${window.innerHeight}px`);
</script>

<style scoped>
.custom-dialog-mask {
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-dialog {
  width: 600px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-dialog-maximized {
  width: 100vw;
  height: 100vh;
  border-radius: 0;
}

.custom-dialog-header {
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
}

.custom-dialog-close-btn {
  margin-left: auto;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.custom-dialog-maximize-btn {
  margin-right: auto;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.custom-dialog-content {
  padding: 16px;
  overflow-y: auto;
}

.custom-dialog-footer {
  padding: 16px;
  border-top: 1px solid #ccc;
  display: flex;
  justify-content: flex-end;
}

.custom-dialog-transition-enter-active,
.custom-dialog-transition-leave-active {
  transition: opacity 0.3s ease;
}

.custom-dialog-transition-enter,
.custom-dialog-transition-leave-to {
  opacity: 0;
}
</style>
