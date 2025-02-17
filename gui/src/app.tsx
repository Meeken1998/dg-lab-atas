import { Button, Checkbox, Select, TextField, Theme } from '@radix-ui/themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StrengthSettings } from './components/strength-settings';
import { TGetSettingsMessage, TResponse, TSetSettingsMessage, TSettings, TTradeResponse, WAVEFORMS } from './types';

const DEFAULT_SETTINGS: TSettings = {
  pnlLossEnabled: true,
  pnlLoss: {
    trigger: 0,
    value: 1,
    type: 'multiple',
  },
  stopLossEnabled: true,
  stopLoss: {
    trigger: 2,
    value: 50,
    type: 'fixed',
  },
  stopLossRestMinutes: 5,
  waveform: '信号灯',
  pluginTitle: '风控启动，扛单要小心！',
  showSummary: true,
  enableStopLossCountdown: true,
};

const App: React.FC = () => {
  const [tab, setTab] = useState<'info' | 'settings'>('info');
  const [settings, setSettings] = useState<TSettings>(DEFAULT_SETTINGS);
  const wsRef = useRef<WebSocket>(null);
  const [connected, setConnected] = useState(false);
  const [tradeInfo, setTradeInfo] = useState<TTradeResponse | null>(null);
  const [animate, setAnimate] = useState<'+' | '-' | null>(null);
  const timerRef = useRef<number>(undefined);
  const lastStrengthRef = useRef<number>(0);
  const [countdown, setCountdown] = useState<string | null>(null);

  const countdownFn = useCallback(() => {
    if (!tradeInfo?.nextTimestampAllowedToTrade || !settings.enableStopLossCountdown) return;
    const now = Date.now();
    const nextTimestampAllowedToTrade = tradeInfo.nextTimestampAllowedToTrade * 1000; // python timestamp

    if (now < nextTimestampAllowedToTrade) {
      const diffMinutes = Math.floor((nextTimestampAllowedToTrade - now) / 1000 / 60);
      const diffSeconds = Math.floor(((nextTimestampAllowedToTrade - now) / 1000) % 60);
      const cd = `${diffMinutes < 10 ? '0' : ''}${diffMinutes}:${diffSeconds < 10 ? '0' : ''}${diffSeconds}`;
      if (cd !== '00:00') {
        setCountdown(cd);
      } else {
        setCountdown(null);
      }
    } else {
      setCountdown(null);
    }
    setTimeout(() => {
      countdownFn();
    }, 1000);
  }, [tradeInfo, settings.enableStopLossCountdown]);

  useEffect(() => {
    countdownFn();
  }, [tradeInfo, countdownFn]);

  const handleChange = (v: Partial<TSettings>) => {
    setSettings((prev) => ({ ...prev, ...v }));
  };

  const handleSubmitSettings = () => {
    const message: TSetSettingsMessage = { type: 'set_settings', data: settings };
    wsRef.current?.send(JSON.stringify(message));
  };

  const showAnimate = (type: '+' | '-') => {
    setAnimate(type);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAnimate(null), 800);
  };

  const initWebSocket = () => {
    const ws = new WebSocket('http://localhost:5679/ws');

    ws.onopen = () => {
      console.log('WebSocket connected');
      wsRef.current = ws;
      const message: TGetSettingsMessage = { type: 'get_settings' };
      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (e) => {
      try {
        const res = JSON.parse(e.data) as TResponse;
        console.log(res);
        if (res.type === 'settings') {
          setSettings(res.data);
          setConnected(true);
        } else if (res.type === 'trade') {
          if (lastStrengthRef.current < res.data) {
            showAnimate('+');
          } else if (lastStrengthRef.current > res.data) {
            showAnimate('-');
          }
          lastStrengthRef.current = res.data;
          setTradeInfo(res);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error, try to reconnect after 3 seconds...', error);
      // 3 秒后重试连接
      setTimeout(() => {
        wsRef.current = new WebSocket('ws://localhost:5679');
        initWebSocket();
      }, 3000);
    };

    wsRef.current = ws;
  };

  useEffect(() => {
    initWebSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Theme appearance="dark" accentColor="yellow">
      <main className="app !flex min-h-screen w-screen justify-center bg-gradient-to-b from-[rgb(30,41,59)] to-[#111] text-sm text-[#ffe99d] select-none">
        <div className="flex flex-col w-full p-8 max-w-120 rounded-xl">
          <div className="mb-4 text-4xl font-bold">{connected ? settings.pluginTitle || DEFAULT_SETTINGS.pluginTitle : '等待连接中...'}</div>

          <div className="flex justify-between gap-6">
            <img src="dg-lab.png" className="cursor-pointer h-14 shrink-0" draggable={false} onClick={() => setTab(tab === 'info' ? 'settings' : 'info')} />
            <div className="flex flex-col flex-1 gap-1 py-1">
              <div className="flex gap-3">
                <div className="flex items-center gap-1">
                  <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.69667 0.0403541C8.90859 0.131038 9.03106 0.354857 8.99316 0.582235L8.0902 6.00001H12.5C12.6893 6.00001 12.8625 6.10701 12.9472 6.27641C13.0319 6.4458 13.0136 6.6485 12.8999 6.80001L6.89997 14.8C6.76167 14.9844 6.51521 15.0503 6.30328 14.9597C6.09135 14.869 5.96888 14.6452 6.00678 14.4178L6.90974 9H2.49999C2.31061 9 2.13748 8.893 2.05278 8.72361C1.96809 8.55422 1.98636 8.35151 2.09999 8.2L8.09997 0.200038C8.23828 0.0156255 8.48474 -0.0503301 8.69667 0.0403541ZM3.49999 8.00001H7.49997C7.64695 8.00001 7.78648 8.06467 7.88148 8.17682C7.97648 8.28896 8.01733 8.43723 7.99317 8.5822L7.33027 12.5596L11.5 7.00001H7.49997C7.353 7.00001 7.21347 6.93534 7.11846 6.8232C7.02346 6.71105 6.98261 6.56279 7.00678 6.41781L7.66968 2.44042L3.49999 8.00001Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <div className="flex items-center w-20 gap-2 text-5xl font-bold">
                    <span>{Math.round(tradeInfo?.data ?? 0)}</span>

                    {animate === '+' && (
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M7.5 1C7.66148 1 7.81301 1.07798 7.90687 1.20938L12.9069 8.20938C13.0157 8.36179 13.0303 8.56226 12.9446 8.72879C12.8589 8.89533 12.6873 9 12.5 9H10V11.5C10 11.7761 9.77614 12 9.5 12H5.5C5.22386 12 5 11.7761 5 11.5V9H2.5C2.31271 9 2.14112 8.89533 2.05542 8.72879C1.96972 8.56226 1.98427 8.36179 2.09314 8.20938L7.09314 1.20938C7.18699 1.07798 7.33853 1 7.5 1ZM3.4716 8H5.5C5.77614 8 6 8.22386 6 8.5V11H9V8.5C9 8.22386 9.22386 8 9.5 8H11.5284L7.5 2.36023L3.4716 8Z"
                          fill="#f2385a"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    )}

                    {animate === '-' && (
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M5 3.5C5 3.22386 5.22386 3 5.5 3H9.5C9.77614 3 10 3.22386 10 3.5V6H12.5C12.6873 6 12.8589 6.10467 12.9446 6.27121C13.0303 6.43774 13.0157 6.63821 12.9069 6.79062L7.90687 13.7906C7.81301 13.922 7.66148 14 7.5 14C7.33853 14 7.18699 13.922 7.09314 13.7906L2.09314 6.79062C1.98427 6.63821 1.96972 6.43774 2.05542 6.27121C2.14112 6.10467 2.31271 6 2.5 6H5V3.5ZM6 4V6.5C6 6.77614 5.77614 7 5.5 7H3.4716L7.5 12.6398L11.5284 7H9.5C9.22386 7 9 6.77614 9 6.5V4H6Z"
                          fill="#0b8542"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {countdown ? (
                    <>
                      <svg width="32" height="32" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M7.49998 0.849976C7.22383 0.849976 6.99998 1.07383 6.99998 1.34998V3.52234C6.99998 3.79848 7.22383 4.02234 7.49998 4.02234C7.77612 4.02234 7.99998 3.79848 7.99998 3.52234V1.8718C10.8862 2.12488 13.15 4.54806 13.15 7.49998C13.15 10.6204 10.6204 13.15 7.49998 13.15C4.37957 13.15 1.84998 10.6204 1.84998 7.49998C1.84998 6.10612 2.35407 4.83128 3.19049 3.8459C3.36919 3.63538 3.34339 3.31985 3.13286 3.14115C2.92234 2.96245 2.60681 2.98825 2.42811 3.19877C1.44405 4.35808 0.849976 5.86029 0.849976 7.49998C0.849976 11.1727 3.82728 14.15 7.49998 14.15C11.1727 14.15 14.15 11.1727 14.15 7.49998C14.15 3.82728 11.1727 0.849976 7.49998 0.849976ZM6.74049 8.08072L4.22363 4.57237C4.15231 4.47295 4.16346 4.33652 4.24998 4.25C4.33649 4.16348 4.47293 4.15233 4.57234 4.22365L8.08069 6.74051C8.56227 7.08599 8.61906 7.78091 8.19998 8.2C7.78089 8.61909 7.08597 8.56229 6.74049 8.08072Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>

                      <div className="text-5xl font-bold">{countdown}</div>
                    </>
                  ) : (
                    <>
                      <svg width="32" height="32" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z"
                          fill="currentColor"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <div className="flex items-center gap-2 text-5xl font-bold">{Math.floor(tradeInfo?.punishmentCount ?? 0)} <span className="text-4xl font-blold">次</span></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="my-4 h-[1px] w-full bg-[#333]"></div>

          {tab === 'info' && (
            <div className="flex-1 text-xl font-bold leading-10 text-white">
              <div>
                扛单：亏损超 <span className="text-[#ffe99d]">{settings.pnlLoss.trigger}</span> 刀时，强度=
                <span className="text-[#ffe99d]">{settings.pnlLoss.type === 'fixed' ? settings.pnlLoss.value : '亏损额×' + settings.pnlLoss.value}</span>
              </div>
              <div>
                连损：连损 <span className="text-[#ffe99d]">{settings.stopLoss.trigger}</span> 笔后浮亏，强度=
                <span className="text-[#ffe99d]">{settings.stopLoss.type === 'fixed' ? settings.stopLoss.value : '亏损额×' + settings.stopLoss.value}</span>
              </div>
              <div>停止惩罚：空仓或不再浮亏</div>
              <div>电脉冲道具，贴片贴在手臂，安全娱乐直播</div>
              {settings.showSummary && (
                <div>
                  已累计被电 <span className="text-[#ffe99d]">{tradeInfo?.punishmentCount ?? 0}</span> 次，当前连损 <span className="text-[#ffe99d]">{tradeInfo?.stopLossCount ?? 0}</span> 笔
                  {countdown ? '，强制停手' : null}
                </div>
              )}
            </div>
          )}

          {tab === 'settings' && (
            <div className="flex-1 leading-6 text-white">
              <h2 className="mb-4 text-base font-bold text-[#ffe99d]">风控规则</h2>

              <div className="flex items-center gap-2">
                <Checkbox checked={settings.pnlLossEnabled} onCheckedChange={(v) => handleChange({ pnlLossEnabled: v as boolean })} />
                <div className="flex flex-wrap items-center gap-1">
                  <span>扛单检测</span>
                </div>
              </div>

              <StrengthSettings unit="刀" value={settings.pnlLoss} onChange={(v) => handleChange({ pnlLoss: v })} />

              <div className="flex items-center gap-2 mt-4">
                <Checkbox checked={settings.stopLossEnabled} onCheckedChange={(v) => handleChange({ stopLossEnabled: v as boolean })} />
                <div className="flex flex-wrap items-center gap-1">
                  <span>连损检测</span>
                </div>
              </div>

              <StrengthSettings unit="笔" value={settings.stopLoss} onChange={(v) => handleChange({ stopLoss: v })} />
              <div className="mt-2 flex items-center gap-2 text-xs text-[#ccc]">
                <span>强制停手时间</span>
                <TextField.Root size="1" type="number" className="w-16" value={settings.stopLossRestMinutes} onChange={(e) => handleChange({ stopLossRestMinutes: Number(e.target.value) })} />
                <span>分钟</span>
              </div>

              <div className="flex flex-wrap items-center gap-1 mt-4">
                <span>停止惩罚</span>
              </div>

              <div className="mt-1 flex items-center gap-2 text-xs text-[#ccc]">空仓或不再浮亏时，强度设为 0（暂不支持修改）</div>

              <h2 className="mt-6 mb-4 text-base font-bold text-[#ffe99d]">互动设置</h2>

              <div className="flex gap-2 mt-4">
                <span className="shrink-0">插件标题</span>
                <TextField.Root size="1" className="flex-1" value={settings.pluginTitle} onChange={(e) => handleChange({ pluginTitle: e.target.value })} placeholder={DEFAULT_SETTINGS.pluginTitle} />
              </div>

              <div className="flex gap-2 mt-4">
                <span className="shrink-0">电击波形</span>
                <div className="flex-1">
                  <Select.Root size="1" value={settings.waveform} onValueChange={(v) => handleChange({ waveform: v })}>
                    <Select.Trigger />
                    <Select.Content>
                      {WAVEFORMS.map((v) => {
                        return (
                          <Select.Item value={v} key={v}>
                            {v}
                          </Select.Item>
                        );
                      })}
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <span className="shrink-0">被电统计</span>
                <Checkbox checked={settings.showSummary} onCheckedChange={(v) => handleChange({ showSummary: v as boolean })} />
                <span className="text-xs text-[#ccc]">展示：已累计被电 x 次，当前连损 y 笔</span>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <span className="shrink-0">停手计时</span>
                <Checkbox checked={settings.enableStopLossCountdown} onCheckedChange={(v) => handleChange({ enableStopLossCountdown: v as boolean })} />
                <span className="text-xs text-[#ccc]">展示</span>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button onClick={() => setTab('info')} variant="soft" color="gray">
                  返回
                </Button>
                <Button onClick={handleSubmitSettings}>保存</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </Theme>
  );
};

export default App;
