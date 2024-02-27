import '../stylesheets/Events.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Event } from "../models/modles";
import { Organisation } from "../../../server/src/model/organisationModels";
import EventCard from '../components/EventCard';
import { NavLink, useLoaderData } from 'react-router-dom';

function Events() {
    const navItems = (
        <>
        <NavLink to="/events" className="nav-button" end>Following</NavLink>
        <NavLink to="/events/upcoming" className="nav-button" end>Upcoming</NavLink>
        </>
    );

    const testEvents = useLoaderData() as Event[];
    const h: Organisation[] = JSON.parse('[{"id": 1, "name": "MatNatSex", "picture": ""}, {"id": 2, "name": "Mega6", "picture": ""}]');
    testEvents[0].host = h[0];
    testEvents[1].host = h[1];

    return (
        <div className="App">
            <Header onSearch={onSearch} headerNav={navItems} />
            <main className="events">
                { testEvents.map(e => { return <EventCard event={e} /> }) }
            </main>
            <Footer />
        </div>
    );
}

function onSearch(content: JSON): void {
    console.log(content);
}

export default Events;
