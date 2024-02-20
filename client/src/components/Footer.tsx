import '../stylesheets/Footer.css';
import { NavLink, useLocation } from 'react-router-dom';

function Footer() {
    const curr: string = useLocation().pathname.split("/")[1];
    return (
        <footer>
            <NavLink to="/events" className={({ isActive }) => isActive ? "bi bi-house-door-fill" : "bi bi-house-door"} end/>
            <NavLink to="/organisations/memberships" className={({ isActive }) => (isActive || curr === "organisations") ? "bi bi-person-vcard-fill" : "bi bi-person-vcard" } end/>
        </footer>
    );
}

export default Footer;
