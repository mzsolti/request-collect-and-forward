import { IRequest } from "~~/types";
export const useRequestsStore = defineStore("requestStore", {
  state: () => ({
    requests: [] as IRequest[],
    searchRequest: {
      page: 1,
      first: 0,
      rows: 20,
      total: 0,
      q: "",
    },
    forwardUrl: "",
    requestsKey: 0,
    loadFromExternalRequestLog: false,
    externalRequestLog: "",
  }),
  actions: {
    async getRequests() {
      const runtimeConfig = useRuntimeConfig();
      let data = await $fetch<IRequest[]>(runtimeConfig.public.API_ENDPOINT, {
        method: "POST",
        body: {
          loadFromExternalRequestLog: this.loadFromExternalRequestLog,
          externalRequestLog: this.externalRequestLog,
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
      });
      this.requests = data;
      this.requestsKey += 1;
    },
    async doForward(l_request: IRequest) {
      console.log(this.forwardUrl, l_request);
      const runtimeConfig = useRuntimeConfig();
      const { data, error } = await useAsyncData(
        "requests_" + this.requestsKey,
        async () => {
          return await $fetch(runtimeConfig.public.API_ENDPOINT, {
            method: "POST",
            body: {
              action: "send",
              url: this.forwardUrl,
              irequest: l_request,
            },
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          });
        },
      );
      return data.value;
    },
  },
});
