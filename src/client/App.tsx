import Group from "./components/Group";
import { useState } from "react";
import { RuleGroupType, RuleType } from "./types/RuleTypes";
import AppShell from "./layout/AppShell";

const initialRule = {
  id: crypto.randomUUID(),
  fieldName: "name",
  operation: "EQUAL",
  value: "",
} as RuleType;

function App() {
  const [group, setGroup] = useState<RuleGroupType>({
    id: crypto.randomUUID(),
    combinator: "AND",
    conditions: [initialRule],
  });

  return (
    <AppShell>
      
      <Group group={group} onChange={setGroup} />
    </AppShell>
  );
}

export default App;
