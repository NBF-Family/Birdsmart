export const Sex = {
  MALE: "male",
  FEMALE: "female",
  UNKNOWN: "unknown"
} as const;

export const Production = {
  SELF_PRODUCED: "self_produced",
  PURCHASED: "purchased",
  RESCUED: "rescued",
  OTHER: "other"
} as const;

export const Status = {
  ACTIVE: "active",
  SOLD: "sold",
  PENDING: "pending",
  INACTIVE: "inactive"
} as const;

export type Sex = typeof Sex[keyof typeof Sex];
export type Production = typeof Production[keyof typeof Production];
export type Status = typeof Status[keyof typeof Status];

export interface Location {
  coords: number[];
  city: string;
  country: string;
  state: string;
}

export interface HealthInfo {
  vetChecked: boolean;
  notes?: string;
}

export interface ListingOut {
  id: string;
  sellerId: string;
  title: string;
  traits: string[];
  sex: Sex;
  production: Production;
  birth: number;
  description: string;
  species: string;
  priceUSD: number;
  photos: string[];
  healthInfo: HealthInfo;
  location: Location;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface ListingCreate {
  sellerId: string;
  title: string;
  traits: string[];
  sex: Sex;
  production: Production;
  birth: number;
  description: string;
  species: string;
  priceUSD: number;
  photos: string[];
  healthInfo: HealthInfo;
  location: Location;
  status?: Status;
}
