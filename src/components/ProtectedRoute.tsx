import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

interface ProtectedComponentProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedComponentProps> = ({ children }) => {
  const { key, secret } = useSelector((state: any) => state.user);

  return key && secret ? (
    <>{children}</>
  ) : (
    <Navigate to="/" replace />
  );
}

export default ProtectedRoute;