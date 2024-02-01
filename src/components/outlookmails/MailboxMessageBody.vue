<script setup>

// defines
const props = defineProps({
  message: Object
})

</script>

<template>
  <div>
    <div class="flex align-items-center justify-content-between">
      <div class="flex align-items-center mb-5 gap-2">
        <div>
          <Avatar icon="pi pi-user" class="mr-2" shape="circle" size="xlarge" />
        </div>
        <div>
          <div>
            {{ message.from.emailAddress.name }}
            &lt;{{ message.from.emailAddress.address }}&gt;
          </div>

          <div>
            <div v-for="recipient in message.toRecipients.slice(0, 2)">
              To: {{ recipient.emailAddress.address }}
              <span v-if="message.toRecipients.length > 2">
                and {{ message.toRecipients.length - 2 }} others
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p class="m-0">
      <!-- <pre>{{ message }}</pre> -->
      <div v-html="message.body.content"></div>
    </p>
  </div>
</template>

<style scoped>

</style>