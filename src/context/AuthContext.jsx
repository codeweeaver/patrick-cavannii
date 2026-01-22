import { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLoading } from '../hooks/useLoading';
import { apiClient } from '../utils/apiClient';

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

  const userRef = useRef(user);
  userRef.current = user;

  const loginUser = useCallback(
    async (email, password, rememberMe = false) => {
      startLoading();
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users`);

        if (!res.ok) {
          throw new Error(`Invalid Credientials`);
        }
        const data = await res.json();

        const foundUser = data.find((u) => u.email === email && u.password === password);

        if (!foundUser) {
          throw new Error('Invalid email or password');
        }

        const {
          password: _password,
          comfirmPassword: _comfirmPassword,
          createdAt: _createdAt,
          ...userWithoutPassword
        } = foundUser;

        setUser(userWithoutPassword);

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(userWithoutPassword));

        const newToken = `sample-token-${Date.now()}`;
        setToken(newToken);
        storage.setItem('token', JSON.stringify(newToken));

        toast.success('Logged in successfully.');
        return userWithoutPassword;
      } catch (error) {
        const message = error.message || 'Login failed';
        toast.error(message);
        throw error; // <-- Crucial: Re-throw the error
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  const logOut = useCallback(async () => {
    try {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Error logging out.');
    }
  }, []);

  const deleteUser = useCallback(
    async (id) => {
      try {
        startLoading();
        await apiClient.delete(`/users/${id}`);

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
    [startLoading, stopLoading, user, logOut],
  );

  const updateUser = useCallback(
    async (id, updatedUser) => {
      try {
        startLoading();
        const res = await apiClient.patch(`/users/${id}`, updatedUser);

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
      await apiClient.patch(`/users/${currentUser.id}`, {
        history: updatedUser.history,
      });
    } catch (error) {
      console.error('Failed to sync history with server', error);
    }
  }, []);

  // This listener is now the SINGLE source of truth

  const authValue = useMemo(
    () => ({
      user,
      loginUser,
      deleteUser,
      updateUser,
      logOut,
      token,
      error,
      addToHistory,
    }),
    [user, token, error, loginUser, logOut, addToHistory, deleteUser, updateUser],
  );

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
