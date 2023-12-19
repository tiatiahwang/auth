import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCookieToken, removeCookieToken } from './cookies';
import { removeAccessToken, setAccessToken } from '../redux/auth/authSlice';
import { requestToken } from '../api/auth';

export function VerifyToken(key) {
  const dispatch = useDispatch();
  const { isAuthenticated, expireTime } = useSelector((state) => state.auth);
  const [isAuth, setIsAuth] = useState(isAuthenticated);
  const refreshToken = getCookieToken();

  useEffect(() => {
    const checkToken = async () => {
      if (refreshToken === undefined) {
        dispatch(removeAccessToken());
        setIsAuth(isAuthenticated);
      } else {
        setIsAuth(isAuthenticated);

        if (isAuthenticated && new Date().getTime() < expireTime) {
          setIsAuth(isAuthenticated);
        } else {
          const response = await requestToken(refreshToken);

          if (response.status) {
            dispatch(setAccessToken(response.data.accessToken));
            setIsAuth(isAuthenticated);
            return;
          } else {
            dispatch(removeAccessToken());
            removeCookieToken();
            setIsAuth(isAuthenticated);
          }
        }
      }
    };
    checkToken();
  }, [refreshToken, dispatch, key, isAuthenticated]);
  return {
    isAuth,
  };
}
