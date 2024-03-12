import '../stylesheets/Events.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { IEvent } from "../models/models";
import { IOrganisation } from "../models/models";
import EventCard from '../components/EventCard';
import { Link, NavLink, useLoaderData } from 'react-router-dom';

function Events() {
    const navItems = (
        <>
        <NavLink to="/events" className="nav-button" end>Following</NavLink>
        <Link to="" className="nav-button">Upcoming</Link>
        </>
    );

    const events = useLoaderData() as IEvent[];


    return (
        <div className="App">
            <Header onSearch={onSearch} headerNav={navItems} />
            <main className="events">
                { events.map((event) => { return <EventCard event={event} key={event.id} /> }) }
            </main>
            <Footer />
        </div>
    );
}

function onSearch(content: JSON): void {
    //console.log(content);
}

export default Events;
