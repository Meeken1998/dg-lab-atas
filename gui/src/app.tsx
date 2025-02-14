import { Button, Checkbox, Theme } from '@radix-ui/themes';
import { useState } from 'react';
import { StrengthSettings } from './components/strength-settings';
import { TSettings } from './types';

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
    type: 'solid',
  },
};

const App: React.FC = () => {
  const [tab, setTab] = useState<'info' | 'settings'>('info');
  const [settings, setSettings] = useState<TSettings>(DEFAULT_SETTINGS);

  const handleChange = (v: Partial<TSettings>) => {
    setSettings((prev) => ({ ...prev, ...v }));
  };

  return (
    <Theme appearance="dark" accentColor="yellow">
      <main className="app !flex h-screen w-screen justify-center text-sm text-[#ffe99d] select-none">
        <div className="flex flex-col w-full p-6 max-w-96 rounded-xl">
          <div className="flex justify-between gap-6">
            <img src="dg-lab.png" className="h-16 cursor-pointer shrink-0" draggable={false} onClick={() => setTab(tab === 'info' ? 'settings' : 'info')} />
            <div className="flex flex-col flex-1 gap-1 py-1">
              <div className="text-base font-bold">扛单电击风控已开启！</div>

              <div className="flex gap-6">
                <div className="flex items-center gap-1">
                  <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8.69667 0.0403541C8.90859 0.131038 9.03106 0.354857 8.99316 0.582235L8.0902 6.00001H12.5C12.6893 6.00001 12.8625 6.10701 12.9472 6.27641C13.0319 6.4458 13.0136 6.6485 12.8999 6.80001L6.89997 14.8C6.76167 14.9844 6.51521 15.0503 6.30328 14.9597C6.09135 14.869 5.96888 14.6452 6.00678 14.4178L6.90974 9H2.49999C2.31061 9 2.13748 8.893 2.05278 8.72361C1.96809 8.55422 1.98636 8.35151 2.09999 8.2L8.09997 0.200038C8.23828 0.0156255 8.48474 -0.0503301 8.69667 0.0403541ZM3.49999 8.00001H7.49997C7.64695 8.00001 7.78648 8.06467 7.88148 8.17682C7.97648 8.28896 8.01733 8.43723 7.99317 8.5822L7.33027 12.5596L11.5 7.00001H7.49997C7.353 7.00001 7.21347 6.93534 7.11846 6.8232C7.02346 6.71105 6.98261 6.56279 7.00678 6.41781L7.66968 2.44042L3.49999 8.00001Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <div className="text-3xl font-bold">90</div>
                </div>

                <div className="flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M1.90321 7.29677C1.90321 10.341 4.11041 12.4147 6.58893 12.8439C6.87255 12.893 7.06266 13.1627 7.01355 13.4464C6.96444 13.73 6.69471 13.9201 6.41109 13.871C3.49942 13.3668 0.86084 10.9127 0.86084 7.29677C0.860839 5.76009 1.55996 4.55245 2.37639 3.63377C2.96124 2.97568 3.63034 2.44135 4.16846 2.03202L2.53205 2.03202C2.25591 2.03202 2.03205 1.80816 2.03205 1.53202C2.03205 1.25588 2.25591 1.03202 2.53205 1.03202L5.53205 1.03202C5.80819 1.03202 6.03205 1.25588 6.03205 1.53202L6.03205 4.53202C6.03205 4.80816 5.80819 5.03202 5.53205 5.03202C5.25591 5.03202 5.03205 4.80816 5.03205 4.53202L5.03205 2.68645L5.03054 2.68759L5.03045 2.68766L5.03044 2.68767L5.03043 2.68767C4.45896 3.11868 3.76059 3.64538 3.15554 4.3262C2.44102 5.13021 1.90321 6.10154 1.90321 7.29677ZM13.0109 7.70321C13.0109 4.69115 10.8505 2.6296 8.40384 2.17029C8.12093 2.11718 7.93465 1.84479 7.98776 1.56188C8.04087 1.27898 8.31326 1.0927 8.59616 1.14581C11.4704 1.68541 14.0532 4.12605 14.0532 7.70321C14.0532 9.23988 13.3541 10.4475 12.5377 11.3662C11.9528 12.0243 11.2837 12.5586 10.7456 12.968L12.3821 12.968C12.6582 12.968 12.8821 13.1918 12.8821 13.468C12.8821 13.7441 12.6582 13.968 12.3821 13.968L9.38205 13.968C9.10591 13.968 8.88205 13.7441 8.88205 13.468L8.88205 10.468C8.88205 10.1918 9.10591 9.96796 9.38205 9.96796C9.65819 9.96796 9.88205 10.1918 9.88205 10.468L9.88205 12.3135L9.88362 12.3123C10.4551 11.8813 11.1535 11.3546 11.7585 10.6738C12.4731 9.86976 13.0109 8.89844 13.0109 7.70321Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <div className="text-3xl font-bold">14 次</div>
                </div>
              </div>
            </div>
          </div>

          <div className="my-4 h-[1px] w-full bg-[#333]"></div>

          {tab === 'info' && (
            <div className="flex-1 leading-6 text-white">
              <div>扛单：超过 1000 刀时，强度=50</div>
              <div>连损：2 笔又浮亏时，强度=亏损额×0.5</div>
              <div>停止惩罚：不再浮亏</div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="flex-1 leading-6 text-white">
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

              <div className="flex flex-wrap items-center gap-1 mt-4">
                <span>停止惩罚</span>
              </div>

              <div className="mt-1 flex items-center gap-2 text-xs text-[#ccc]">不再浮亏时，强度设为 0（暂不支持修改）</div>

              <div className="flex justify-end mt-4">
                <Button>保存</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </Theme>
  );
};

export default App;
