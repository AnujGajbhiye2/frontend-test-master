import { useState } from "react";
import Group from "./components/Group";
import AppShell from "./layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RuleGroupType } from "./types/RuleTypes";
import { initialRule } from "./lib/constants";

function serialize(group: RuleGroupType, isRoot: boolean): object {
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

function App() {
  const [group, setGroup] = useState<RuleGroupType>({
    id: crypto.randomUUID(),
    combinator: "AND",
    conditions: [initialRule],
  });
  const [result, setResult] = useState<object | null>(null);

  const handleSubmit = () => {
    setResult(serialize(group, true));
  };

  return (
    <AppShell>
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-6 space-y-4">
          <Group group={group} onChange={setGroup} />
          <Button onClick={handleSubmit}>Submit Query</Button>
        </div>

        <div className="col-span-6">
          {result ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Query JSON</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted rounded-md p-4 overflow-auto max-h-[70vh]">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
              Submit query to see JSON output
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default App;
