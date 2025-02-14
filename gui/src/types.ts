export type TStrength = {
  trigger: number;
  value: number;
  type: 'fixed' | 'multiple';
};

export type TSettings = {
  pnlLoss: TStrength;
  stopLoss: TStrength;
  pnlLossEnabled: boolean;
  stopLossEnabled: boolean;
};
