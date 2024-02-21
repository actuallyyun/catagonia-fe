import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { UserAuthToken, User } from '../../misc/type'
import { AppState } from '../../app/store'
import { authApi } from '../../services/auth'

const userInStorage = localStorage.getItem('userAuth')
const userAuthToken = userInStorage ? JSON.parse(userInStorage) : null

type InitialState = {
  user: User | null
  token: UserAuthToken | null
  isLoading: Boolean
  isLoggedIn: Boolean
}

const initialState: InitialState = {
  user: null,
  token: userAuthToken,
  isLoading: true,
  isLoggedIn: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: UserAuthToken }>
    ) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
    },
    logOut: (state, action: PayloadAction) => {
      state.user = null
      state.token = null
      state.isLoading = false
      state.isLoggedIn = false
      localStorage.removeItem('userAuth')
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.token = payload
          state.isLoggedIn = true
          state.isLoading = false
          localStorage.setItem('userAuth', JSON.stringify(payload))
        }
      )
      .addMatcher(
        authApi.endpoints.login.matchRejected,
        (state, { payload }) => {
          state.isLoggedIn = false
          state.isLoading = false
        }
      )
      .addMatcher(
        authApi.endpoints.getUser.matchFulfilled,
        (state, { payload }) => {
          state.user = payload
        }
      )
      .addMatcher(
        authApi.endpoints.getRefreshToken.matchFulfilled,
        (state, { payload }) => {
          state.token = payload
          localStorage.setItem('userAuth', JSON.stringify(payload))
          state.isLoggedIn = true
          state.isLoading = false
        }
      )
      .addMatcher(
        authApi.endpoints.getRefreshToken.matchRejected,
        (state, { payload }) => {
          state.isLoading = false
        }
      )
  }
})

const userReducer = userSlice.reducer
export const { setCredentials, logOut } = userSlice.actions
export default userReducer

export const selectCurrentUser = (state: AppState) => state.user.user
export const selectCurrentToken = (state: AppState) => state.user.token