export interface Trip {
  slug: string;
  title: string;
  startDate: Date;
  endDate: Date;
}

export interface TripDetails extends Trip {
  text: string;
}
