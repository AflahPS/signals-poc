import axios from 'axios';
import { baseURL } from '../config';

export const api = axios.create({
  baseURL,
});
