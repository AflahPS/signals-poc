import { ApiResponse, IUser } from '../models';
import { handleError } from '../utils/helpers';
import { StorageKeys } from '../config';
import api from './_base';

const base = '/auth';

export interface LoginPayload {
  email: string;
  password: string;
}

type Token = {
  token: string;
  expires: Date;
};

export interface LoginResponse {
  user: IUser;
  tokens: {
    access: Token;
    refresh: Token;
  };
}

export const login = async (
  payload: LoginPayload
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const { email, password } = payload;
    const { data } = await api.post(`${base}/login`, { email, password });
    return { data, error: false, message: null };
  } catch (error) {
    return handleError(error);
  }
};

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export const register = async (
  payload: RegisterPayload
): Promise<ApiResponse<LoginResponse>> => {
  try {
    const { email, password, name } = payload;
    const { data } = await api.post(`${base}/register`, {
      name,
      email,
      password,
    });
    return { data, error: false, message: null };
  } catch (error) {
    return handleError(error);
  }
};

export const getMe = async (): Promise<ApiResponse<IUser>> => {
  try {
    const { data } = await api.get(`${base}/me`);
    return { data, error: false, message: null };
  } catch (error) {
    return handleError(error);
  }
};

export interface ResetPasswordPayload {
  email: string;
  password: string;
}

export const logout = async (): Promise<ApiResponse<ResetPasswordPayload>> => {
  try {
    const refreshToken = JSON.parse(
      localStorage.getItem(StorageKeys.refresh) || ''
    );
    if (!refreshToken.trim()) {
      localStorage.removeItem(StorageKeys.access);
      return { data: null, error: false, message: null };
    }
    const { data } = await api.post(`${base}/logout`, { refreshToken });
    localStorage.removeItem(StorageKeys.access);
    localStorage.removeItem(StorageKeys.refresh);
    return { data, error: false, message: null };
  } catch (error) {
    return handleError(error);
  }
};

export const refreshToken = async (): Promise<ApiResponse<LoginResponse>> => {
  try {
    const refreshTokenLocal = JSON.parse(
      localStorage.getItem(StorageKeys.refresh) as string
    );
    const response = await api.post<LoginResponse>(`${base}/refresh-tokens`, {
      refreshToken: refreshTokenLocal,
    });
    if (response?.data) {
      const accessTokenNew = response?.data?.tokens?.access?.token;
      const refreshTokenNew = response?.data?.tokens?.refresh?.token;
      localStorage.setItem(StorageKeys.access, JSON.stringify(accessTokenNew));
      localStorage.setItem(
        StorageKeys.refresh,
        JSON.stringify(refreshTokenNew)
      );
      return { data: response.data, error: false, message: null };
    }
    return { data: null, error: true, message: response?.statusText };
  } catch (error) {
    return handleError(error);
  }
};
