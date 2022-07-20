export interface Index {
  id: string;
  name: string;
  categoryName: string;
  title: string;
  endpoints: Endpoint[];
}

export interface Endpoint {
  type: string;
  url: string;
}
