import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

export function RequireAuth({ children }) {
    const {isLoggedIn} = useSelector(state => state.AppReducer);
    if (!isLoggedIn) {
      return <Redirect to="/login"/>;
    } else {
      return children;
    }
  }