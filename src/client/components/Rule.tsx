import React from "react";
import {
  CurrencyRule,
  EqualityOp,
  FieldNameType,
  NumericOp,
  RuleType,
} from "../types/RuleTypes";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const TRANSACTION_STATES = ["SUCCEEDED", "REJECTED", "ERROR", "TIMEOUT", "CANCELLED", "FAILED", "ABORTED"] as const;
const CURRENCIES = ["USD", "EUR", "GBP"] as const;

const Rule = ({
  rule,
  onChange,
}: {
  rule: RuleType;
  onChange: (updated: RuleType) => void;
}) => {
  const handleSelectChange = (value: string, fieldType: string): void => {
    let newFieldName, newOP, newValue;

    if (fieldType === "currency") {
      newValue = {
        amount: (rule.value as CurrencyRule["value"]).amount,
        currency: value,
      };
    }

    if (fieldType === "fieldName") {
      newFieldName = value as FieldNameType;
      newValue = DEFAULT_VALUES[newFieldName];
      newOP = "EQUAL";
    }

    if (fieldType === "operation") {
      newOP = value;
    }

    if (fieldType === "transaction_state") {
      newValue = value;
    }

    onChange({
      ...rule,
      fieldName: newFieldName ?? rule.fieldName,
      operation: newOP ?? rule.operation,
      value: newValue ?? rule.value,
    } as RuleType);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldType: string,
  ): void => {
    let newValue;

    if (fieldType === "amount") {
      newValue = {
        amount: Number(e.target.value),
        currency: (rule.value as CurrencyRule["value"]).currency,
      };
    } else {
      newValue = fieldType === "installments" ? Number(e.target.value) : e.target.value;
    }

    onChange({ ...rule, value: newValue } as RuleType);
  };

  const { fieldName, operation } = rule;

  return (
    <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
      <Select value={fieldName} onValueChange={(val) => handleSelectChange(val, "fieldName")}>
        <SelectTrigger className="w-40 px-4 py-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FIELD_NAMES.map((f) => (
            <SelectItem key={f} value={f}>{f}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={operation} onValueChange={(val) => handleSelectChange(val, "operation")}>
        <SelectTrigger className="w-40 px-4 py-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPERATION_MAP[fieldName].map((op) => (
            <SelectItem key={op} value={op}>{op}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {rule.fieldName === "transaction_state" ? (
        <Select
          value={rule.value as string}
          onValueChange={(val) => handleSelectChange(val, "transaction_state")}
        >
          <SelectTrigger className="w-40 px-4 py-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_STATES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : rule.fieldName === "amount" ? (
        <>
          <Select
            value={rule.value.currency}
            onValueChange={(val) => handleSelectChange(val, "currency")}
          >
            <SelectTrigger className="w-24 px-4 py-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            className="w-32"
            type="number"
            placeholder="Amount"
            value={rule.value.amount}
            onChange={(e) => handleInputChange(e, "amount")}
          />
        </>
      ) : (
        <Input
          className="w-40"
          type={rule.fieldName === "installments" ? "number" : "text"}
          placeholder="Value"
          value={rule.value as string | number}
          onChange={(e) => handleInputChange(e, rule.fieldName === "installments" ? "installments" : "value")}
        />
      )}
    </div>
  );
};

export default Rule;
