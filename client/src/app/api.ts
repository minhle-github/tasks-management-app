import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError
} from "@reduxjs/toolkit/query/react";
import { tokenReceived, loggedOut } from '../features/auth/authSlice';
import type { RootState } from "./store";
import { Mutex } from "async-mutex";
import { Token } from "../features/auth/types";

// create a new mutex
const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include'
});
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 403) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          '/refresh',
          api,
          extraOptions
        )
        const token: Token = refreshResult.data as Token;
        if (token) {
          api.dispatch(tokenReceived(token));
          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(loggedOut()) ;
        }
      } finally {
        // release must be called once the mutex should be released again
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
}

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: ['User']
})