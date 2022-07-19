export interface Index {
  title: string;
  endpoints: Endpoint[];
}

export interface Endpoint {
  type: string;
  url: string;
}
