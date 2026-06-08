import { FieldNameType, RuleType } from '../types/RuleTypes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from './ui/button';
import {
  DEFAULT_FIELD_VALUES,
  FIELD_NAMES,
  FIELDNAME_LABELS,
  OPERATION_LABELS,
  OPERATION_MAP,
} from '@/lib/constants';
import ValueWidget from './ValueWidget';
import { useEffect, useState } from 'react';
import { validate } from '@/lib/utils';

type RulePropsType = {
  rule: RuleType;
  onChange: (updated: RuleType) => void;
  onDelete: () => void;
  submitted: boolean;
};

const Rule = ({ rule, onChange, onDelete, submitted }: RulePropsType) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (submitted) setError(validate(rule));
  }, [submitted, rule]);

  const handleFieldNameChange = (value: FieldNameType): void => {
    onChange({
      ...rule,
      fieldName: value,
      operation: 'EQUAL',
      value: DEFAULT_FIELD_VALUES[value],
    } as RuleType);
  };

  const handleOperationChange = (value: string): void => {
    onChange({
      ...rule,
      operation: value,
    } as RuleType);
  };

  const { fieldName, operation } = rule;

  return (
    <div className='flex flex-col'>
      <div className='flex flex-wrap lg:flex-nowrap items-center gap-2 rounded-md border bg-background px-3 py-2'>
        <Select value={fieldName} onValueChange={handleFieldNameChange}>
          <SelectTrigger aria-label='Field name' className='w-40 px-4 py-2'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FIELD_NAMES.map((f) => (
              <SelectItem key={f} value={f}>
                {FIELDNAME_LABELS[f]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={operation} onValueChange={handleOperationChange}>
          <SelectTrigger aria-label='Operation' className='w-40 px-4 py-2'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OPERATION_MAP[fieldName].map((op) => (
              <SelectItem key={op} value={op}>
                {OPERATION_LABELS[op]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className='flex flex-col pt-3.5'>
          <ValueWidget rule={rule} onChange={onChange} error={error} setError={setError} />

          <p
            id={`${rule.id}-err`}
            role='alert'
            className='text-destructive text-[0.65rem] pt-0.5 min-h-4 '
          >
            {error}
          </p>
        </div>

        <Button type='button' variant='destructive' className='cursor-pointer' onClick={onDelete}>
          -
        </Button>
      </div>
    </div>
  );
};

export default Rule;
