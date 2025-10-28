export interface User {
  email: string;
  name: string;
}

export const useAuth = () => {
  const login = (
    email: string,
    password: string
  ): { success: boolean; error?: string; user?: User } => {
    const mockUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    if (email === mockUser.email && password === mockUser.password) {
      const token = btoa(`${email}:${Date.now()}`);
      localStorage.setItem('ticketapp_session', token);
      localStorage.setItem(
        'ticketapp_user',
        JSON.stringify({ email: mockUser.email, name: mockUser.name })
      );
      return {
        success: true,
        user: { email: mockUser.email, name: mockUser.name },
      };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (
    name: string,
    email: string,
    password: string
  ): { success: boolean; error?: string } => {
    if (!name || !email || !password) {
      return { success: false, error: 'All fields are required' };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters',
      };
    }

    const token = btoa(`${email}:${Date.now()}`);
    localStorage.setItem('ticketapp_session', token);
    localStorage.setItem('ticketapp_user', JSON.stringify({ email, name }));
    return { success: true };
  };

  const logout = (): void => {
    localStorage.removeItem('ticketapp_session');
    localStorage.removeItem('ticketapp_user');
  };

  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('ticketapp_session');
  };

  const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('ticketapp_user');
    return userStr ? JSON.parse(userStr) : null;
  };

  return {
    login,
    signup,
    logout,
    isAuthenticated,
    getCurrentUser,
  };
};
