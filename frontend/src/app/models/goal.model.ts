export interface Goal {
  id: number;
  name: string;
  //Change current age to DOB later for more accurate client info over time
  currentAge: number;
  targetAmount: number;
  targetAge: number;
  currentSavings: number;
  monthlyContribution: number;
}
