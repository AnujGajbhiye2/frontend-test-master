import axios, { AxiosResponse, AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

async function post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient.post(path, body, { signal });
    return response.data;
  } catch (err) {
    if (axios.isCancel(err)) throw new Error('Request cancelled');
    if (err instanceof AxiosError) {
      throw new Error(`POST ${path} failed: ${err.response?.status} ${err.message}`);
    }
    throw err;
  }
}

export default { post };
