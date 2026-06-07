import { CurrencyRule, RuleGroupType, RuleType } from "@/types/RuleTypes";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const validate = (rule: RuleType): string | null => {
  switch (rule.fieldName) {

    case "installments":
      if (typeof rule.value !== "number" || !Number.isInteger(rule.value) || rule.value <= 0) {
        return "Installments must be a non-negative number";
      }
      break;
    
    case "amount": {
      const amountValue = rule.value as CurrencyRule["value"];
      if (typeof amountValue.amount !== "number" || amountValue.amount <= 0) {
        return "Amount must be a non-negative number and currency must be valid";
      }
      break;
    }

    case 'transaction_state':
      return null;

    default:
      if (typeof rule.value !== "string" || rule.value.trim() === "") {
        return "Value is required";
      }
  }
  return null;
};

export function serialize(group: RuleGroupType, isRoot: boolean): object {
  const key = isRoot ? "conditions" : "subConditions";
  return {
    combinator: group.combinator,
    [key]: group.conditions.map((c) =>
      "combinator" in c
        ? serialize(c as RuleGroupType, false)
        : { fieldName: c.fieldName, operation: c.operation, value: c.value },
    ),
  };
}
