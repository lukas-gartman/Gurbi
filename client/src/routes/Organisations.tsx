import '../stylesheets/Organisations.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { NavLink, useLoaderData } from 'react-router-dom';
import { Organisation } from '../../../src/server/model/organisationModels';
import OrganisationCard from '../components/OrganisationCard';

function Organisations() {
    const navItems = (
        <>
        <NavLink to="/organisations/memberships" className="nav-button" end>My memberships</NavLink>
        <NavLink to="/organisations" className="nav-button" end>All organisations</NavLink>
        <NavLink to="/organisations/invites" className="nav-button" end>Invites</NavLink>
        </>
    );

    const orgs = useLoaderData() as Organisation[];
    return (
        <div className="App">
            <Header onSearch={onSearch} headerNav={navItems} />
            <main className="organisations">
                { orgs.map(o => {return <OrganisationCard org={o} /> }) }
            </main>
            <Footer />
        </div>
    );
}

function onSearch(content: JSON): void {
    
}

export default Organisations;