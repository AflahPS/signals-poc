import { isAxiosError } from 'axios';
import { ApiResponse } from '../models';

export const handleError = (err: unknown): ApiResponse => {
  let errorMessage = (err as Error)?.message;
  if (isAxiosError(err)) {
    errorMessage =
      err?.response?.data?.message ||
      err?.response?.data ||
      err?.response?.statusText ||
      err?.message;
  }
  console.log({ errorMessage });
  return { data: null, error: true, message: errorMessage };
};
