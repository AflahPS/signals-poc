import { ApiResponse, FetchPayload, IPost, Paginated } from '../models';
import { constructUrl, handleError } from '../utils/helpers';
import api from './_base';

const base = '/posts';

interface GetPostsPayload extends FetchPayload {
  station?: string;
  createdBy?: string;
  activeSignal?: string;
}

export const getPosts = async <T = IPost>(
  payload: GetPostsPayload
): Promise<ApiResponse<Paginated<T>>> => {
  try {
    const url = constructUrl(base, payload);
    const { data } = await api.get<Paginated<T>>(url);
    return { data, error: false, message: null };
  } catch (error) {
    return handleError(error);
  }
};

interface CreatePostPayload {
  name: string;
  station: string;
  availableSignals: string[];
  activeSignal: string;
}

export const createPost = async (
  payload: CreatePostPayload
): Promise<ApiResponse<IPost>> => {
  try {
    const { data } = await api.post(base, payload);
    return { data, error: false, message: null };
  } catch (error) {
    return handleError(error);
  }
};

export const editPost = async (
  id: string,
  payload: Partial<Omit<CreatePostPayload, 'station'>>
): Promise<ApiResponse<IPost>> => {
  try {
    const { data } = await api.patch(`${base}/${id}`, payload);
    return { data, error: false, message: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deletePost = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const { data } = await api.delete(`${base}/${id}`);
    return { data, error: false, message: null };
  } catch (error) {
    return handleError(error);
  }
};
