export interface IPatient {
  _id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  address: string;
  contactNumber: string;
  lastVisit: string; // ISO Date string
}

