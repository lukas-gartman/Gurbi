import React from 'react';
import FooterButton from './FooterButton';
import './Footer.css';

function Footer() {
    return (
        <footer>
            <FooterButton url="/" icon="bi bi-house-door-fill"/>
            <FooterButton url="/memberships" icon="bi bi-person-vcard"/>
        </footer>
    );
}

export default Footer;