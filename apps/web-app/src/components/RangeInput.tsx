import React from 'react';
import { Input, Label } from '@directdrive/ui';

interface RangeInputProps {
  label: string;
  min: number | undefined;
  max: number | undefined;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

export const RangeInput: React.FC<RangeInputProps> = ({
  label,
  min,
  max,
  onMinChange,
  onMaxChange,
  minPlaceholder = 'Min',
  maxPlaceholder = 'Max',
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onMinChange(val === '' ? undefined : Number(val));
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onMaxChange(val === '' ? undefined : Number(val));
  };

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={min ?? ''}
          onChange={handleMinChange}
          placeholder={minPlaceholder}
        />
        <span className="text-gray-500">-</span>
        <Input
          type="number"
          value={max ?? ''}
          onChange={handleMaxChange}
          placeholder={maxPlaceholder}
        />
      </div>
    </div>
  );
};
