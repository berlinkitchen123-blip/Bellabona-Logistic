
export interface Company {
  id: string;
  name: string;
  address: string;
  deliveryDetails?: string;
  images?: string[]; // Multiple images for delivery location
  contactPerson?: string;
  phoneNumber?: string;
  assignedTour?: string;
}

export interface SOPStep {
  id: number;
  title: string;
  points: string[];
  image?: string;
}

export type AppView = 'dashboard' | 'companies' | 'training' | 'driver-view' | 'settings';
