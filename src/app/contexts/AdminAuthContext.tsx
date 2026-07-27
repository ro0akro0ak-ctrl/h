import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../utils/supabase';

interface AdminAuthContextType {
  session: Session | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AdminAuthContext =
  createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verifyAdmin = async (
    currentSession: Session | null
  ): Promise<boolean> => {
    if (!currentSession?.user?.id) {
      return false;
    }

    const { data, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', currentSession.user.id)
      .maybeSingle();

    if (adminError) {
      console.error('Admin verification error:', adminError);
      return false;
    }

    return Boolean(data);
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);

        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        const isAdmin = await verifyAdmin(currentSession);

        if (!mounted) return;

        if (currentSession && !isAdmin) {
          await supabase.auth.signOut();
          setSession(null);
          setError('هذا الحساب غير مصرح له بدخول لوحة التحكم');
        } else {
          setSession(currentSession);
        }
      } catch (err: any) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setSession(null);
          setError('تعذر التحقق من جلسة تسجيل الدخول');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setTimeout(async () => {
        if (!mounted) return;

        if (!newSession) {
          setSession(null);
          setLoading(false);
          return;
        }

        setLoading(true);

        const isAdmin = await verifyAdmin(newSession);

        if (!mounted) return;

        if (isAdmin) {
          setSession(newSession);
          setError(null);
        } else {
          await supabase.auth.signOut();
          setSession(null);
          setError('هذا الحساب غير مصرح له بدخول لوحة التحكم');
        }

        setLoading(false);
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        if (loginError.message.toLowerCase().includes('invalid login')) {
          throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }

        throw loginError;
      }

      if (!data.session) {
        throw new Error('تعذر إنشاء جلسة تسجيل الدخول');
      }

      const isAdmin = await verifyAdmin(data.session);

      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error('هذا الحساب غير مصرح له بدخول لوحة التحكم');
      }

      setSession(data.session);
      setError(null);
    } catch (err: any) {
      const message =
        err?.message || 'حدث خطأ أثناء تسجيل الدخول';

      setSession(null);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) {
        throw logoutError;
      }

      setSession(null);
    } catch (err: any) {
      const message =
        err?.message || 'حدث خطأ أثناء تسجيل الخروج';

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        session,
        loading,
        error,
        login,
        logout,
        isAuthenticated: Boolean(session),
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
