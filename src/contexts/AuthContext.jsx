import { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../config/supabase.js';
import { DEMO_USERS } from '../utils/nepalData.js';

const AuthContext = createContext(null);

const STORAGE_SESSION_KEY = 'kc_active_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isSandboxMode, setIsSandboxMode] = useState(!isSupabaseConfigured);

  // Initialize session
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (session?.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (mounted) {
              const mergedUser = {
                id: session.user.id,
                email: session.user.email,
                role: profile?.role || session.user.user_metadata?.role || 'farmer',
                fullName: profile?.full_name || session.user.user_metadata?.full_name || session.user.email.split('@')[0],
                phone: profile?.phone || session.user.user_metadata?.phone || '',
                province: profile?.province || 'Bagmati Province',
                district: profile?.district || 'Kathmandu',
                municipality: profile?.municipality || '',
                isVerified: profile?.is_verified ?? false,
              };
              setUser(mergedUser);
              setRole(mergedUser.role);
              setIsSandboxMode(false);
            }
          } else {
            // Check if saved sandbox user exists
            loadSavedSandboxUser();
          }

          // Listen for Supabase auth state changes
          supabase.auth.onAuthStateChange(async (event, newSession) => {
            if (newSession?.user) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', newSession.user.id)
                .single();

              const updatedUser = {
                id: newSession.user.id,
                email: newSession.user.email,
                role: profile?.role || newSession.user.user_metadata?.role || 'farmer',
                fullName: profile?.full_name || newSession.user.user_metadata?.full_name || newSession.user.email.split('@')[0],
                phone: profile?.phone || '',
                province: profile?.province || 'Bagmati Province',
                district: profile?.district || 'Kathmandu',
                isVerified: profile?.is_verified ?? false,
              };
              setUser(updatedUser);
              setRole(updatedUser.role);
              setIsSandboxMode(false);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setRole(null);
              localStorage.removeItem(STORAGE_SESSION_KEY);
            }
          });
        } else {
          // Supabase is not configured yet - load default or stored demo user
          loadSavedSandboxUser();
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        loadSavedSandboxUser();
      } finally {
        if (mounted) setLoading(false);
      }
    }

    function loadSavedSandboxUser() {
      try {
        const stored = localStorage.getItem(STORAGE_SESSION_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setRole(parsed.role);
        } else {
          // Default to the Farmer profile for initial demonstration
          const defaultFarmer = DEMO_USERS.farmer;
          setUser(defaultFarmer);
          setRole(defaultFarmer.role);
          localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(defaultFarmer));
        }
      } catch {
        setUser(DEMO_USERS.farmer);
        setRole('farmer');
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    setAuthError(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        return { success: true, user: data.user };
      } else {
        // Find matching demo user or create session
        const matchingRole = Object.keys(DEMO_USERS).find(
          (k) => DEMO_USERS[k].email.toLowerCase() === email.toLowerCase()
        );
        const loggedUser = matchingRole
          ? DEMO_USERS[matchingRole]
          : {
              id: `usr-${Date.now()}`,
              email,
              fullName: email.split('@')[0],
              role: 'farmer',
              phone: '+977-9800000000',
              province: 'Bagmati Province',
              district: 'Kathmandu',
              isVerified: true
            };

        setUser(loggedUser);
        setRole(loggedUser.role);
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(loggedUser));
        return { success: true, user: loggedUser };
      }
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check credentials.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Registration handler
  const register = async ({ email, password, role = 'farmer', fullName, phone, district, province, extraDetails = {} }) => {
    setAuthError(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
              full_name: fullName,
              phone,
              district: district || 'Kathmandu',
              province: province || 'Bagmati Province',
              ...extraDetails,
            },
          },
        });
        if (error) throw error;
        return { success: true, user: data.user };
      } else {
        const newUser = {
          id: `usr-${Date.now()}`,
          email,
          fullName,
          role,
          phone,
          district: district || 'Kathmandu',
          province: province || 'Bagmati Province',
          isVerified: false,
          joinedDate: 'Just now',
          ...extraDetails,
        };
        setUser(newUser);
        setRole(role);
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
    } catch (err) {
      setAuthError(err.message || 'Registration failed.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      localStorage.removeItem(STORAGE_SESSION_KEY);
      setUser(null);
      setRole(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Password reset
  const resetPassword = async (email) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?reset=true`,
      });
      if (error) throw error;
      return { success: true };
    }
    // Simulation in sandbox mode
    return { success: true, message: `Password reset instructions sent to ${email} (Demonstration mode)` };
  };

  // Profile update
  const updateProfile = async (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    if (!isSupabaseConfigured) {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(updated));
    } else if (supabase) {
      await supabase
        .from('profiles')
        .update({
          full_name: updated.fullName,
          phone: updated.phone,
          district: updated.district,
          province: updated.province,
          municipality: updated.municipality,
          bio: updated.bio
        })
        .eq('id', user.id);
    }
    return { success: true, user: updated };
  };

  // Sandbox Role Switcher for instant testing across all 4 dashboards
  const switchSandboxRole = (targetRole) => {
    if (DEMO_USERS[targetRole]) {
      const targetUser = DEMO_USERS[targetRole];
      setUser(targetUser);
      setRole(targetRole);
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(targetUser));
      return targetUser;
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        authError,
        isSupabaseConfigured,
        isSandboxMode,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        switchSandboxRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
