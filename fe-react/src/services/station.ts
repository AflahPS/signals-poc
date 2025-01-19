import { ApiResponse, FetchPayload, IStation, Paginated } from '../models';
import { constructUrl, handleError } from '../utils/helpers';
import api from './_base';

const base = '/stations';

interface GetStationsPayload extends FetchPayload {
  createdBy?: string;
}

export const getStations = async <T = IStation>(
  payload: GetStationsPayload
): Promise<ApiResponse<Paginated<T>>> => {
  try {
    const url = constructUrl(base, payload);
    const { data } = await api.get<Paginated<T>>(url);
    return { data, error: false, message: null };
  } catch (error) {
    return handleError(error);
  }
};

interface CreateStationPayload {
  name: string;
}

export const createStation = async (
  payload: CreateStationPayload
): Promise<ApiResponse<IStation>> => {
  try {
    const { data } = await api.post(base, payload);
    return { data, error: false, message: null };
  } catch (error) {
    return handleError(error);
  }
};

export const editStation = async (
  id: string,
  payload: Partial<CreateStationPayload>
): Promise<ApiResponse<IStation>> => {
  try {
    const { data } = await api.patch(`${base}/${id}`, payload);
    return { data, error: false, message: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteStation = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const { data } = await api.delete(`${base}/${id}`);
    return { data, error: false, message: null };
  } catch (error) {
    return handleError(error);
  }
};
