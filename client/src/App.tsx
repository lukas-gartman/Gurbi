import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './stylesheets/App.css';
import Events from './routes/Events';
import Event from './routes/Event';
import Memberships from './routes/Memberships';
import Login from './routes/Login';
import CreateAccount from './routes/CreateAccount';
import Organisation from './routes/Organisation';
import axios from 'axios';

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
		element: <Events />,
		// loader: async ({ params }) => {
		// 	return axios.get(`/api/events`);
		// }
	},
	{
		path: "/events/:eventId",
		element: <Event />,
		loader: async({ params }) => {
			// return axios.get(`/api/events/${params.eventId}`);
			return JSON.parse('{"id":' + params.eventId + ', "location": "Studenternas Hus", "dateTime": "19:00", "name": "Semlesittning", "description": "come and eat semlor with us lol"}');
		}
	},
	{
		path: "/memberships",
		element: <Memberships />,
		// loader: async ({ params }) => {
		// 	return axios.get(`/api/memberships`);
		// }
	},
	// {
	// 	path: "/organisations",
	// 	element: <Organisations />,
	// 	loader: async({ params }) => {
	// 		return axios.get(`/api/organisations`);
	// 	}
	// },
	{
		path: "/organisations/:orgId",
		element: <Organisation />,
		loader: async ({ params }) => {
			// return axios.get(`/api/organisations/${params.orgId}`);
			return JSON.parse('{"id":'+params.orgId+', "name": "Mega6", "picture": ""}');
		}
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
