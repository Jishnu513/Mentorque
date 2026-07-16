import { Navigate } from "react-router-dom";

export default function Welcome() {
  // Directly redirect to the new login page
  return <Navigate to="/login" replace />;
}
