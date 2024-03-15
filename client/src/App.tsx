import './stylesheets/App.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router-dom";
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
import { IEvent, IOrganisation, IProfile, IUser } from './models/models';
import NewOrganisation from './routes/NewOrganisation';
import EditEvent from './routes/EditEvent';
import EditOrganisation from './routes/EditOrganisation';

const client = axios.create({baseURL: "http://localhost:8080", withCredentials: true });
export const ClientContext = React.createContext(client);
export let UserContext: React.Context<IUser>;

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

	const loadUser = async () => {
		const user = await client.get("/user/authorized/me");
		UserContext = user.data;
	}
	loadUser();

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
					const orgsResponse = await client.get<IOrganisation[]>('/organisation/authorized/by/user');
					const orgs = orgsResponse.data;

					const orgsHash = new Map<number, IOrganisation>();
					const orgIds: number[] = [];
				
					orgs.forEach(org => {
						orgsHash.set(org.id, org);
						orgIds.push(org.id);
					});
				
					const eventsResponse = await client.post('/event/authorized/following', { orgIds });
					const events = eventsResponse.data;
				
					const iEvents: IEvent[] = [];
				
					for (const event of events) {
						const thehost = orgsHash.get(event.hostId);
						if (!thehost) {
							throw new Error('Host not found for event');
						}
				
						iEvents.push({
							host: thehost,
							dateTime: new Date(event.date),
							description: event.description,
							id: event.id,
							location: event.location,
							picture: event.picture,
							name: event.title
						});
					}
				
					return iEvents;
				}
			},
			{
				path: "/events/:eventId",
				element: <Event />,
				loader: async ({ params }) => {
					// return client.get(`/event/:eventId"}`);

					try {
						const event = (await client.get(`/event/${params.eventId}`)).data;
						const thehost : IOrganisation = (await client.get(`/organisation/${event.hostId}`)).data;
						const user: IUser = (await client.get("/user/authorized/me")).data;
						const permissions = (await client.get(`/organisation/${event.hostId}/user/${user.id}/permissions`)).data;

						let IEvent : IEvent = {
							host: thehost,
							dateTime: new Date(event.date),
							description: event.description,
							id: event.id,
							location: event.location,
							picture: event.picture,
							name: event.title
						}

						return { event: IEvent, user: user, permissions: permissions };
					} catch (error) {
						console.log("Unable to fetch event: " + error);
					}
				}
			},
			{
				path: "/events/:eventId/edit",
				element: <EditEvent />,
				loader: async ({ params }) => {
					const event = (await client.get(`/event/${params.eventId}`)).data;
					const thehost : IOrganisation = (await client.get(`/organisation/${event.hostId}`)).data;
					const user = (await client.get("/user/authorized/me")).data;
					const permissions = (await client.get(`/organisation/${event.hostId}/user/${user.id}/permissions`)).data;

					let IEvent : IEvent = {
						host: thehost,
						dateTime: new Date(event.date),
						description: event.description,
						id: event.id,
						location: event.location,
						picture: event.picture,
						name: event.title
					}

					console.log("host:")
					console.log(IEvent.host)

					return { event: IEvent, permissions: permissions }
				}
			},
			{
				path: "/organisations",
				element: <Organisations />,
				loader: async ({ params }) => {
					try {
						const response = await client.get("/organisation/all");
						const organisations: IOrganisation[] = response.data;
						return organisations;
					  } catch (error) {
						console.error("Error fetching organisations:", error);
						return [];
					  }
					// return JSON.parse('[{"id": "1", "name": "Datavetenskapsdivisionen", "picture": "bild.jpg"}, {"id": 2, "name": "Mega6", "picture": ""}]');
				}
			},
			{
				path: "/organisations/memberships",
				element: <Organisations />,
				loader: async ({ params }) => {
					try {
						const response = await client.get("/organisation/authorized/by/user");
						const organisations: IOrganisation[] = response.data;
						return organisations;
					} catch (error) {
						console.error("Error fetching organisations:", error);
						return [];
					}
					// return JSON.parse('[{"id": "1", "name": "Datavetenskapsdivisionen", "picture": "bild.jpg"}]');
				}
			},
			{
				path: "/organisations/new",
				element: <NewOrganisation />
			},
			{
				path: "/organisations/:orgId",
				element: <Organisation />,
				loader: async ({ params }) => {
					try {
						let res = await client.get(`/organisation/${params.orgId}`);
						const user: IUser = (await client.get("/user/authorized/me")).data;
						const permissions = (await client.get(`/organisation/${params.orgId}/user/${user.id}/permissions`)).data;
						// const events = await client.get(`/event/organisation/${params.orgId}/all`);
						return { organisation: res.data, user: user, permissions: permissions };
					} catch(error: any) {
						console.error("Error fetching organisation:", error);
					}
				}
			},
			{
				path: "/organisations/:orgId/edit",
				element: <EditOrganisation />,
				loader: async ({ params }) => {
					try {
						let org = (await client.get(`/organisation/${params.orgId}`)).data;
						const user: IUser = (await client.get("/user/authorized/me")).data;
						const permissions = (await client.get(`/organisation/${params.orgId}/user/${user.id}/permissions`)).data;
						return { org: org, permissions: permissions };
					} catch(error: any) {
						console.error("Error fetching organisation:", error);
					}
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
					const me = (await client.get("/user/authorized/me")).data as IUser;
					const membershipCount = ((await client.get("/organisation/authorized/by/user")).data as IOrganisation[]).length
					const savedEvents: IEvent[] = []; // TODO: create saved events collection

					const data: IProfile = { user: me, membershipsCount: membershipCount, followingCount: -1, savedEvents: savedEvents }
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
