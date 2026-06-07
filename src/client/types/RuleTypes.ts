import { FIELD_NAMES } from "@/lib/constants";

export type CombinatorType = "AND" | "OR";

export type EqualityOp = "EQUAL" | "NOT_EQUAL";
export type NumericOp = EqualityOp | "LESS_THAN" | "GREATER_THAN";

export type TextRule = {
  fieldName: "name" | "id" | "device_ip";
  operation: EqualityOp;
  value: string;
};

export type NumericRule = {
  fieldName: "installments";
  operation: NumericOp;
  value: number;
};

export type CurrencyRule = {
  fieldName: "amount";
  operation: NumericOp;
  value: {
    amount: number;
    currency: string;
  };
};

export type EnumRule = {
  fieldName: "transaction_state";
  operation: EqualityOp;
  value:
    | "SUCCEEDED"
    | "REJECTED"
    | "ERROR"
    | "TIMEOUT"
    | "CANCELLED"
    | "FAILED"
    | "ABORTED";
};

export type RuleType = (TextRule | NumericRule | CurrencyRule | EnumRule) & {
  id: string;
};

export type RuleGroupType = {
  id: string;
  combinator: CombinatorType;
  conditions: Array<RuleType | RuleGroupType>;
};

export type FieldNameType = typeof FIELD_NAMES[number];