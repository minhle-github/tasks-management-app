import { createSelector, createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { baseApi } from "../../app/api";
import { RootState } from "../../app/store";
import { User, UsersResponse } from "./types";

const usersAdapter = createEntityAdapter<User>({
  selectId: (user) => user._id
});

const initialState = usersAdapter.getInitialState();

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<User>, void>({
      query: () => ({
        url: '/users',
        credentials: 'include'
      }),
      transformResponse: (responseData: UsersResponse ) => {
        return usersAdapter.setAll(initialState, responseData);
      },
      providesTags: (result, error, arg) => 
        result 
        ? [
        {type: 'User', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'User' as const, id }))
        ] 
        : [{type: 'User', id: 'LIST'}]
    })
  })
})

export const {
  useGetUsersQuery
} = usersApi;

const selectUsersResult = usersApi.endpoints.getUsers.select();
const selectUsersData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data
)

export const {
  selectAll: selectAllUsers,
  selectIds: selectUserIds,
  selectById: selectUserById
} = usersAdapter.getSelectors<RootState>(state => selectUsersData(state) ?? initialState);
