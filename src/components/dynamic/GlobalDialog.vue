<template>
  <div v-if="visible" class="custom-dialog-mask">
    <transition name="custom-dialog-transition">
      <div :class="['custom-dialog', { 'custom-dialog-maximized': maximized }]"
           ref="dialog"
           :style="{ top: dialogTop + 'px', left: dialogLeft + 'px' }">
        <div class="flex justify-content-between custom-dialog-header"
             ref="header"
             @mousedown="startDragging"
             @mouseup="stopDragging"
             @mousemove="handleDragging">
          <div class="global-dialog-header flex align-items-center gap-2">
            <!-- <i v-if="icon" :class="icon"></i>
            <span>{{ title }}</span> -->
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

const windowHeight = computed(() => `90vh`);

const dialog = ref(null);
const header = ref(null);
const dragging = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);
const dialogTop = ref(0);
const dialogLeft = ref(0);

const startDragging = (event) => {
  dragging.value = true;
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
  const rect = dialog.value.getBoundingClientRect();
  dialogTop.value = rect.top;
  dialogLeft.value = rect.left;
};

const stopDragging = () => {
  dragging.value = false;
};

const handleDragging = (event) => {
  if (dragging.value) {
    const deltaX = event.clientX - mouseX.value;
    const deltaY = event.clientY - mouseY.value;
    dialogLeft.value += deltaX;
    dialogTop.value += deltaY;
    mouseX.value = event.clientX;
    mouseY.value = event.clientY;
  }
};
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
  overflow-y: scroll;
}

.custom-dialog-header {
  padding: 8px;
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
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.custom-dialog-footer {
  padding: 0;
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
