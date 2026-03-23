export interface IspPlan {
  id: string;
  name: string;
  description?: string;
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
}

export interface LeadStatus {
  id: string;
  name: string;
  color?: string;
  order?: number;
}
