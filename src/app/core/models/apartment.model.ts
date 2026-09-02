export interface Comment {
  id: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Apartment {
  id: string;
  title: string;
  description: string;
  buildingType: string;
  propertyName: string;
  isShared: boolean;
  address: string;
  squareFeet: number;
  leaseType: 'long-term' | 'short-term' | 'both';
  rent: number;
  isNegotiable: boolean;
  priceMode: 'per-month' | 'utilities-included';
  isFurnished: boolean;
  amenities: string[];
  photos: string[];
  isFeatured?: boolean;
  isFavorite?: boolean;
  comments: Comment[];
  contactEmail: string;
}