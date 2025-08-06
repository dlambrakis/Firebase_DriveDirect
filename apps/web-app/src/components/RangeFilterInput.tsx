import React from 'react';
import { Input, Label } from '@directdrive/ui';

interface RangeFilterInputProps {
  label: string;
  minValue: number | undefined;
  maxValue: number | undefined;
  onMinChange: (value: number | undefined) => void;
  onMaxChange: (value: number | undefined) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}

export const RangeFilterInput: React.FC<RangeFilterInputProps> = ({
  label,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = 'Min',
  maxPlaceholder = 'Max',
}) => {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder={minPlaceholder}
          value={minValue || ''}
          onChange={e => onMinChange(e.target.value ? Number(e.target.value) : undefined)}
        />
        <Input
          type="number"
          placeholder={maxPlaceholder}
          value={maxValue || ''}
          onChange={e => onMaxChange(e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>
    </div>
  );
};
