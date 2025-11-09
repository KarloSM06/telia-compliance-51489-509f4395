// Stub hook - auth removed from public site
export const useAuth = () => {
  return {
    user: null,
    session: null,
    loading: false,
    signOut: async () => {},
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
