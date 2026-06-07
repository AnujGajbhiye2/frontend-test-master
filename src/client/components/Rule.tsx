import React from "react";
import {
  CurrencyRule,
  EqualityOp,
  FieldNameType,
  NumericOp,
  RuleType,
} from "../types/RuleTypes";

const FIELD_NAMES = [
  "amount",
  "name",
  "id",
  "transaction_state",
  "device_ip",
  "installments",
] as const;

const EQUALITY_OPS: EqualityOp[] = ["EQUAL", "NOT_EQUAL"];
const NUMERIC_OPS: NumericOp[] = [...EQUALITY_OPS, "LESS_THAN", "GREATER_THAN"];

const OPERATION_MAP: Record<FieldNameType, string[]> = {
  name: EQUALITY_OPS,
  device_ip: EQUALITY_OPS,
  id: EQUALITY_OPS,
  installments: NUMERIC_OPS,
  amount: NUMERIC_OPS,
  transaction_state: EQUALITY_OPS,
};

const DEFAULT_VALUES = {
  name: "",
  id: "",
  device_ip: "",
  installments: 0,
  amount: { amount: 0, currency: "USD" },
  transaction_state: "SUCCEEDED",
};

const Rule = ({
  rule,
  onChange,
}: {
  rule: RuleType;
  onChange: (updated: RuleType) => void;
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    fieldType: string,
  ): void => {
    let newFieldName, newOP, newValue;

    if (fieldType === "amount" || fieldType === "currency") {
      newValue = {
        amount:
          fieldType === "amount"
            ? Number(e.target.value)
            : (rule.value as CurrencyRule["value"]).amount,
        currency:
          fieldType === "currency"
            ? e.target.value
            : (rule.value as CurrencyRule["value"]).currency,
      };
    } else if (fieldType === "value") {
      newValue = e.target.value;
    }

    if (fieldType === "fieldName") {
      newFieldName = e.target.value as FieldNameType;
      newValue = DEFAULT_VALUES[newFieldName];
      newOP = "EQUAL";
    }

    if (fieldType === "operation") {
      newOP = e.target.value;
    }

    onChange({
      ...rule,
      fieldName: newFieldName ?? rule.fieldName,
      operation: newOP ?? rule.operation,
      value: newValue ?? rule.value,
    } as RuleType);
  };
  const { id, fieldName, operation } = rule;
  return (
    <div key={id}>
      <select
        value={fieldName}
        onChange={(e) => handleChange(e, "fieldName")}
      >
        {FIELD_NAMES.map((field) => (
          <option key={field}>{field}</option>
        ))}
      </select>
      <select
        value={operation}
        onChange={(e) => handleChange(e, "operation")}
      >
        {OPERATION_MAP[fieldName].map((op) => (
          <option key={op}>{op}</option>
        ))}
      </select>
      {rule.fieldName === "amount" && (
        <select
          value={rule.value.currency}
          onChange={(e) => {
            handleChange(e, "currency");
          }}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
      )}
      <input
        placeholder="Value"
        type={fieldName === "amount" ? "number" : "text"}
        value={rule.fieldName === "amount" ? rule.value.amount : rule.value}
        onChange={(e) =>
          handleChange(e, fieldName === "amount" ? "amount" : "value")
        }
      />
    </div>
  );
};

export default Rule;
