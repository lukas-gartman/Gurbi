import React from 'react';
import './Memberships.css';
import Header from '../Header';
import HeaderNavItem from '../HeaderNavItem';
import Footer from '../Footer';

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
            <main>
                <p>Memberships</p>
            </main>
            <Footer />
        </div>
    );
}

function onSearch(content: JSON): void {
    
}

export default Memberships;