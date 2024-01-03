<script setup>
// imports
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
// stores
import { useOutlookMailStore } from '@/stores/outlookmails/index'

// refs
// stores
const outlookMailStore = useOutlookMailStore()
const {
  getProfile,
  getMailFolders,
  getMailFolder,
  getMailFolderMessages
} = storeToRefs(outlookMailStore)
const { fetchProfile, fetchMailFolders } = outlookMailStore

onMounted(() => {
  fetchProfile()
  fetchMailFolders()
})

</script>

<template>
  <div>
    Outlook mail

    {{ getProfile }}
  </div>
</template>

<style scoped>

</style>