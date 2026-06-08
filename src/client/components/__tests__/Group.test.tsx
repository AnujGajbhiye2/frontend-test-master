import { render, screen } from '@testing-library/react';
import Group from '../Group';
import { RuleGroupType } from '@/types/RuleTypes';
import { describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

const noop = () => {};

const MOCK_GROUP: RuleGroupType = {
  id: 'g1',
  combinator: 'AND',
  conditions: [{ id: 'r1', fieldName: 'name', operation: 'EQUAL', value: 'Anuj' }],
};

describe('Group test cases for rendering', () => {
  it('renders combinator select', () => {
    render(<Group group={MOCK_GROUP} onChange={noop} submitted={false} />);
    expect(screen.getByText('AND')).toBeInTheDocument();
  });

  it('renders + Rule button', () => {
    render(<Group group={MOCK_GROUP} onChange={noop} submitted={false} />);
    expect(screen.getByRole('button', { name: '+ Rule' })).toBeInTheDocument();
  });

  it('renders + Group button', () => {
    render(<Group group={MOCK_GROUP} onChange={noop} submitted={false} />);
    expect(screen.getByRole('button', { name: '+ Group' })).toBeInTheDocument();
  });

  it('renders child rule with fieldname, operation and value fields', () => {
    render(<Group group={MOCK_GROUP} onChange={noop} submitted={false} />);

    const comboboxes = screen.getAllByRole('combobox');
    expect(comboboxes.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByPlaceholderText('Value')).toBeInTheDocument();
  });

  it('does not render delete button on root group', () => {
    render(<Group group={MOCK_GROUP} onChange={noop} submitted={false} />);

    const buttons = screen.getAllByRole('button');
    const deleteButtons = buttons.filter((b) => b.textContent === '-');
    expect(deleteButtons).toHaveLength(1);
  });

  it('renders delete button when onDelete is passed', () => {
    render(<Group group={MOCK_GROUP} onChange={noop} submitted={false} onDelete={noop} />);
    const deleteButtons = screen.getAllByRole('button').filter((b) => b.textContent === '-');
    expect(deleteButtons).toHaveLength(2);
  });
});

const StatefulGroup = ({ initialGroup }: { initialGroup: RuleGroupType }) => {
  const [group, setGroup] = useState(initialGroup);
  return <Group group={group} onChange={setGroup} submitted={false} />;
};

describe('Group tests for behaviour ', () => {
  it('adds a rule when + Rule clicked', async () => {
    const user = userEvent.setup();

    render(<StatefulGroup initialGroup={MOCK_GROUP} />);
    await user.click(screen.getByRole('button', { name: '+ Rule' }));

    expect(screen.getAllByPlaceholderText('Value')).toHaveLength(2);
  });

  it('adds a Group when + Group clicked', async () => {
    const user = userEvent.setup();

    render(<StatefulGroup initialGroup={MOCK_GROUP} />);
    await user.click(screen.getByRole('button', { name: '+ Group' }));

    expect(screen.getAllByPlaceholderText('Value')).toHaveLength(2);
  });

  const MOCK_GROUP_WITH_NESTED: RuleGroupType = {
    id: 'g1',
    combinator: 'AND',
    conditions: [
      { id: 'r1', fieldName: 'name', operation: 'EQUAL', value: 'foo' },
      {
        id: 'g2',
        combinator: 'OR',
        conditions: [{ id: 'r2', fieldName: 'id', operation: 'EQUAL', value: '123' }],
      },
    ],
  };

  it('renders nested group', () => {
    render(<Group group={MOCK_GROUP_WITH_NESTED} onChange={noop} submitted={false} />);

    const addRuleButtons = screen.getAllByRole('button', { name: '+ Rule' });
    expect(addRuleButtons).toHaveLength(2);
  });

  it('deletes a nested group when group delete clicked', async () => {
    const user = userEvent.setup();
    render(<StatefulGroup initialGroup={MOCK_GROUP_WITH_NESTED} />);

    const deleteButtons = screen.getAllByRole('button', { name: '-' });

    await user.click(deleteButtons[1]);

    const addRuleButtons = screen.getAllByRole('button', { name: '+ Rule' });
    expect(addRuleButtons).toHaveLength(1);
  });

  it('deletes a rule when rule delete clicked', async () => {
    const user = userEvent.setup();
    render(<StatefulGroup initialGroup={MOCK_GROUP} />);

    await user.click(screen.getByRole('button', { name: '-' }));

    expect(screen.queryByPlaceholderText('Value')).not.toBeInTheDocument();
  });

  it('updates rule value when input changes', async () => {
    const user = userEvent.setup();
    render(<StatefulGroup initialGroup={MOCK_GROUP} />);

    const input = screen.getByPlaceholderText('Value');
    await user.clear(input);
    await user.type(input, 'newvalue');

    expect(screen.getByDisplayValue('newvalue')).toBeInTheDocument();
  });

  it('updates rule inside nested group', async () => {
    const user = userEvent.setup();
    render(<StatefulGroup initialGroup={MOCK_GROUP_WITH_NESTED} />);

    const inputs = screen.getAllByPlaceholderText('Value');
    await user.clear(inputs[1]);
    await user.type(inputs[1], 'updated');

    expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
  });
});
