import '../stylesheets/Organisations.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, NavLink, useLoaderData } from 'react-router-dom';
import { IOrganisation } from '../models/models';
import OrganisationCard from '../components/OrganisationCard';

function Organisations() {
    const navItems = (
        <>
        <NavLink to="/organisations/memberships" className="nav-button" end>My memberships</NavLink>
        <NavLink to="/organisations" className="nav-button" end>All organisations</NavLink>
        <Link to="" className="nav-button">Invites</Link>
        </>
    );

    const orgs = useLoaderData() as IOrganisation[];
    return (
        <div className="App">
            <Header onSearch={onSearch} headerNav={navItems} />
            <main className="organisations">
                { orgs.map((org) => {return <OrganisationCard org={org} key={org.id} /> }) }
            </main>
            <Footer />
        </div>
    );
}

function onSearch(content: JSON): void {
    
}

export default Organisations;