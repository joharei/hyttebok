export interface Trip {
  slug: string;
  title: string;
  startDate: string;
  endDate: string;
}

export interface TripWithText extends Trip {
  text: string;
}
