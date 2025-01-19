import { ApiResponse, FetchPayload, IHistory, Paginated } from '../models';
import { constructUrl, handleError } from '../utils/helpers';
import api from './_base';

const base = '/history';

interface GetHistorysPayload extends FetchPayload, Partial<IHistory> {}

export const getHistory = async <T = IHistory>(
  payload: GetHistorysPayload
): Promise<ApiResponse<Paginated<T>>> => {
  try {
    const url = constructUrl(base, payload);
    const { data } = await api.get<Paginated<T>>(url);
    return { data, error: false, message: null };
  } catch (error) {
    return handleError(error);
  }
};
