import { isAxiosError } from 'axios';
import { enqueueSnackbar } from 'notistack';
import { configureAuth } from 'react-query-auth';
import { Navigate, useLocation } from 'react-router-dom';
import { z } from 'zod';

import { paths } from '@/config/paths';
import { AuthResponse, User } from '@/types/api';

import { attachToken, loginApi } from './api-client';

const getUser = async (): Promise<User> => {
  try {
    const response = await loginApi.get('/api/v1/users/me', {
      headers: attachToken().headers,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      const searchParams = new URLSearchParams();
      const redirectTo = searchParams.get('redirectTo') ?? window.location.pathname;

      if (window.location.pathname === paths.auth.login.path) {
        return Promise.resolve({} as User);
      } else {
        window.location.href = paths.auth.login.getHref(redirectTo);
      }
    }

    return Promise.reject(error);
  }
};

const logout = async (): Promise<void> => {
  localStorage.removeItem('accessToken');
  window.location.href = paths.auth.login.getHref();
};

export const loginInputSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(3, 'Required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithEmailAndPassword = async (data: LoginInput): Promise<User> => {
  try {
    const response = await loginApi.post<AuthResponse>('/api/v1/auth/login', null, {
      params: data,
    });
    localStorage.setItem('accessToken', response.data.id_token);
    return getUser();
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      enqueueSnackbar('Provided credentials are invalid', {
        variant: 'error',
        preventDuplicate: true,
      });
    }

    return Promise.reject(error);
  }
};

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => {
    return await loginWithEmailAndPassword(data);
  },
  registerFn: async () => {
    return {} as User;
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, AuthLoader } = configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();

  if (!user.data) {
    return <Navigate to={paths.auth.login.getHref(location.pathname)} replace />;
  }

  return children;
};
