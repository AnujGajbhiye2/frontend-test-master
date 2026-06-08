import apiClient from '@/lib/apiClient';

export async function saveRules(payload: object, signal?: AbortSignal): Promise<void> {
  await apiClient.post('/save-rules', payload, signal);
}
