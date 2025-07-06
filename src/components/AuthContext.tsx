import React, {createContext, useContext, useEffect, useState} from 'react';
import Cookies from 'universal-cookie';
import Loading from "./Loading.tsx";
import {checkAct} from "../api/authApi.ts";

interface AuthContextType {
	auth: boolean;
	signIn: (act: string) => void;
	signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

	const cookies = new Cookies();

	const [auth, setAuth] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const signIn = (act: string) => {
		setAuth(true);
		cookies.set('act', act);
	}

	const signOut = () => setAuth(false);

	useEffect(() => {
		async function getAuth() {
			try {
				const act: string = cookies.get('act') || '';
				const response = await checkAct(act);
				setAuth(response.isValid);
			} catch {
				setAuth(false);
			}
			setLoading(false);
		}

		getAuth();
	}, [])

	if (loading) {
		return <Loading />;
	}

	return (
		<AuthContext.Provider
			value={{
				auth,
				signIn,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};