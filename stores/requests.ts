import {
  type IRequest,
  type requestState,
  type IForwardResponse,
} from "~~/types";
export const useRequestsStore = defineStore("requestStore", {
  state: (): requestState => ({
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
    init(): void {
      //initializing settings
      this.forwardUrl = localStorage.getItem("forwardUrl") ?? "";
      this.loadFromExternalRequestLog =
        localStorage.getItem("loadFromExternalRequestLog") == "true"
          ? true
          : false;
      this.externalRequestLog =
        localStorage.getItem("externalRequestLog") ?? "";
    },
    updateChanges(state: requestState): void {
      let localForwardUrl = localStorage.getItem("forwardUrl");
      if (localForwardUrl != state.forwardUrl) {
        localStorage.setItem("forwardUrl", state.forwardUrl);
      }
      let localLoadFromExternalRequestLog = localStorage.getItem(
        "loadFromExternalRequestLog",
      );
      if (
        localLoadFromExternalRequestLog !=
        (state.loadFromExternalRequestLog == true ? "true" : "false")
      ) {
        localStorage.setItem(
          "loadFromExternalRequestLog",
          state.loadFromExternalRequestLog == true ? "true" : "false",
        );
      }
      let localExternalRequestLog = localStorage.getItem("externalRequestLog");
      if (localExternalRequestLog != state.externalRequestLog) {
        localStorage.setItem("externalRequestLog", state.externalRequestLog);
      }
    },
    async getRequests(): Promise<void> {
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
      // this.requests = [this.requests, ...data];
      data.forEach((item) => {
        if (this.requests.find((r) => r.id == item.id) == undefined) {
          this.requests.push(item);
        }
      });
      this.requests = this.requests.sort((a, b) => {
        return a.id < b.id ? 1 : -1;
      });
      this.requestsKey += 1;
    },
    async doForward(l_request: IRequest): Promise<IForwardResponse> {
      const runtimeConfig = useRuntimeConfig();
      let data = await $fetch<IForwardResponse>(
        runtimeConfig.public.API_ENDPOINT,
        {
          method: "POST",
          body: {
            action: "send",
            url: this.forwardUrl,
            irequest: l_request,
          },
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        },
      );
      /*const { data, error } = await useAsyncData(
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
      );*/
      l_request.sent = true;
      return data;
    },
  },
});
