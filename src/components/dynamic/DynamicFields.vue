<script setup>
// imports
import { ref } from 'vue'
// components

// defines
const props = defineProps({
  fields: Array,
  moduleValidationInputs: Object,
  moduleValidationErrors: Object,
  moduleValidationMeta: Object
})
</script>

<template>
  <div>
    <div class="grid">
      <div v-for="(field, fx) in fields" :key="fx" class="md:col-6">
        <div v-if="field.type === 'text'">
          <span class="p-float-label">
            <InputText
              v-bind="moduleValidationInputs[field.name]"
              @update:modelValue="$emit('validate-sync-func')"
              class="w-full"
              :class="`${field.rules.required && 'border-left-3'} ${moduleValidationErrors[field.name] && 'border-red-600'}`"
            />
            <label>{{ field.label }}</label>
          </span>
          <small v-if="moduleValidationErrors[field.name]" class="text-red-600">
            {{ moduleValidationErrors[field.name] }}
          </small>
        </div>
        <div v-if="field.type === 'date'">
          <span class="p-float-label">
            <Calendar
              v-bind="moduleValidationInputs[field.name]"
              @update:modelValue="$emit('validate-sync-func')"
              class="w-full"
              :pt="{ input: { class: `${field.rules.required && 'border-left-3'} ${moduleValidationErrors[field.name] && 'border-red-600'}` } }"
            />
            <label>{{ field.label }}</label>
          </span>
          <small v-if="moduleValidationErrors[field.name]" class="text-red-600">
            {{ moduleValidationErrors[field.name] }}
          </small>
        </div>
        <div v-if="field.type === 'time'">
          <span class="p-float-label">
            <Calendar
              v-bind="moduleValidationInputs[field.name]"
              @update:modelValue="$emit('validate-sync-func')"
              timeOnly
              class="w-full"
              :pt="{ input: { class: `${field.rules.required && 'border-left-3'} ${moduleValidationErrors[field.name] && 'border-red-600'}` } }"
            />
            <label>{{ field.label }}</label>
          </span>
          <small v-if="moduleValidationErrors[field.name]" class="text-red-600">
            {{ moduleValidationErrors[field.name] }}
          </small>
        </div>
        <div v-if="field.type === 'picklist'">
          <span class="p-float-label">
            <Dropdown
              v-bind="moduleValidationInputs[field.name]"
              @update:modelValue="$emit('validate-sync-func')"
              :options="field.items"
              optionLabel="label"
              optionValue="name"
              :placeholder="field.label"
              class="w-full"
              :class="`${field.rules.required && 'border-left-3'} ${moduleValidationErrors[field.name] && 'border-red-600'}`" />
            <label>{{ field.label }}</label>
          </span>
          <small v-if="moduleValidationErrors[field.name]" class="text-red-600">
            {{ moduleValidationErrors[field.name] }}
          </small>
        </div>
        <div v-if="field.type === 'related'">
          <span class="p-float-label">
            <Dropdown
              v-bind="moduleValidationInputs[field.name]"
              @update:modelValue="$emit('validate-sync-func')"
              :options="field.items"
              optionLabel="label"
              optionValue="name"
              :placeholder="field.label"
              class="w-full"
              :class="`${field.rules.required && 'border-left-3'} ${moduleValidationErrors[field.name] && 'border-red-600'}`" />
            <label>{{ field.label }}</label>
          </span>
          <small v-if="moduleValidationErrors[field.name]" class="text-red-600">
            {{ moduleValidationErrors[field.name] }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>