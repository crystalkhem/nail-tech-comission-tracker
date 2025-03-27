export type ServiceEntry = {
    id: string;
    date: string; // ISO string
    clientName: string;
    service: string;
    price: number;
    tip: number;
    commissionRate: number; // As a decimal (e.g., 0.4 for 40%)
  };
  