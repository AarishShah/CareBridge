import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

const useLogout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    return useCallback(() => {
        logout(navigate);
    }, [logout, navigate]);
};

export default useLogout;
