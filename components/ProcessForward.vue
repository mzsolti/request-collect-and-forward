<script setup lang="ts">
import { ref } from "vue";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import { type IRequest } from "~~/types";
const store = useRequestsStore();
const httpRequest = ref<IRequest>();
const showDialog = ref(false);
const emit = defineEmits(["on-close-dialog"]);
const closeDialog = (success: boolean) => {
  showDialog.value = false;
  emit("on-close-dialog", success);
};
const sent = ref(false);
const httpResponse = ref({ status: "", response: "" });
const openDialog = async (l_request: IRequest) => {
  showDialog.value = true;
  httpRequest.value = l_request;
  sent.value = false;
  httpResponse.value = { status: "", response: "" };
};
const sendRequest = async () => {
  if (httpRequest.value != undefined) {
    httpResponse.value = await store.doForward(httpRequest.value);
    sent.value = true;
  }
};
defineExpose({
  openDialog,
});
</script>
<template>
  <Dialog
    :visible="showDialog"
    modal
    header="Send Request"
    :style="{ width: '75vw' }"
    @update:visible="closeDialog(false)"
  >
    <div v-if="sent">
      <table class="table-auto w-full">
        <tbody>
          <tr>
            <td class="font-bold align-top">Status :</td>
            <td class="px-2">{{ httpResponse?.status }}</td>
          </tr>
          <tr>
            <td class="font-bold text-nowrap align-top">Response body :</td>
            <td class="px-2 break-all">
              <div v-html="httpResponse?.response"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <table class="table-auto w-full">
        <tbody>
          <tr>
            <td class="font-bold align-top">Created :</td>
            <td class="px-2">{{ httpRequest?.created }}</td>
          </tr>
          <tr>
            <td class="font-bold align-top">Request type :</td>
            <td class="px-2">{{ httpRequest?.type }}</td>
          </tr>
          <tr>
            <td class="font-bold text-nowrap align-top">Request params :</td>
            <td class="px-2 break-all">{{ httpRequest?.params }}</td>
          </tr>
        </tbody>
      </table>
      <div class="p-2 text-center">
        <Button
          type="button"
          severity="ok"
          label="Send Request"
          class="p-1"
          @click.prevent="sendRequest"
        />
      </div>
    </div>
  </Dialog>
</template>
