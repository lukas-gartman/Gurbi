import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import Events from './routes/Events';
import Memberships from './routes/Memberships';
import Login from './routes/Login';
import CreateAccount from './routes/CreateAccount';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Login />
	},
	{
		path: "/register",
		element: <CreateAccount />
	},
	{
		path: "/events",
		element: <Events />
	},
	{
		path: "/memberships",
		element: <Memberships />
	}
]);

function App() {
	return (
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	);
}

export default App;
