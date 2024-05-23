import { useEffect } from 'react'
import Home from './pages/home/Home'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import ScrollToTop from 'react-scroll-to-top'

import Profile from './pages/account/Profile'
import Cart from './pages/cart/Cart'
import SingleProductPage from './pages/products/SingleProductPage'
import CategoryPage from './pages/category/CategoryPage'
import { useSelector } from 'react-redux'
import { AppState } from './app/store'
import PrivateRoute from './components/common/PrivateRoute'
import Auth from './pages/account/Auth'
import { useGetRefreshTokenMutation } from './services/auth'
import Nav from './components/header/Header'
import Products from './pages/products/Products'
import { useTheme } from './services/ThemeContext'
import { isFetchBaseQueryError, isErrorWithMessage } from './services/helpers'
import Footer from './components/footer/Footer'
import Checkout from './pages/checkout/Checkout'

function App() {
  const { enqueueSnackbar } = useSnackbar()

  const [refreshToken] = useGetRefreshTokenMutation()
  const { isLoggedIn, token, user } = useSelector(
    (state: AppState) => state.user
  )

  const { theme } = useTheme()

  // When page loads, if user not loggedin, and no user, but token is present, attemp to
  // refresh token.
  useEffect(() => {
    if (!isLoggedIn && !user && token) {
      refreshToken({ refreshToken: token?.refreshToken ?? '' })
    }
  }, [])

  function handleError(err: any): void {
    if (isFetchBaseQueryError(err)) {
      const errMsg = 'error' in err ? err.error : JSON.stringify(err.data)
      enqueueSnackbar(errMsg, { variant: 'error' })
    } else if (isErrorWithMessage(err)) {
      enqueueSnackbar(err.message, { variant: 'error' })
    } else {
      enqueueSnackbar('unkown error', { variant: 'error' })
    }
  }
  const handleSuccess = (message: string) => {
    enqueueSnackbar(message, { variant: 'success' })
  }

  const feedback = {
    handleError,
    handleSuccess
  }
  return (
    <div className={` ${theme} `}>
      <div className=' dark:bg-black'>
        <div className='container'>
          <Nav />
          <div className='py-8 md:py-12  dark:bg-black'>
            <Routes>
              <Route path='/' element={<Home />}></Route>
              <Route path='/shop' element={<Navigate to={'/'} />}></Route>
              <Route
                path='/product'
                element={<Products feedback={feedback} />}
              ></Route>
              <Route
                path='/product/:productId'
                element={<SingleProductPage feedback={feedback} />}
              />
              <Route
                path='/shop/:categoryId'
                element={<CategoryPage feedback={feedback} />}
              />
              <Route
                path='/account'
                element={
                  <PrivateRoute>
                    <Profile feedback={feedback} />
                  </PrivateRoute>
                }
              />
              <Route
                path='/auth'
                element={
                  isLoggedIn ? (
                    <Navigate to={'/account'} />
                  ) : (
                    <Auth feedback={feedback} />
                  )
                }
              ></Route>
              <Route path='/cart' element={<Cart />}></Route>
              <Route
                path='/checkout'
                element={<Checkout feedback={feedback} />}
              ></Route>
            </Routes>
            <ScrollToTop smooth />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default App
