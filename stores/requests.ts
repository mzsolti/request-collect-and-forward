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
    forwardUrl:
      "https://www.server.intranet/work/jobboards/wadhefa.com/dev/request.php",
    requestsKey: 0,
  }),
  actions: {
    async getRequests() {
      const runtimeConfig = useRuntimeConfig();
      const { data, error } = await useAsyncData(
        "requests_" + this.requestsKey,
        async () => {
          return await $fetch<IRequest[]>(runtimeConfig.public.API_ENDPOINT);
        },
      );
      this.requests = data.value;
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
