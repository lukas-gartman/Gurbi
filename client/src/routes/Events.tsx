import React from 'react';
import './Events.css';
import Header from '../Header';
import HeaderNavItem from '../HeaderNavItem';
import Footer from '../Footer';
import { Event, Organisation } from '../../../src/server/model/dataModels';
import EventCard from '../EventCard';

function Events() {
    const navItems = (
        <>
        <HeaderNavItem url="#" active={true}>Following</HeaderNavItem>
        <HeaderNavItem url="#">Upcoming</HeaderNavItem>
        </>
    );

    const e: Event = JSON.parse('{"id": 1, "location": "Studenternas Hus", "dateTime": "19:00", "name": "Semlesittning"}')
    const h: Organisation = JSON.parse('{"id": 1, "name": "MatNatSex", "picture": ""}')
    e.host = h;
    const testEvents: Event[] = [e, e, e]

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
