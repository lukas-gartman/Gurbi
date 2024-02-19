import {useLocation} from 'react-router';
import FooterButton from './FooterButton';
import '../stylesheets/Footer.css';
import { NavLink } from 'react-router-dom';

class FooterPage {
    constructor(readonly url: string, readonly icon: string, readonly activeIcon: string) {}
}

const events = new FooterPage("/events", "bi bi-house-door", "bi bi-house-door-fill")
const memberships = new FooterPage("/memberships", "bi bi-person-vcard", "bi bi-person-vcard-fill")

function Footer() {
    const curr: string = "/" + useLocation().pathname.split("/")[1];
    return (
        <footer>
            <NavLink to="/events" className={({ isActive }) => isActive ? "bi bi-house-door-fill" : "bi bi-house-door"} />
            <NavLink to="/memberships" className={({ isActive }) => isActive ? "bi bi-person-vcard-fill" : "bi bi-person-vcard" } />
        </footer>
    );
}

export default Footer;