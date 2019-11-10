export interface ITrip {
  slug: string
  title: string;
  startDate: string;
  endDate: string;
}

export interface ITripWithText extends ITrip {
  text: string;
}