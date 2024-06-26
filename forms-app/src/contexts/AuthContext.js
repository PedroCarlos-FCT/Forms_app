import React, { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(() => {
        const storedUser = localStorage.getItem('authUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            const expirationTime = new Date(parsedUser.stsTokenManager.expirationTime);
            if (expirationTime > new Date()) {
                return parsedUser;
            } else {
                localStorage.removeItem('authUser');
            }
        }
        return null;
    });
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
            if (user) {
                localStorage.setItem('authUser', JSON.stringify(user));
            } else {
                localStorage.removeItem('authUser');
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const updateAuthUser = (user) => {
        setAuthUser(user);
        if (user) {
            localStorage.setItem('authUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('authUser');
        }
    };

    return (
        <AuthContext.Provider value={{ authUser, updateAuthUser }}>
            {children}
        </AuthContext.Provider>
    );
}
