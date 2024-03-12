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
import { IEvent, IOrganisation, IProfile, IUser } from './models/models';
import NewOrganisation from './routes/NewOrganisation';

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
						let event = (await client.get(`/event/${params.eventId}`)).data;
						let thehost : IOrganisation = (await client.get(`/organisation/${event.hostId}`)).data


						let IEvent : IEvent = {
							host: thehost,
							dateTime: new Date(event.date),
							description: event.description,
							id: event.id,
							location: event.location,
							picture: event.picture,
							name: event.title
						}

						return IEvent;
					} catch (error) {
						
					}
					
					


					return JSON.parse('{"id":' + params.eventId + ', "location": "Studenternas Hus", "dateTime": "19:00", "name": "Semlesittning", "description": "come and eat semlor with us lol"}');
				}
			},
			{
				path: "/organisations",
				element: <Organisations />,
				loader: async ({ params }) => {
					try {
						const response = await client.get("/organisation/all");
						const organisations: IOrganisation[] = response.data;
						console.log("all org result is\n", organisations);
						return organisations;
					  } catch (error) {
						console.error("Error fetching organisations:", error);
						return []; // Return an empty array or handle the error as needed
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
						//interface OrgResponse { orgs: IOrganisation[] };
						const organisations: IOrganisation[] = response.data;
						console.log("all memberships result is\n", organisations);
						return organisations;
					} catch (error) {
						console.error("Error fetching organisations:", error);
						return []; // Return an empty array or handle the error as needed
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
					// return client.get(`/api/organisations/${params.orgId}`);
					//const permissions = await client.get(`/organisation/${params.orgId}/permissions/by/user`);
					//console.log(permissions);
					try {
						console.log("The org id\n", params.orgId);
						let res = await client.get(`/organisation/${params.orgId}`);
						return res.data;
					} catch(error: any) {
						console.error("Error fetching organisation:", error);
					}
					//return JSON.parse('{"id":'+params.orgId+', "name": "Mega6", "picture": ""}');
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
