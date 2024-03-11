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
import { IEvent, IOrganisation, IUser } from './models/models';

const client = axios.create({baseURL: "http://localhost:8080", withCredentials: true });
export const ClientContext = React.createContext(client);

// Takes care of page refreshes (axios configs are not saved)
const jwt = Cookie.get("jwt");
if (jwt !== undefined) {
	client.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
}

const AuthGuard = () => {
	const jwt = Cookie.get("jwt");

	if (jwt === undefined) {
		console.log("User not logged in. Redirecting from " + window.location.pathname + "to /login ...");
		return <Navigate to="/login" replace />;
	}

	client.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;

	console.log("The token, before AuthGuard, is: " + jwt);
	client.post("/user/authorized/validate", { token: jwt }).catch(() => {
		client.defaults.headers.common['Authorization'] = ``;
		console.log("User token is not valid. Redirecting from " + window.location.pathname + "to /login ...");
		return <Navigate to="/login" replace />;
	});

	return <Outlet />;
}

const Logout = () => {
	Cookie.remove("jwt");
	client.defaults.headers.common['Authorization'] = ``;
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
					let events: IEvent[] = [];
					interface OrgResponse { orgs: IOrganisation[] };
					client.post<OrgResponse>(`/organisation/authorized/by/user`).then(response => {
						try {
							const followingOrgIds = response.data.orgs.map(org => org.id );
							interface EventResponse { events: IEvent[] };
							client.post<EventResponse>(`/event/authorized/following`, {orgIds: followingOrgIds}).then(response => {
								events = response.data.events;
							});
						} catch (e: any) { }
					});
					
					return events;
				}
			},
			{
				path: "/events/:eventId",
				element: <Event />,
				loader: async ({ params }) => {
					// return client.get(`/event/:eventId"}`);
					return JSON.parse('{"id":' + params.eventId + ', "location": "Studenternas Hus", "dateTime": "19:00", "name": "Semlesittning", "description": "come and eat semlor with us lol"}');
				}
			},
			{
				path: "/organisations",
				element: <Organisations />,
				loader: async ({ params }) => {
					let organisations: IOrganisation[] = [];
					try {
						interface OrgResponse { orgs: IOrganisation[] };
						client.get<OrgResponse>("/organisation/all").then(response => {
							organisations = response.data.orgs;
						});
					} catch (e: any) { }
					return organisations;
					// return JSON.parse('[{"id": "1", "name": "Datavetenskapsdivisionen", "picture": "bild.jpg"}, {"id": 2, "name": "Mega6", "picture": ""}]');
				}
			},
			{
				path: "/organisations/memberships",
				element: <Organisations />,
				loader: async ({ params }) => {
					let memberships: IOrganisation[] = [];
					try {
						interface OrgResponse { orgs: IOrganisation[] };
						client.post<OrgResponse>("/organisation/authorized/by/user").then(response => {
							memberships = response.data.orgs;
						});
					} catch (e: any) { }
					return memberships;
					// return JSON.parse('[{"id": "1", "name": "Datavetenskapsdivisionen", "picture": "bild.jpg"}]');
				}
			},
			{
				path: "/organisations/:orgId",
				element: <Organisation />,
				loader: async ({ params }) => {
					// return client.get(`/api/organisations/${params.orgId}`);
					const permissions = await client.get(`/organisation/${params.orgId}/permissions/by/user`);
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
					const me = (await client.post("/user/authorized/me")).data as IUser;
					const membershipCount = ((await client.post("/organisation/authorized/by/user")).data as IOrganisation[]).length
					const savedEvents: IEvent[] = []; // TODO: create saved events collection

					const data = { user: me, membershipCount: membershipCount, followingCount: -1, savedEvents: savedEvents }
					return data;
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
					// return client.get(`api/user/${params.userId}`);
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
		<ClientContext.Provider value={client}>
			<RouterProvider router={router} />
		</ClientContext.Provider>
	);
}

export default App;
