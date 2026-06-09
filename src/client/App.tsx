import { useEffect, useRef, useState } from 'react';
import Group from './components/Group';
import AppShell from './layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RuleGroupType } from './types/RuleTypes';
import { hasError, serialize } from './lib/utils';
import { createInitialState } from './lib/constants';

import { saveRules } from './services/rulesService';
import { toast } from 'sonner';

function App() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [group, setGroup] = useState<RuleGroupType>(createInitialState());
  const [result, setResult] = useState<object | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setSubmitted(false);
  }, [group]);

  useEffect(() => () => controllerRef.current?.abort(), []); //clean up to cancel in-flight req on unmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasError(group)) return toast.error('Please fix validation errors before submitting.');

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setSubmitted(false);

    const payload = serialize(group, true);
    setLoading(true);

    try {
      await saveRules(payload, controller.signal);
      setResult(payload);
      toast.success('Query saved');
    } catch (err) {
      if (controller.signal.aborted) return;
      toast.error(err instanceof Error ? err.message : 'Failed to save rules');
    } finally {
      if (controllerRef.current === controller) setLoading(false);
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
          <Button type='submit'>{loading ? 'Saving...' : 'Submit Query'}</Button>
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
