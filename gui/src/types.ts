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
  stopLossRestMinutes: number;
};

export type TGetSettingsMessage = {
  type: 'get_settings';
};

export type TSetSettingsMessage = {
  type: 'set_settings';
  data: TSettings;
};

export type TSettingsResponse = {
  type: 'settings';
  data: TSettings;
};

export type TTradeResponse = {
  type: 'trade';
  data: number;
  time: string;
  security: string;
  volume: number;
  punishmentCount: number;
};

export type TResponse = TSettingsResponse | TTradeResponse;