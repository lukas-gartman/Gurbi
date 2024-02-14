import React from 'react';
import './Events.css';
import Header from '../Header';
import HeaderNavItem from '../HeaderNavItem';
import Footer from '../Footer';

function Events() {
    const navItems = (
        <>
        <HeaderNavItem url="#" active={true}>Following</HeaderNavItem>
        <HeaderNavItem url="#">Upcoming</HeaderNavItem>
        </>
    );

    return (
        <div className="App">
            <Header onSearch={onSearch} headerNav={navItems} />
            <main className="events">
                <p>Events</p>
            </main>
            <Footer />
        </div>
    );
}

function onSearch(content: JSON): void {
    console.log(content);
}

export default Events;
