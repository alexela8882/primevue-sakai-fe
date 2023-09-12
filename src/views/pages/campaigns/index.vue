<script setup>
// --------
// imports
// --------
import { useLayout } from '@/layout/composables/layout'
import { ref, onMounted, onBeforeMount } from 'vue'

// --------
// refs
// --------
const { isDarkTheme } = useLayout()

</script>

<template>
  <div class="flex flex-column gap-3 mb-5 mt-5">
    <div>
      <div class="flex justify-content-between">
        <div class="flex flex-column">
          <span class="text-xl font-bold" :class="`${isDarkTheme ? 'text-surface-50' : 'text-blue-800'}`">Campaign</span>
        </div>

        <div>
          <Button class="reddot-button-primary flex border-round-lg py-2 px-4" size="small">
            <font-awesome-icon icon="fa-solid fa-plus" size="xs" />
            &nbsp;Add Campaign
          </Button>
        </div>
      </div>
    </div>

    <div>
      <Dropdown
        optionLabel="name"
        placeholder="My Teams Campaign"
        size="small"
        showClear
        class="w-full md:w-24rem" />
    </div>

    <div class="grid grid-nogutter">
      <div class="col-12 md:col-9">
        <div class="grid grid-nogutter custom-gutter">
          <div class="col-12 md:col-6">
            <div class="font-bold text-lg text-blue-800 p-3 py-4 surface-overlay border-round-left-md">
              Active Campaign
            </div>

            <div class="grid mt-3">
              <div class="col-12 md:col-10 md:col-offset-1">
                <div v-for="i in 10" class="p-2 surface-overlay border-round box-shadow mb-3">
                  <div class="flex justify-content-around align-items-center gap-2">
                    <div class="align-self-center text-500">
                      <font-awesome-icon icon="fa-solid fa-grip-vertical" style="font-size: 1.5rem; cursor: move;" />
                    </div>
                    <div @click="$router.push(`/campaigns/${i + 1}`)" class="flex flex-column gap-2 col-10" style="cursor: pointer;">
                      <div class="font-bold text-blue-800">Contact sales or service</div>
                      <div class="text-400">Contact sales or service</div>
                      <div class="flex gap-2">
                        <Tag class="px-3" value="Exhibition" rounded></Tag>
                        <Tag class="px-3" severity="success" value="7 July 2023" rounded></Tag>
                        <Tag class="px-3" severity="warning" value="7 July 2023" rounded></Tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 md:col-6">
            <div class="font-bold text-lg text-blue-800 p-3 py-4 surface-overlay border-round-right-md mb-3">
              Non Active Campaign
            </div>

            <div class="grid mt-3">
              <div class="col-12 md:col-10 md:col-offset-1">
                <div v-for="i in 10" class="p-2 surface-overlay border-round box-shadow mb-3">
                  <div class="flex justify-content-around align-items-center gap-2">
                    <div class="align-self-center text-500">
                      <font-awesome-icon icon="fa-solid fa-grip-vertical" style="font-size: 1.5rem; cursor: move;" />
                    </div>
                    <div @click="$router.push(`/campaigns/${i + 1}`)" class="flex flex-column gap-2 col-10" style="cursor: pointer;">
                      <div class="font-bold text-blue-800">Contact sales or service</div>
                      <div class="text-400">Contact sales or service</div>
                      <div class="flex gap-2">
                        <Tag class="px-3" value="Exhibition" rounded></Tag>
                        <Tag class="px-3" severity="success" value="7 July 2023" rounded></Tag>
                        <Tag class="px-3" severity="warning" value="7 July 2023" rounded></Tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.custom-gutter [class*=col] { padding: 1px; }

.box-shadow {
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
}

</style>