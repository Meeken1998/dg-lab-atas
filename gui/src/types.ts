export type TStrength = {
  trigger: number;
  value: number;
  type: 'solid' | 'multiple';
};

export type TSettings = {
  pnlLoss: TStrength;
  stopLoss: TStrength;
  pnlLossEnabled: boolean;
  stopLossEnabled: boolean;
};
