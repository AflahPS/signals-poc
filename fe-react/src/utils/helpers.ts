import { isAxiosError } from 'axios';
import { ApiResponse, FetchPayload } from '../models';
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

/**
 * Constructs the url, with the given parameters
 * @param baseUrl base URL for the request
 * @param payload payload for the request
 * @returns query string for the request
 */
export const constructUrl = (
  baseUrl: string,
  payload: FetchPayload & any
): string => {
  const queryParams: string[] = [];
  Object.keys(payload).forEach((key) => {
    if (payload[key] !== undefined) {
      queryParams.push(`${key}=${payload[key]}`);
    }
  });
  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
  return baseUrl + queryString;
};
