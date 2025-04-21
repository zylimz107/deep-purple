import { useAuth } from "react-oidc-context";

const useAuthToken = () => {
  const { user } = useAuth();
  return user?.access_token;
};
export default useAuthToken;