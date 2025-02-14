import { Select, TextField } from '@radix-ui/themes';
import { TStrength } from '../types';

interface Props {
  unit: string;
  value: TStrength;
  onChange: (value: TStrength) => void;
}

export const StrengthSettings: React.FC<Props> = ({ unit, value, onChange }) => {
  const handleChange = (v: Partial<TStrength>) => {
    onChange({ ...value, ...v });
  };

  return (
    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#ccc]">
      <span>超过</span>
      <TextField.Root size="1" type="number" className="w-16" value={value.trigger} onChange={(e) => handleChange({ trigger: Number(e.target.value) })} />
      <span>{unit}时，强度为</span>
      <Select.Root size="1" value={value.type} onValueChange={(v) => handleChange({ type: v as TStrength['type'] })}>
        <Select.Trigger />
        <Select.Content>
          <Select.Item value="fixed">固定值</Select.Item>
          <Select.Item value="multiple">亏损额×</Select.Item>
        </Select.Content>
      </Select.Root>
      <TextField.Root size="1" type="number" className="w-16" value={value.value} onChange={(e) => handleChange({ value: Number(e.target.value) })} />
    </div>
  );
};
