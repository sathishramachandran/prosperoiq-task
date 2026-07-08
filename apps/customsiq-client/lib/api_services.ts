import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Cookies } from "react-cookie";
import toast from "react-hot-toast";
import { installAuthRefreshInterceptor } from "@/src/lib/api";
import { usePermissionStore } from "@/src/store/permission";
// import { decryptPayload, encryptPayload } from "./encryption";
/**
 * The base URL for the API endpoints.
 */
export const apiEndPoint = process.env.AUTH_URL + "/api";

export const apiFileEndPoint = process.env.CUSTOMS_URL + "/api/v1";

const axiosCustoms = axios.create({
  baseURL: apiFileEndPoint,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});

/**
 * 403 handler — independent of the silent-refresh flow. Installed before the
 * refresh interceptor so it sees 403s as-is. (Interceptors run in LIFO order
 * for errors; the last-installed handler runs first.)
 *
 * Backend returns either:
 *  - structured detail: { code: "PERMISSION_DENIED", message, resource, action }
 *  - legacy string detail
 *
 * For structured `read` denials we surface a full-screen "Access Denied" page
 * via the permission store. For other actions (write/delete/etc.) we toast,
 * so the user stays on the current page.
 */
function install403Handler(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 403) {
        const detail = error.response.data?.detail;

        if (
          detail &&
          typeof detail === "object" &&
          detail.code === "PERMISSION_DENIED"
        ) {
          const action = String(detail.action || "").toLowerCase();
          const isReadDenial = action === "read" || action === "";

          if (isReadDenial) {
            usePermissionStore.getState().setPermissionError({
              code: detail.code,
              resource: detail.resource || "",
              action: detail.action || "",
              message:
                detail.message ||
                "You don't have permission to access this page.",
            });
          } else {
            toast.error(
              detail.message ||
                "You don't have permission to perform this action",
            );
          }
        } else {
          toast.error(
            typeof detail === "string"
              ? detail
              : "You don't have permission to perform this action",
          );
        }
      }
      return Promise.reject(error);
    },
  );
}

install403Handler(axiosCustoms);
installAuthRefreshInterceptor(axiosCustoms);

export const axiosFileSecure = axios.create({
  baseURL: apiFileEndPoint,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
    "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },  
});
export const axiosFileBlob = axios.create({
  baseURL: apiFileEndPoint,
  withCredentials: true,
  responseType: 'blob',
  headers: {
    Accept: "application/pdf, application/json",
    "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});

installAuthRefreshInterceptor(axiosFileSecure);
installAuthRefreshInterceptor(axiosFileBlob);

const axiosPublic = axios.create({
  baseURL: apiEndPoint,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
});

installAuthRefreshInterceptor(axiosPublic);

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
export const apiGetCustoms = (url: string): Promise<AxiosResponse<any>> =>
  axiosCustoms.get(url);

/**
 * Makes a POST request to the given URL with the given data and authentication.
 *
 * @param {string} url The URL of the API endpoint.
 * @param {any} data The data to be sent in the request.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const apiPostCustoms = (
  url: string,
  data: any,
): Promise<AxiosResponse<any>> => axiosCustoms.post(url, data);

/**
 * Makes a PUT request to the given URL with the given data and authentication.
 *
 * @param {string} url The URL of the API endpoint.
 * @param {any} data The data to be sent in the request.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const apiPutCustoms = (
  url: string,
  data: any,
): Promise<AxiosResponse<any>> => axiosCustoms.put(url, data);

/**
 * Makes a DELETE request to the given URL with authentication.
 *
 * @param {string} url The URL of the API endpoint.
 * @returns {Promise<AxiosResponse<any>>}
 */
export const apiDeleteCustoms = (url: string): Promise<AxiosResponse<any>> =>
  axiosCustoms.delete(url);

/**
 * Makes a PATCH request to the given URL with the given data and authentication.
 *
 * @param {string} url The URL of the API endpoint.
 * @param {any} data The data to be sent in the request.
 * @returns {Promise<AxiosResponse<any>>}
 */

/**
 * Makes a GET request to the given URL with the given data and authentication.
 * @param {string} url The URL of the API endpoint.
 * @returns {Promise<AxiosResponse<any>>}
 */
// export const apiPostFile = async (
//   url: string,
//   data:any
// ): Promise<AxiosResponse<any>> => {
//  axiosFileSecure.post(url ,data);
// };

export const apiPostFile = (
  url: string,
  data: any,
): Promise<AxiosResponse<any>> => {
  return axiosFileSecure.post(url, data);
};


export const apiGetBlob = (url: string): Promise<AxiosResponse<any>> =>
  axiosFileBlob.get(url);

export const apiPostBlob = (url: string , data:any): Promise<AxiosResponse<any>> =>
  axiosFileBlob.post(url ,data );

