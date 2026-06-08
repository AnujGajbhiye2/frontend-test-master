import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AxiosError } from 'axios';

const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>();
  return {
    ...actual,
    default: {
      ...actual.default,
      create: vi.fn(() => ({ post: mockPost })),
      isCancel: vi.fn((err) => err?.message === 'Request cancelled by axios'),
    },
  };
});


const { default: apiClient } = await import('../apiClient');

describe('apiClient.post', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns response data on success', async () => {
    mockPost.mockResolvedValueOnce({ data: { id: 1 } });

    const result = await apiClient.post('/test', { foo: 'bar' });

    expect(result).toEqual({ id: 1 });
    expect(mockPost).toHaveBeenCalledWith('/test', { foo: 'bar' }, { signal: undefined });
  });

  it('throws "Request cancelled" when axios cancels', async () => {
    const cancelError = new Error('Request cancelled by axios');
    mockPost.mockRejectedValueOnce(cancelError);

    await expect(apiClient.post('/test', {})).rejects.toThrow('Request cancelled');
  });

  it('throws formatted message on AxiosError', async () => {
    const axiosErr = new AxiosError('Network Error', 'ERR_NETWORK', undefined, undefined, {
      status: 500,
      data: {},
      statusText: 'Internal Server Error',
      headers: {},
      config: {} as never,
    });
    mockPost.mockRejectedValueOnce(axiosErr);

    await expect(apiClient.post('/test', {})).rejects.toThrow('POST /test failed: 500');
  });

  it('rethrows unknown errors as-is', async () => {
    const unknownErr = new Error('something unexpected');
    mockPost.mockRejectedValueOnce(unknownErr);

    await expect(apiClient.post('/test', {})).rejects.toThrow('something unexpected');
  });

  it('forwards AbortSignal to axios', async () => {
    mockPost.mockResolvedValueOnce({ data: null });
    const controller = new AbortController();

    await apiClient.post('/test', {}, controller.signal);

    expect(mockPost).toHaveBeenCalledWith('/test', {}, { signal: controller.signal });
  });
});
