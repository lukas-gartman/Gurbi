import React, { useEffect } from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation, useNavigate } from "react-router-dom";
import './stylesheets/App.css';
import Events from './routes/Events';
import Event from './routes/Event';
import Organisations from './routes/Organisations';
import Organisation from './routes/Organisation';
import Login from './routes/Login';
import CreateAccount from './routes/CreateAccount';
import Profile from './routes/Profile';
import Settings from './routes/Settings';
import NewEvent from './routes/NewEvent';
import axios from 'axios';
import Cookie from 'js-cookie';

const AuthGuard = () => {
	const jwt = Cookie.get("jwt");

	if (jwt === undefined) {
		console.log("User not logged in. Redirecting from " + window.location.pathname + "to /login ...");
		return <Navigate to="/login" replace />;
	}

	const isValid = async () : Promise<boolean> => {
		const response = await axios.post("http://localhost:8080/user/validate", { token: jwt });
		return response.data.valid;
	}

	isValid().then(isValid => {
		if (isValid) {
			// Send the jwt token for all requests
			axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
		} else {
			console.log("User token is not valid. Redirecting from " + window.location.pathname + "to /login ...");
			return <Navigate to="/login" replace />;
		}
	});
	
	// useEffect(() => {
		
	// }, []);

	return <Outlet />;
}

const Logout = () => {
	Cookie.remove("jwt");
	return <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
	{
		path: "/",
		element: <AuthGuard />,
		children: [
			{
				index: true,
				element: <Navigate to="/events" replace />
			},
			{
				path: "/events",
				element: <Events />,
				loader: async ({ params }) => {
				// 	return axios.get(`/organisation/events`);
					return JSON.parse('[{"id": 1, "location": "Studenternas Hus", "dateTime": "19:00", "name": "Semlesittning"}, {"id": 2, "location": "Monaden", "dateTime": "18:30", "name": "Mega6 Sittning"}]');
				}
			},
			{
				path: "/events/:eventId",
				element: <Event />,
				loader: async ({ params }) => {
					// return axios.get(`/api/events/${params.eventId}`);
					return JSON.parse('{"id":' + params.eventId + ', "location": "Studenternas Hus", "dateTime": "19:00", "name": "Semlesittning", "description": "come and eat semlor with us lol"}');
				}
			},
			{
				path: "/organisations",
				element: <Organisations />,
				loader: async ({ params }) => {
				// 	return axios.get(`/api/memberships`);
					return JSON.parse('[{"id": "1", "name": "Datavetenskapsdivisionen", "picture": "bild.jpg"}, {"id": 2, "name": "Mega6", "picture": ""}]');
				}
			},
			{
				path: "/organisations/memberships",
				element: <Organisations />,
				loader: async ({ params }) => {
					// return axios.get(`/api/organisations/memberships`);
					return JSON.parse('[{"id": "1", "name": "Datavetenskapsdivisionen", "picture": "bild.jpg"}]');
				}
			},
			{
				path: "/organisations/:orgId",
				element: <Organisation />,
				loader: async ({ params }) => {
					// return axios.get(`/api/organisations/${params.orgId}`);
					const permissions = await axios.get(`http://localhost:8080/organisation/${params.orgId}/permissions/by/user`);
					console.log(permissions);
					return JSON.parse('{"id":'+params.orgId+', "name": "Mega6", "picture": ""}');
				}
			},
			{
				path: "/organisations/:orgId/event/new",
				element: <NewEvent />,
				loader: async ({ params }) => {
					return params.orgId;
				}
			},
			{
				path: "/profile",
				element: <Profile />,
				loader: async ({ params }) => {
					// curr_usr = get_user_id()
					// return axios.get(`api/user/${curr_usr}`);
					return JSON.parse(`{"id": 1, "name": "Lukas", "email": "lukas@dvet.se", "regDate": "2024-02-20"}`);
				}
			},
			{
				path: "/profile/settings",
				element: <Settings />
			},
			{
				path: "/profile/:userId",
				element: <Profile />,
				loader: async ({ params }) => {
					// return axios.get(`api/user/${params.userId}`);
					return JSON.parse(`{"id": 1, "name": "Lukas", "email": "lukas@dvet.se", "regDate": "2024-02-20"}`);
				}
			}
		]
	},
	{
		path: "/login",
		element: <Login />
	},
	{
		path: "/register",
		element: <CreateAccount />
	},
	{
		path: "/logout",
		element: <Logout />
	},
]);

function App() {
	return (
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	);
}

export default App;
