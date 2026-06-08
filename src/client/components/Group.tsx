import React from 'react';
import { CombinatorType, RuleGroupType } from '../types/RuleTypes';
import Rule from './Rule';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { initialRule } from '@/lib/constants';

type GroupProps = {
  group: RuleGroupType;
  onChange: React.Dispatch<React.SetStateAction<RuleGroupType>>;
  onDelete?: () => void;
  submitted: boolean;
};

const Group = ({ group, onChange, onDelete, submitted }: GroupProps) => {
  const childSetter = (childId: string, action: React.SetStateAction<RuleGroupType>): void =>
    onChange((prev) => ({
      ...prev,
      conditions: prev.conditions.map((c) => {
        if (c.id !== childId) return c;
        return typeof action === 'function' ? action(c as RuleGroupType) : action;
      }),
    }));

  const handleAddRule = (): void => {
    onChange((prev) => {
      const rules = prev.conditions.filter((c) => !('combinator' in c));
      const groups = prev.conditions.filter((c) => 'combinator' in c);
      return {
        ...prev,
        conditions: [...rules, { ...initialRule, id: crypto.randomUUID() }, ...groups],
      };
    });
  };

  const handleAddGroup = (): void => {
    onChange((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        {
          id: crypto.randomUUID(),
          combinator: 'AND',
          conditions: [{ ...initialRule, id: crypto.randomUUID() }],
        } as RuleGroupType,
      ],
    }));
  };

  return (
    <Card className={onDelete ? 'border-l-4 border-l-primary/30 ml-4' : ''}>
      <CardContent className='pt-4 space-y-3'>
        <div className='flex items-center gap-2'>
          <Select
            value={group.combinator}
            onValueChange={(val) =>
              onChange((prev) => ({ ...prev, combinator: val as CombinatorType }))
            }
          >
            <SelectTrigger aria-label='Combinator' className='w-24 px-4 py-2'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='AND'>AND</SelectItem>
              <SelectItem value='OR'>OR</SelectItem>
            </SelectContent>
          </Select>
          <Button size='sm' type='button' variant='default' onClick={handleAddRule}>
            + Rule
          </Button>
          <Button size='sm' type='button' variant='default' onClick={handleAddGroup}>
            + Group
          </Button>
          {onDelete && (
            <Button
              className='cursor-pointer'
              type='button'
              size='sm'
              variant='destructive'
              onClick={onDelete}
            >
              -
            </Button>
          )}
        </div>

        <div className='space-y-2'>
          {group.conditions.map((cond) => {
            if ('combinator' in cond) {
              return (
                <Group
                  key={cond.id}
                  group={cond}
                  onChange={(action) => childSetter(cond.id, action)}
                  onDelete={() =>
                    onChange((prev) => ({
                      ...prev,
                      conditions: prev.conditions.filter((c) => c.id !== cond.id),
                    }))
                  }
                  submitted={submitted}
                />
              );
            } else {
              return (
                <Rule
                  key={cond.id}
                  rule={cond}
                  submitted={submitted}
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
