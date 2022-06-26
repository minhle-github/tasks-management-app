import { baseApi } from "../../app/api";
import { loggedOut, setCredentials } from "./authSlice";
import jwtDecode from "jwt-decode";
import { Token } from "./types";

interface TokenPayload {
  UserInfo: {
    user: string,
    roles: number[]
  }
}

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: (loginInput) => ({
        url: '/auth',
        method: 'POST',
        body: loginInput,
        credentials: 'include'
      }),
      async onQueryStarted(loginInput, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          const token = data.accessToken;
          const decoded: TokenPayload = jwtDecode(token);

          dispatch(setCredentials({
            token,
            currentUser: decoded.UserInfo.user
          }));
        } catch (err) {} // error will be handled in Login component
      }
    }),
    register: builder.mutation({
      query: (registerInput) => ({
        url: '/register',
        method: 'POST',
        body: registerInput
      })
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: '/logout',
        method: 'GET',
        credentials: 'include'
      }),
      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          await queryFulfilled;
          dispatch(loggedOut());
          dispatch(baseApi.util.resetApiState());
        } catch (err) {
          console.log(err);
        }
      }
    }),
    refresh: builder.query<Token, void>({
      query: () => ({
        url: '/refresh',
        method: 'GET',
        credentials: 'include'
      }),
      async onQueryStarted(args, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          const token = data.accessToken;
          const decoded: TokenPayload = jwtDecode(token);
          dispatch(setCredentials({
            token,
            currentUser: decoded.UserInfo.user
          }));
        } catch (err) {}
      }
    })
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshQuery
} = authApi;