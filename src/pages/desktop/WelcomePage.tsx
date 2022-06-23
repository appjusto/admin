import { useContextFirebaseUser } from "app/state/auth/context";
import { Redirect } from "react-router-dom";
import { Loading } from "common/components/Loading";


export const WelcomePage = () => {
  // context
  const { user } = useContextFirebaseUser();
  // UI
  if(user) return <Redirect to="/app" />;
  else if(user === null) return <Redirect to="/login" />;
  return <Loading/>;
};