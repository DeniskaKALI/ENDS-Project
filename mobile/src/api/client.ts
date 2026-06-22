import axios from "axios";

export const API_URL = "http://10.0.2.2:8080/api";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 5000
});

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
