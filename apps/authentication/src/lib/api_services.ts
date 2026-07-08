import axios, { AxiosResponse } from "axios";
import { Cookies } from "react-cookie";
// import { decryptPayload, encryptPayload } from "./encryption";
/**
 * The base URL for the API endpoints.
 */
export const apiEndPoint = process.env.AUTH_URL + "/api";


const cookies = new Cookies();

const axiosSecure = axios.create({
  baseURL: apiEndPoint,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});

const axiosPublic = axios.create({
  baseURL: apiEndPoint,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});

// axiosPublic.interceptors.request.use((config) => {
//   if (config.data) {
//     config.data = {
//       data: encryptPayload(config.data),
//     };
//   }
//   return config;
// });

// axiosSecure.interceptors.request.use((config) => {
//   if (config.data) {
//     config.data = {
//       data: encryptPayload(config.data),
//     };
//   }
//   return config;
// });

// axiosPublic.interceptors.response.use(
//   (response) => {
//     if (response.data?.data) {
//       response.data = decryptPayload(response.data.data);
//     }
//     return response;
//   },
//   (error) => {
//     if (error.response.status == 401) {
//       cookies.set("permission", "", {
//         path: "/",
//         maxAge: 0,
//         expires: new Date(),
//       });
//       cookies.set("refresh_token_fe", "", {
//         path: "/",
//         maxAge: 0,
//         expires: new Date(),
//       });
//       cookies.set("role", "", {
//         path: "/",
//         maxAge: 0,
//         expires: new Date(),
//       });
//       localStorage.removeItem("userStore");
//       window.location.href = "/";
//     }
//     return Promise.reject(error.response.data);
//   },
// );

// axiosSecure.interceptors.response.use(
//   (response) => {
//     if (response.data?.data) {
//       response.data = decryptPayload(response.data.data);
//     }
//     return response;
//   },
//   (error) => {
//     if (error.response.status == 401) {
//       cookies.set("permission", "", {
//         path: "/",
//         maxAge: 0,
//         expires: new Date(),
//       });
//       cookies.set("refresh_token_fe", "", {
//         path: "/",
//         maxAge: 0,
//         expires: new Date(),
//       });
//       cookies.set("role", "", {
//         path: "/",
//         maxAge: 0,
//         expires: new Date(),
//       });
//       localStorage.removeItem("userStore");
//       window.location.href = "/";
//     }
//     return Promise.reject(error.response.data);
//   },
// );

/** ------------------------------- Axios Public Functions ------------------------------- */

/**
 * Sends a GET request to the given URL.
 *
 * @param {string} url The URL of the API endpoint.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const apiGet = (url: string): Promise<AxiosResponse<any>> =>
  axiosPublic.get(url);

/**
 * Sends a POST request to the given URL with the given data.
 *
 * @param {string} url The URL of the API endpoint.
 * @param {any} data The data to be sent in the request.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const apiPost = (url: string, data: any): Promise<AxiosResponse<any>> =>
  axiosPublic.post(url, data);

/**
 * Sends a PUT request to the given URL with the given data.
 *
 * @param {string} url The URL of the API endpoint.
 * @param {any} data The data to be sent in the request.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const apiPut = (url: string, data: any): Promise<AxiosResponse<any>> =>
  axiosPublic.put(url, data);

/**
 * Sends a DELETE request to the given URL.
 *
 * @param {string} url The URL of the API endpoint.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const apiDelete = (url: string): Promise<AxiosResponse<any>> =>
  axiosPublic.delete(url);

/**
 * Sends a PATCH request to the given URL with the given data.
 *
 * @param {string} url The URL of the API endpoint.
 * @param {any} data The data to be sent in the request.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const apiPatch = (url: string, data: any): Promise<AxiosResponse<any>> =>
  axiosPublic.patch(url, data);

/** ------------------------------- Axios Private Functions ------------------------------- */

/**
 * Makes a GET request to the given URL with authentication.
 *
 * @param {string} url The URL of the API endpoint.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const apiGetSecure = (url: string): Promise<AxiosResponse<any>> =>
  axiosSecure.get(url);

/**
 * Makes a POST request to the given URL with the given data and authentication.
 *
 * @param {string} url The URL of the API endpoint.
 * @param {any} data The data to be sent in the request.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const apiPostSecure = (
  url: string,
  data: any,
): Promise<AxiosResponse<any>> => axiosSecure.post(url, data);

/**
 * Makes a PUT request to the given URL with the given data and authentication.
 *
 * @param {string} url The URL of the API endpoint.
 * @param {any} data The data to be sent in the request.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const apiPutSecure = (
  url: string,
  data: any,
): Promise<AxiosResponse<any>> => axiosSecure.put(url, data);

/**
 * Makes a DELETE request to the given URL with authentication.
 *
 * @param {string} url The URL of the API endpoint.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const apiDeleteSecure = (url: string): Promise<AxiosResponse<any>> =>
  axiosSecure.delete(url);

/**
 * Makes a PATCH request to the given URL with the given data and authentication.
 *
 * @param {string} url The URL of the API endpoint.
 * @param {any} data The data to be sent in the request.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const apiPatchSecure = (
  url: string,
  data: any,
): Promise<AxiosResponse<any>> => axiosSecure.patch(url, data);


