import { isAxiosError } from 'axios';
import { ApiResponse } from '../models';
import { StorageKeys } from '../config';
import { LoginResponse } from '../services';

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

/**
 * It saves the tokens in the response to the local storage
 * @param loginResponse response from the server
 */
export const postLoginHandler = (loginResponse: LoginResponse) => {
  const {
    tokens: { access, refresh },
  } = loginResponse;
  localStorage.setItem(StorageKeys.access, JSON.stringify(access.token));
  localStorage.setItem(StorageKeys.refresh, JSON.stringify(refresh.token));
};
