import React from 'react';
import '../stylesheets/Memberships.css';
import Header from '../components/Header';
import HeaderNavItem from '../components/HeaderNavItem';
import Footer from '../components/Footer';

function Memberships() {
    const navItems = (
        <>
        <HeaderNavItem url="#" active={true}>Memberships</HeaderNavItem>
        <HeaderNavItem url="#">My memberships</HeaderNavItem>
        <HeaderNavItem url="#">Invites</HeaderNavItem>
        <HeaderNavItem url="#">Applications</HeaderNavItem>
        </>
    );

    return (
        <div className="App">
            <Header onSearch={onSearch} headerNav={navItems} />
            <main className="memberships">
                <p>Memberships</p>
            </main>
            <Footer />
        </div>
    );
}

function onSearch(content: JSON): void {
    
}

export default Memberships;