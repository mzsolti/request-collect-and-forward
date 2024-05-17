<script setup lang="ts">
import Paginator from "primevue/paginator";
import InputText from "primevue/inputtext";
const store = useRequestsStore();
const toast = useToast();
const query = ref("");
const processForwardRef = ref(null);

await store.getRequests();
const filterEvent = async (event, type) => {
  if (type == "page") {
    store.searchRequest.page = event.page + 1;
    store.searchRequest.rows = event.rows;
  }
  await store.getRequests();
};
</script>
<template>
  <MainContent title="Requests">
    <template #title-right> </template>
    <div
      class="card flex flex-wrap items-center justify-center bg-white w-full p-2 mb-3"
    >
      <InputText
        v-model="store.forwardUrl"
        placeholder="Forward url"
        class="w-full"
      />
    </div>
    <div
      v-for="request in store.requests"
      :key="request.id"
      class="flex flex-nowrap gap-2 border rounded border-gray-300 mb-1 items-center"
    >
      <div class="w-1/6 md:w-1/12 p-1 text-sm">
        {{ request.created }}
      </div>
      <div class="w-1/6 md:w-1/12 p-1">
        {{ request.type }}
      </div>
      <div class="w-3/6 md:w-9/12 p-1">
        <div class="flex flex-wrap break-all">{{ request.params }}</div>
      </div>
      <div class="w-1/6 md:w-1/12 p-1 text-end">
        <Button
          severity="info"
          label="Forward request"
          @click.prevent="
            () => {
              processForwardRef.openDialog(request);
            }
          "
        />
      </div>
    </div>
    <Paginator
      :first="store.searchRequest.first"
      :rows="store.searchRequest.rows"
      :totalRecords="store.searchRequest.total"
      @page="filterEvent($event, 'page')"
      :alwaysShow="false"
      class="p-small fs-8 d-flex justify-content-center"
      template="PrevPageLink PageLinks NextPageLink"
    ></Paginator>
    <MainEmptyList
      emptyText="No request found"
      v-if="store.requests.length == 0"
    >
    </MainEmptyList>
    <ProcessForward ref="processForwardRef" />
  </MainContent>
</template>
