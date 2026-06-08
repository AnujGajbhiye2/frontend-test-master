import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import AppShell from '../AppShell';

describe('App Shell test', () => {
  it('renders children', () => {
    render(
      <AppShell>
        <div>test</div>
      </AppShell>,
    );
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('Query Builder')).toBeInTheDocument();
  });
});
