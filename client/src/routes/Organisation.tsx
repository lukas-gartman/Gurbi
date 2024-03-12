import '../stylesheets/Organisations.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLoaderData, NavLink, useNavigate } from 'react-router-dom';
import { Organisation } from '../../../server/src/model/organisationModels';
import { IOrganisation } from '../models/models';

function OrganisationPage() {
    const organisation = useLoaderData() as IOrganisation;
    
    let nav = useNavigate();
    const goBack = () => {
        nav(-1);
    };
    const navOptions = () => {
        // TODO: option floating menu
    };

    const header = (
        <>
        <div className="header-row">
            <i id="back-button" onClick={goBack} className="bi bi-arrow-left-short" />
        </div>
        <i id="options-button" onClick={navOptions} className="bi bi-three-dots-vertical" />
        </>
    );

    return (
        <div className="App">
            <Header headerContent={header} />
            <main className="organisation">
                <div className="organisation-title">
                    <div>
                        <img src={organisation.picture} className="organisation-img" />
                        <h2>{organisation.name}</h2>
                    </div>
                    <div>
                        <div>
                            <i className="bi bi-people"></i>
                            <span>{organisation.members.length}</span>
                            <NavLink to={`/organisations/${organisation.id}/unfollow`} className="organisation-follow-btn following">Following</NavLink>
                        </div>
                        <div>
                            <NavLink to={`/organisations/${organisation.id}/event/new`} className="organisation-new-event-btn">New event</NavLink>
                        </div>
                    </div>
                </div>

                <p>{organisation.description}</p>

                <h3>Contact</h3>
                <div>
                    <i className="bi bi-envelope"></i>
                    <span>sample@email.com (no property yet)</span>
                </div>
                <div>
                    <i className="bi bi-globe2"></i>
                    <span>sample URL (no property yet)</span>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default OrganisationPage;
