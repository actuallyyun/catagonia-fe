import userReducer from './userSlice'
import { InitialState, setCredentials, logOut } from './userSlice'

import authApi from '../../services/auth'
import store from '../../app/store'
import {
  mockAuthToken,
  userLoginRequest,
  mockUserInfo,
  mockRefreshedAuthToken
} from '../../tests/mockServer'
import { mockServer as server } from '../../tests/mockServer'

const initialState: InitialState = {
  user: null,
  token: null,
  isLoading: false,
  isLoggedIn: false
}

const loggedInState: InitialState = {
  user: mockUserInfo,
  token: mockAuthToken,
  isLoading: false,
  isLoggedIn: true
}

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

beforeEach(() => {
  store.dispatch(logOut())
})

describe('userSlice', () => {
  test('it should have default state', async () => {
    const state = userReducer(undefined, { type: '' })
    expect(state).toEqual(initialState)
  })
  test('token state should be updated', async () => {
    const stateWithToken = {
      ...initialState,
      token: mockAuthToken
    }
    const state = userReducer(stateWithToken, { type: '' })
    expect(state.token).toEqual(mockAuthToken)
  })
  test('setCredentials should update state', () => {
    const state = userReducer(
      initialState,
      setCredentials({ user: mockUserInfo, token: mockAuthToken })
    )
    expect(state.user).toEqual(mockUserInfo)
    expect(state.token).toEqual(mockAuthToken)
    expect(state.isLoading).toBeFalsy()
    expect(state.isLoggedIn).toBeTruthy()
  })
  test('logOut should update state', () => {
    const state = userReducer(loggedInState, logOut())
    expect(state.isLoggedIn).toBeFalsy()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isLoading).toBeFalsy()
  })
  test('login API on success should update state', async () => {
    await store.dispatch(authApi.endpoints.login.initiate(userLoginRequest))
    const state = store.getState()
    expect(state.user.token).toEqual(mockAuthToken)
    expect(state.user.isLoggedIn).toBeTruthy()
  })
  test('login API on failure should update state', async () => {
    await store.dispatch(
      authApi.endpoints.login.initiate({ email: 'user2', password: '' })
    )
    const state = store.getState()
    expect(state.user.token).toEqual(null)
    expect(state.user.isLoggedIn).toBeFalsy()
  })
  test('getUser API on success should update state', async () => {
    store.dispatch(setCredentials({ user: null, token: mockAuthToken }))
    await store.dispatch(authApi.endpoints.getUser.initiate())
    const state = store.getState()
    expect(state.user.isLoggedIn).toBeTruthy()
    expect(state.user.user).toEqual(mockUserInfo)
  })
  test('getUser API on failure should update state', async () => {
    await store.dispatch(authApi.endpoints.getUser.initiate())
    const state = store.getState()

    expect(state.user.isLoggedIn).toBeFalsy()
    expect(state.user.user).toBeNull()
  })
  test('getRefreshToken API on success should update state', async () => {
    await store.dispatch(
      authApi.endpoints.getRefreshToken.initiate({
        refreshToken: mockAuthToken.refreshToken
      })
    )
    const state = store.getState()
    expect(state.user.token).toEqual(mockRefreshedAuthToken)
    expect(state.user.isLoggedIn).toBeTruthy()
  })
  test('getRefreshToken API on failure should update state', async () => {
    await store.dispatch(
      authApi.endpoints.getRefreshToken.initiate({
        refreshToken: 'wrong token'
      })
    )
    const state = store.getState()
    expect(state.user.token).toBeNull()
    expect(state.user.user).toBeNull()
    expect(state.user.isLoggedIn).toBeFalsy()
  })
})
