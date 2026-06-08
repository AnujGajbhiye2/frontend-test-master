import { useEffect, useRef, useState } from 'react';
import Group from './components/Group';
import AppShell from './layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RuleGroupType } from './types/RuleTypes';
import { hasError, serialize } from './lib/utils';
import { createInitialState } from './lib/constants';

import { saveRules } from './services/rulesService';

function App() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [group, setGroup] = useState<RuleGroupType>(createInitialState());
  const [result, setResult] = useState<object | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setSubmitted(false);
  }, [group]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasError(group)) return alert('Please fix validation errors before submitting.');

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    setSubmitted(false);

    const payload = serialize(group, true);

    try {
      await saveRules(payload, controllerRef.current.signal);
      setResult(payload);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save rules');
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setResult(null);
    setGroup(createInitialState());
  };

  return (
    <AppShell>
      <div className='grid grid-cols-12 gap-6 items-start'>
        <form className='col-span-12 lg:col-span-6 space-y-4' onSubmit={handleSubmit}>
          <Group group={group} onChange={setGroup} submitted={submitted} />
          <Button onClick={handleReset} type='button' variant={'outline'} className='mr-2'>
            Reset
          </Button>
          <Button type='submit'>Submit Query</Button>
        </form>

        <div className='col-span-12 lg:col-span-6'>
          {result ? (
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium'>Query JSON</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className='text-xs bg-muted rounded-md p-4 overflow-auto max-h-[70vh]'>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ) : (
            <div className='flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground'>
              Submit query to see JSON output
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default App;
