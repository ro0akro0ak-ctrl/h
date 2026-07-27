import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AdminAuthContextType {
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const ADMIN_USERNAME = 'hamza9771';
const ADMIN_PASSWORD = 'h97719771';

const AdminAuthContext =
  createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedLogin =
      localStorage.getItem('3dtech_admin_logged_in') === 'true';

    setIsAuthenticated(savedLogin);
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      if (
        username.trim() !== ADMIN_USERNAME ||
        password !== ADMIN_PASSWORD
      ) {
        throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
      }

      localStorage.setItem('3dtech_admin_logged_in', 'true');
      setIsAuthenticated(true);
    } catch (err: any) {
      const message =
        err?.message || 'حدث خطأ أثناء تسجيل الدخول';

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('3dtech_admin_logged_in');
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        loading,
        error,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error(
      'useAdminAuth must be used within AdminAuthProvider'
    );
  }

  return context;
}
