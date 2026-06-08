import { describe, it, expect, vi } from 'vitest';
import { saveRules } from '../rulesService';

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));

vi.mock('@/lib/apiClient', () => ({
  default: { post: mockPost },
}));

describe('rulesService', () => {
  it('calls apiClient.post with correct path and payload', async () => {
    mockPost.mockResolvedValueOnce(undefined);
    const payload = { combinator: 'AND', conditions: [] };

    await saveRules(payload);

    expect(mockPost).toHaveBeenCalledWith('/save-rules', payload, undefined);
  });

  it('forwards AbortSignal to apiClient', async () => {
    mockPost.mockResolvedValueOnce(undefined);
    const controller = new AbortController();

    await saveRules({}, controller.signal);

    expect(mockPost).toHaveBeenCalledWith('/save-rules', {}, controller.signal);
  });

  it('propagates errors from apiClient', async () => {
    mockPost.mockRejectedValueOnce(new Error('POST /save-rules failed: 500'));

    await expect(saveRules({})).rejects.toThrow('POST /save-rules failed: 500');
  });
});
