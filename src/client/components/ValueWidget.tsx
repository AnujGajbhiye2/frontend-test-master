import { CurrencyRule, RuleType } from '@/types/RuleTypes';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CURRENCIES, TRANSACTION_STATES } from '@/lib/constants';
import { Input } from './ui/input';
import { validate } from '@/lib/utils';

type ValueWidgetPropsType = {
  rule: RuleType;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onChange: (updated: RuleType) => void;
};

const ValueWidget = ({ rule, onChange, error, setError }: ValueWidgetPropsType) => {
  const handleValueChange = (value: RuleType['value']): void => {
    onChange({
      ...rule,
      value,
    } as RuleType);
  };

  if (rule.fieldName === 'transaction_state') {
    return (
      <Select value={rule.value as string} onValueChange={handleValueChange}>
        <SelectTrigger className='w-40 px-4 py-2'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TRANSACTION_STATES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (rule.fieldName === 'amount') {
    return (
      <div className='flex flex-row gap-2'>
        <Select
          value={rule.value.currency}
          onValueChange={(val) => handleValueChange({ ...rule.value, currency: val })}
        >
          <SelectTrigger className='w-24 px-4 py-2'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className={error ? ' border-destructive' : ''}
          type='number'
          placeholder='Amount'
          value={rule.value.amount}
          onBlur={() => setError(validate(rule))}
          onChange={(e) =>
            handleValueChange({
              ...(rule.value as CurrencyRule['value']),
              amount: Number(e.target.value),
            })
          }
        />
      </div>
    );
  }

  return (
    <Input
      className={error ? ' border-destructive' : ''}
      type={rule.fieldName === 'installments' ? 'number' : 'text'}
      placeholder='Value'
      value={rule.value as string | number}
      onBlur={() => setError(validate(rule))}
      onChange={(e) =>
        handleValueChange(
          rule.fieldName === 'installments' ? Number(e.target.value) : e.target.value,
        )
      }
    />
  );
};

export default ValueWidget;
