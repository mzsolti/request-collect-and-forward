<script setup lang="ts">
import Paginator from "primevue/paginator";
import InputText from "primevue/inputtext";
import OverlayPanel from "primevue/overlaypanel";
import Checkbox from "primevue/checkbox";

const store = useRequestsStore();
const toast = useToast();
const query = ref("");
const settings = ref(null);
const processForwardRef = ref(null);
const showSettings = (event) => {
  settings.value.toggle(event);
};
const applySettings = async (event) => {
  settings.value.toggle(event);
  loadRequests();
};
const loadRequests = async () => {
  await store.getRequests();
};
loadRequests();
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
    <template #title-right>
      <div class="flex gap-1">
        <Button
          type="button"
          icon="pi pi-sync"
          severity="info"
          @click="loadRequests"
        />
        <Button
          type="button"
          icon="pi pi-cog"
          label="Settings"
          severity="contrast"
          @click="showSettings"
        />
      </div>
      <OverlayPanel ref="settings" class="w-3/4 md:w-1/2">
        <div>
          <Checkbox
            v-model="store.loadFromExternalRequestLog"
            inputId="oad_from_external_source"
            :binary="true"
            class="me-2"
            value="1"
          />
          <label for="oad_from_external_source"
            >Load from external source</label
          >
        </div>
        <div class="flex gap-3 w-full" v-if="store.loadFromExternalRequestLog">
          <div class="w-full">
            <span class="font-medium text-900 block mb-2"
              >External request log url</span
            >
            <InputText
              v-model="store.externalRequestLog"
              placeholder="External request log url"
              class="w-full"
            />
          </div>
        </div>
        <div class="flex gap-3 w-full mt-2 justify-center">
          <Button
            type="button"
            label="Apply"
            severity="ok"
            @click="applySettings"
          />
        </div>
      </OverlayPanel>
    </template>
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
      v-if="(store?.requests?.length ?? 0) == 0"
    >
    </MainEmptyList>
    <ProcessForward ref="processForwardRef" />
  </MainContent>
</template>
