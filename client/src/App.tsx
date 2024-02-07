import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css';
import Events from './routes/Events';
import Memberships from './routes/Memberships';

const router = createBrowserRouter([
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