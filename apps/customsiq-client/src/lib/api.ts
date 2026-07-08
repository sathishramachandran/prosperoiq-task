import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
} from "axios";

/**
 * Silent token refresh
 * ----------------------
 * The SSO sets an HttpOnly `access_token` cookie. When a request 401s we
 * call `POST {SSO}/api/auth/refresh` (which uses the HttpOnly `refresh_token`
 * cookie to mint a new access cookie), then retry the original request once.
 *
 * The refresh call itself is shared across concurrent 401s via a singleton
 * promise — no thundering-herd of refreshes.
 */

let refreshPromise: Promise<void> | null = null;

async function refreshTokens(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${process.env.AUTH_URL}/api/auth/refresh`,
        {},
        { withCredentials: true },
      )
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Installs the 401-refresh-retry interceptor on any axios instance.
 *
 * Apply this to every instance that talks to the CustomsIQ backend or SSO
 * so the silent-refresh flow fires regardless of which instance was used.
 */
export function installAuthRefreshInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use(
    (r) => r,
    async (error: AxiosError) => {
      const original = error.config as
        | (AxiosRequestConfig & { _retried?: boolean })
        | undefined;

      // Skip:
      //  - non-401 errors
      //  - requests we've already retried
      //  - the refresh call itself (would otherwise infinite-loop)
      //  - requests with no config (network errors, etc.)
      if (
        !original ||
        error.response?.status !== 401 ||
        original._retried ||
        original.url?.includes("/api/auth/refresh")
      ) {
        return Promise.reject(error);
      }
      original._retried = true;

      try {
        await refreshTokens();
        return instance(original); // retry with the new access cookie
      } catch {
        return Promise.reject(error); // refresh failed — caller redirects
      }
    },
  );
}

/**
 * Shared CustomsIQ instance. Prefer this for new code.
 * Existing code that goes through `lib/api_services.ts` is also covered —
 * those instances have the same interceptor installed.
 */
export const api = axios.create({
  baseURL: process.env.AUTH_URL,
  withCredentials: true,
});

installAuthRefreshInterceptor(api);
