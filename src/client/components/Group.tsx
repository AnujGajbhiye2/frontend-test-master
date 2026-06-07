import React from "react";
import { CombinatorType, RuleGroupType, RuleType } from "../types/RuleTypes";
import Rule from "./Rule";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const initialRule = {
  id: crypto.randomUUID(),
  fieldName: "name",
  operation: "EQUAL",
  value: "",
} as RuleType;

type GroupProps = {
  group: RuleGroupType;
  onChange: React.Dispatch<React.SetStateAction<RuleGroupType>>;
  depth?: number;
  onDelete?: () => void;
};

const Group = ({ group, onChange, depth = 0, onDelete }: GroupProps) => {
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
      conditions: [...prev.conditions, { ...initialRule, id: crypto.randomUUID() }].sort((a) =>
        "combinator" in a ? 1 : -1,
      ),
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
    <Card className={depth > 0 ? "border-l-4 border-l-primary/30 ml-4" : ""}>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center gap-2">
          <Select
            value={group.combinator}
            onValueChange={(val) =>
              onChange((prev) => ({ ...prev, combinator: val as CombinatorType }))
            }
          >
            <SelectTrigger className="w-24 px-4 py-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AND">AND</SelectItem>
              <SelectItem value="OR">OR</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="default" onClick={handleAddRule}>
            + Rule
          </Button>
          <Button size="sm" variant="default" onClick={handleAddGroup}>
            + Group
          </Button>
          {onDelete && (
            <Button className="cursor-pointer" type="button" size="sm" variant="destructive" onClick={onDelete}>
              -
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {group.conditions.map((cond) => {
            if ("combinator" in cond) {
              return (
                <Group
                  key={cond.id}
                  group={cond}
                  onChange={(action) => childSetter(cond.id, action)}
                  depth={depth + 1}
                  onDelete={() =>
                    onChange((prev) => ({
                      ...prev,
                      conditions: prev.conditions.filter((c) => c.id !== cond.id),
                    }))
                  }
                />
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
                  onDelete={() =>
                    onChange((prev) => ({
                      ...prev,
                      conditions: prev.conditions.filter((c) => c.id !== cond.id),
                    }))
                  }
                />
              );
            }
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Group;
