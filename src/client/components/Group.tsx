import React from "react";
import { CombinatorType, RuleGroupType, RuleType } from "../types/RuleTypes";
import Rule from "./Rule";
import { Button } from "./ui/button";

const initialRule = {
  id: crypto.randomUUID(),
  fieldName: "name",
  operation: "EQUAL",
  value: "",
} as RuleType;

type GroupProps = {
  group: RuleGroupType;
  onChange: React.Dispatch<React.SetStateAction<RuleGroupType>>;
};

const Group = ({ group, onChange }: GroupProps) => {
  const childSetter = (childId: string, action: React.SetStateAction<RuleGroupType>): void =>
    onChange((prev) => ({
      ...prev,
      conditions: prev.conditions.map((c) => {
        if (c.id !== childId) return c;
        return typeof action === "function" ? action(c as RuleGroupType) : action;
      }),
    }));


  const handleAddRule = (): void => {
    onChange((prev) => ({
      ...prev,
      conditions: [...prev.conditions, { ...initialRule, id: crypto.randomUUID() }].sort((a, _) =>
        "combinator" in a ? 1 : -1,
      ), // Ensure rules are added before groups
    }));
  };

  const handleAddGroup = (): void => {
    onChange((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        {
          id: crypto.randomUUID(),
          combinator: "AND",
          conditions: [{ ...initialRule, id: crypto.randomUUID() }],
        } as RuleGroupType,
      ],
    }));
  };

  return (
    <div>
      <div>
        <select
          value={group.combinator}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, combinator: e.target.value as CombinatorType }))
          }
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <Button onClick={handleAddRule}>+ Rule</Button>
        <Button onClick={handleAddGroup}>+ Group</Button>
      </div>
      {group.conditions.map((cond) => {
        if ("combinator" in cond) {
          return (
            <Group key={cond.id} group={cond} onChange={(action) => childSetter(cond.id, action)} />
          );
        } else {
          return (
            <Rule
              key={cond.id}
              rule={cond}
              onChange={(updated) =>
                onChange((prev) => ({
                  ...prev,
                  conditions: prev.conditions.map((c) => (c.id === updated.id ? updated : c)),
                }))
              }
            />
          );
        }
      })}
    </div>
  );
};

export default Group;
