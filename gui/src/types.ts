export const WAVEFORMS = ['信号灯', '呼吸', '潮汐', '连击', '快速按捏', '按捏渐强', '心跳节奏', '压缩', '节奏步伐', '颗粒摩擦', '渐变弹跳', '波浪涟漪', '雨水冲刷', '变速敲击', '挑逗1', '挑逗2'];

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

  pluginTitle: string;
  waveform: string;
  showSummary: boolean;
  enableStopLossCountdown: boolean;
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
  stopLossCount: number;
  nextTimestampAllowedToTrade: number;
};

export type TResponse = TSettingsResponse | TTradeResponse;
