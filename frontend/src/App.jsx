import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/auth/login/LogInPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";

import Sidebar from "./components/common/Sidebar";

import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/common/LoadingSpinner";
import useAuthUser from "./hooks/useAuthUser";

function App() {
	const { data: authUser, isLoading } = useAuthUser();

	if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

	return (
		<div className='flex max-w-6xl mx-auto'>
			{authUser && <Sidebar />}
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
