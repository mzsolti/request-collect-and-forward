export interface IRequest {
  id: number;
  created: string;
  type: string;
  params: string;
  sent: boolean;
}
export interface requestState {
  requests: IRequest[];
  searchRequest: {
    page: number;
    first: number;
    rows: number;
    total: number;
    q: string;
  };
  forwardUrl: string;
  requestsKey: number;
  loadFromExternalRequestLog: boolean;
  externalRequestLog: string;
}
export interface IForwardResponse {
  status: string;
  response: string;
}
