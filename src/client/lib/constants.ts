import { EqualityOp, NumericOp, FieldNameType, RuleType, RuleGroupType } from '@/types/RuleTypes';

export const FIELD_NAMES = [
  'amount',
  'name',
  'id',
  'transaction_state',
  'device_ip',
  'installments',
] as const;

export const EQUALITY_OPS: EqualityOp[] = ['EQUAL', 'NOT_EQUAL'] as const;
export const NUMERIC_OPS: NumericOp[] = [...EQUALITY_OPS, 'LESS_THAN', 'GREATER_THAN'] as const;

export const OPERATION_MAP: Record<FieldNameType, ReadonlyArray<EqualityOp | NumericOp>> = {
  name: EQUALITY_OPS,
  device_ip: EQUALITY_OPS,
  id: EQUALITY_OPS,
  installments: NUMERIC_OPS,
  amount: NUMERIC_OPS,
  transaction_state: EQUALITY_OPS,
};

export const OPERATION_LABELS: Record<EqualityOp | NumericOp, string> = {
  EQUAL: 'is',
  NOT_EQUAL: 'is not',
  LESS_THAN: 'is less than',
  GREATER_THAN: 'is greater than',
};

export const FIELDNAME_LABELS: Record<string, string> = {
  amount: 'Amount',
  name: 'Name',
  id: 'ID',
  transaction_state: 'Transaction State',
  device_ip: 'Device IP',
  installments: 'Installments',
};

export const DEFAULT_FIELD_VALUES = {
  name: '',
  id: '',
  device_ip: '',
  installments: 0,
  amount: { amount: 0, currency: 'USD' },
  transaction_state: 'SUCCEEDED',
};

export const initialRule = {
  id: crypto.randomUUID(),
  fieldName: 'name',
  operation: 'EQUAL',
  value: '',
} as RuleType;

export const createInitialState = (): RuleGroupType => ({
  id: crypto.randomUUID(),
  combinator: 'AND',
  conditions: [
    { ...initialRule, id: crypto.randomUUID()  } as RuleType,
  ],
});


export const TRANSACTION_STATES = [
  'SUCCEEDED',
  'REJECTED',
  'ERROR',
  'TIMEOUT',
  'CANCELLED',
  'FAILED',
  'ABORTED',
] as const;
export const CURRENCIES = ['USD', 'EUR', 'GBP'] as const;
