import '../stylesheets/Events.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { IEvent } from "../models/models";
import { IOrganisation } from "../models/models";
import EventCard from '../components/EventCard';
import { NavLink, useLoaderData } from 'react-router-dom';

function Events() {
    const navItems = (
        <>
        <NavLink to="/events" className="nav-button" end>Following</NavLink>
        <NavLink to="/events/upcoming" className="nav-button" end>Upcoming</NavLink>
        </>
    );

    const events = useLoaderData() as IEvent[];

    return (
        <div className="App">
            <Header onSearch={onSearch} headerNav={navItems} />
            <main className="events">
                { events.map((e, i) => { return <EventCard event={e} key={i} /> }) }
            </main>
            <Footer />
        </div>
    );
}

function onSearch(content: JSON): void {
    console.log(content);
}

export default Events;
