import History from './history.model';
import { IOptions, QueryResult } from '../utils/paginate/paginate';
import { HistoryBody, IHistoryDoc } from './history.interfaces';

/**
 * Create a history
 * @param {HistoryBody} historyBody
 * @returns {Promise<IHistoryDoc>}
 */
export const createHistory = async (historyBody: HistoryBody): Promise<IHistoryDoc> => {
  return History.create(historyBody);
};

/**
 * Query for historys
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
export const queryHistorys = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
  const historys = await History.paginate(filter, options);
  return historys;
};
