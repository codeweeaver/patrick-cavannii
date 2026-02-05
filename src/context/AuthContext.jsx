import { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLoading } from '../hooks/useLoading';
import { api } from '../utils/index';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user')) || null,
  );
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem('token') || sessionStorage.getItem('token')) || null,
  );
  const [error, setError] = useState(null);
  const { startLoading, stopLoading } = useLoading();

  console.log(api);

  const userRef = useRef(user);
  userRef.current = user;

  const registerUser = useCallback(
    async (userData) => {
      startLoading();
      try {
        const responseData = await api.post('users/register/', userData, {
          includeAuth: false,
        });
        if (responseData) {
          setUser(responseData.user || responseData);
          localStorage.setItem('user', JSON.stringify(responseData.user || responseData));
          toast.success('User registered successfully.');
        }
        return responseData;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  const loginUser = useCallback(
    async (email, password, rememberMe = false) => {
      startLoading();
      try {
        const { data: responseData } = await api.post(
          '/users/login/',
          { email, password },
          { includeAuth: false },
        );
        console.log(responseData);
        if (!responseData || !responseData.token || !responseData.user) {
          throw new Error('Invalid email or password');
        }

        // 2. Update state using the collected object
        setUser(responseData.user);
        setToken(responseData.token);

        // 4. Persistence
        // Clear both storages first to ensure no stale data remains
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(responseData.user));
        storage.setItem('token', JSON.stringify(responseData.token));
        toast.success('Logged in successfully.');
      } catch (error) {
        const message = error.response?.data?.message || error.message || 'Login failed';
        setError(message);
        if (error.message === 'Invalid email or password' || !error.response) {
          toast.error(message);
        }
        throw error;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  const logOut = useCallback(async () => {
    try {
      // 1. Added the trailing slash: '/users/logout/'
      // 2. Axios doesn't use '.ok', it throws if the request fails
      await api.post('/users/logout/', null, { includeAuth: true });

      toast.success('Logged out successfully.');
    } catch (error) {
      // We log the error, but we don't block the UI cleanup
      console.error('Server-side logout error:', error.message);
    } finally {
      // 3. Always clear the session locally
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    }
  }, []);

  const deleteUser = useCallback(
    async (id) => {
      startLoading();
      try {
        await api.delete(`/users/${id}`);

        if (user?.id === id) {
          await logOut();
        }

        toast.success('User deleted successfully.');
        return true;
      } catch (error) {
        const message = error.message || 'Failed to delete user';
        setError(message);
        toast.error(message);
        return false;
      } finally {
        stopLoading();
      }
    },
    [user, logOut, startLoading, stopLoading],
  );

  const updateUser = useCallback(
    async (id, updatedUser) => {
      startLoading();
      try {
        const res = await api.patch(`/users/${id}`, updatedUser);

        // Update local state with the response from server
        setUser(res);

        // Update storage (check which one is currently in use)
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(res));

        toast.success('User updated successfully.');
        return true;
      } catch (error) {
        const message = error.message || 'Failed to update user';
        setError(message);
        toast.error(message);
        return false;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  const addToHistory = useCallback(async (type, id) => {
    const currentUser = userRef.current;
    if (!currentUser) return;

    const currentHistory = currentUser.history?.[type] || [];

    // Move to front if exists, otherwise just add to front
    const updatedTypeHistory = [id, ...currentHistory.filter((itemId) => itemId !== id)].slice(
      0,
      20,
    );

    const updatedUser = {
      ...currentUser,
      history: {
        ...currentUser.history,
        [type]: updatedTypeHistory,
      },
    };

    // Optimistically update UI
    setUser(updatedUser);

    // Persist to backend
    try {
      await api.patch(`/users/${currentUser.id}`, { history: updatedUser.history });
    } catch (error) {
      console.error('Failed to sync history with server', error);
    }
  }, []);

  const verifyCurrentPassword = useCallback(
    async (password) => {
      try {
        if (!user?.id) return false;
        // Fetch fresh user data to check password
        const res = await api.get(`/users/${user.id}`);
        // Compare plain text passwords (since that's how they are stored in this mock setup)
        return res.password === password;
      } catch (error) {
        console.error('Password verification failed:', error);
        return false;
      }
    },
    [user],
  );

  const changePassword = useCallback(
    async (currentPassword, newPassword) => {
      const isValid = await verifyCurrentPassword(currentPassword);
      if (!isValid) throw new Error('Incorrect current password');

      return await updateUser(user.id, { password: newPassword });
    },
    [verifyCurrentPassword, updateUser, user],
  );

  // This listener is now the SINGLE source of truth

  const authValue = useMemo(
    () => ({
      user,
      token,
      registerUser,
      loginUser,
      deleteUser,
      updateUser,
      logOut,
      error,
      addToHistory,
      verifyCurrentPassword,
      changePassword,
    }),
    [
      user,
      error,
      token,
      registerUser,
      loginUser,
      logOut,
      addToHistory,
      deleteUser,
      updateUser,
      verifyCurrentPassword,
      changePassword,
    ],
  );

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
