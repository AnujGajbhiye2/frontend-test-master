import { describe, expect, it } from 'vitest';
import { serialize, validate } from '../utils';
import { RuleGroupType } from '@/types/RuleTypes';

describe('validate test', () => {
  describe('installments', () => {
    const MOCK_RULE = { id: '1', fieldName: 'installments', operation: 'EQUAL', value: 5 } as const;

    it('returns null for positive integer', () => {
      expect(validate({ ...MOCK_RULE })).toBeNull();
    });

    it('returns error for zero', () => {
      expect(validate({ ...MOCK_RULE, value: 0 })).not.toBeNull();
    });

    it('returns error for negative number', () => {
      expect(validate({ ...MOCK_RULE, value: -2 })).not.toBeNull();
    });

    it('returns error for decimal number', () => {
      expect(validate({ ...MOCK_RULE, value: 2.5 })).not.toBeNull();
    });
  });

  describe('amount', () => {
    const MOCK_RULE = {
      id: '1',
      fieldName: 'amount',
      operation: 'EQUAL',
      value: { currency: 'USD', amount: 2 },
    } as const;

    it('returns null for positive integer', () => {
      expect(validate({ ...MOCK_RULE })).toBeNull();
    });

    it('returns error for negative number', () => {
      expect(validate({ ...MOCK_RULE, value: { amount: -2, currency: 'USD' } })).not.toBeNull();
    });

    it('returns error for zero', () => {
      expect(validate({ ...MOCK_RULE, value: { amount: 0, currency: 'USD' } })).not.toBeNull();
    });
  });

  describe('transaction_state', () => {
    const MOCK_RULE = {
      id: '1',
      fieldName: 'transaction_state',
      operation: 'EQUAL',
      value: 'SUCCEEDED',
    } as const;

    it('returns null for valid state', () => {
      expect(validate({ ...MOCK_RULE })).toBeNull();
    });
  });

  describe('name', () => {
    const MOCK_RULE = {
      id: '1',
      fieldName: 'name',
      operation: 'EQUAL',
      value: '',
    } as const;

    it('returns error on empty field', () => {
      expect(validate({ ...MOCK_RULE })).not.toBeNull();
    });

    it('returns null on valid value', () => {
      expect(validate({ ...MOCK_RULE, value: 'anuj' })).toBeNull();
    });

    it('returns error for whitespace only', () => {
      expect(validate({ ...MOCK_RULE, value: '   ' })).not.toBeNull();
    });
  });
});

describe('serialize test', () => {
  it('serializes flat group with conditions key', () => {
    const group = {
      id: 'g1',
      combinator: 'AND',
      conditions: [{ id: 'r1', fieldName: 'name', operation: 'EQUAL', value: 'Anuj' }],
    } as RuleGroupType;

    const result = serialize(group, true) as { combinator: string; conditions: object[] };

    expect(result.combinator).toBe('AND');
    expect(result.conditions).toHaveLength(1);
    expect(result.conditions[0]).toEqual({ fieldName: 'name', operation: 'EQUAL', value: 'Anuj' });
    expect(result.conditions[0]).not.toHaveProperty('id');
  });

  it('serialize nested group with subConditions key', () => {
    const group = {
      id: 'g1',
      combinator: 'AND',
      conditions: [
        { id: 'r1', fieldName: 'name', operation: 'EQUAL', value: 'Anuj' },
        {
          id: 'g2',
          combinator: 'OR',
          conditions: [{ fieldName: 'id', operation: 'EQUAL', value: '123' }],
        },
      ],
    } as RuleGroupType;

    const result = serialize(group, true) as { combinator: string; conditions: object[] };
    expect(result.conditions).toHaveLength(2);

    const nestedGroup = result.conditions[1] as { subConditions: object[] };
    expect(nestedGroup).toHaveProperty('subConditions');

    expect(nestedGroup).not.toHaveProperty('conditions');
  });
});
