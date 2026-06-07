import { CurrencyRule, FieldNameType, RuleType } from "../types/RuleTypes";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import {
  DEFAULT_FIELD_VALUES,
  FIELD_NAMES,
  OPERATION_MAP,
  TRANSACTION_STATES,
  CURRENCIES,
} from "@/lib/constants";

const Rule = ({
  rule,
  onChange,
  onDelete,
}: {
  rule: RuleType;
  onChange: (updated: RuleType) => void;
  onDelete: () => void;
}) => {
  const handleFieldNameChange = (value: FieldNameType): void => {
    onChange({
      ...rule,
      fieldName: value,
      operation: "EQUAL",
      value: DEFAULT_FIELD_VALUES[value],
    } as RuleType);
  };

  const handleOperationChange = (value: string): void => {
    onChange({
      ...rule,
      operation: value,
    } as RuleType);
  };

  const handleValueChange = (value: RuleType["value"]): void => {
    onChange({
      ...rule,
      value,
    } as RuleType);
  };

  const { fieldName, operation } = rule;

  return (
    <div className="flex items-center gap-2 rounded-md border bg-background px-3 py-2">
      <Select value={fieldName} onValueChange={handleFieldNameChange}>
        <SelectTrigger className="w-40 px-4 py-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FIELD_NAMES.map((f) => (
            <SelectItem key={f} value={f}>
              {f}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={operation} onValueChange={handleOperationChange}>
        <SelectTrigger className="w-40 px-4 py-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPERATION_MAP[fieldName].map((op) => (
            <SelectItem key={op} value={op}>
              {op}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {rule.fieldName === "transaction_state" ? (
        <Select value={rule.value as string} onValueChange={handleValueChange}>
          <SelectTrigger className="w-40 px-4 py-2">
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
      ) : rule.fieldName === "amount" ? (
        <>
          <Select
            value={rule.value.currency}
            onValueChange={(val) => handleValueChange({ ...rule.value, currency: val })}
          >
            <SelectTrigger className="w-24 px-4 py-2">
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
            className="w-32"
            type="number"
            placeholder="Amount"
            value={rule.value.amount}
            onChange={(e) =>
              handleValueChange({
                ...(rule.value as CurrencyRule["value"]),
                amount: Number(e.target.value),
              })
            }
          />
        </>
      ) : (
        <Input
          className="w-40"
          type={rule.fieldName === "installments" ? "number" : "text"}
          placeholder="Value"
          value={rule.value as string | number}
          onChange={(e) =>
            handleValueChange(
              rule.fieldName === "installments" ? Number(e.target.value) : e.target.value,
            )
          }
        />
      )}
      <Button
        type="button"
        variant="destructive"
        className="cursor-pointer"
        onClick={onDelete}
      >
        -
      </Button>
    </div>
  );
};

export default Rule;
