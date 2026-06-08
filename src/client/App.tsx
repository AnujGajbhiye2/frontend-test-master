import { useEffect, useRef, useState } from "react";
import Group from "./components/Group";
import AppShell from "./layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RuleGroupType } from "./types/RuleTypes";
import { serialize, validate } from "./lib/utils";
import { initialState } from "./lib/constants";

import { saveRules } from "./services/rulesService";

function App() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [group, setGroup] = useState<RuleGroupType>(initialState);
  const [result, setResult] = useState<object | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setSubmitted(false);
  }, [group]);

  const handleSubmit = async () => {
    setSubmitted(true);
    if (hasError(group)) return alert("Please fix validation errors before submitting.");

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    setSubmitted(false);

    const payload = serialize(group, true);

    try {
      await saveRules(payload, controllerRef.current.signal);
      setResult(payload);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save rules");
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setResult(null);
    setGroup(initialState);
  };

  const hasError = (group: RuleGroupType): boolean => {
    return group.conditions.some((condition) => {
      if ("combinator" in condition) {
        return hasError(condition as RuleGroupType);
      }
      return validate(condition) !== null;
    });
  };

  return (
    <AppShell>
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-6 space-y-4">
          <Group group={group} onChange={setGroup} submitted={submitted} />
          <Button onClick={handleReset} variant={"outline"} className="mr-2">
            Reset
          </Button>
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
