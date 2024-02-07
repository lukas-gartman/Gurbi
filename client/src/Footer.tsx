import {useLocation} from 'react-router';
import FooterButton from './FooterButton';
import './Footer.css';

class FooterPage {
    constructor(readonly url: string, readonly icon: string, readonly activeIcon: string) {}
}

const events = new FooterPage("/events", "bi bi-house-door", "bi bi-house-door-fill")
const memberships = new FooterPage("/memberships", "bi bi-person-vcard", "bi bi-person-vcard-fill")

function Footer() {
    const curr: string = "/" + useLocation().pathname.split("/")[1];
    return (
        <footer>
            <FooterButton url={events.url} icon={curr === events.url ? events.activeIcon : events.icon}/>
            <FooterButton url={memberships.url} icon={curr === memberships.url ? memberships.activeIcon : memberships.icon}/>
        </footer>
    );
}

export default Footer;