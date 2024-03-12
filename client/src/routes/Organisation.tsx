import '../stylesheets/Organisations.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useLoaderData, NavLink, useNavigate } from 'react-router-dom';
import { IEvent, IOrganisation, IUser } from '../models/models';
import { useContext } from 'react';
import { ClientContext } from '../App';

function OrganisationPage() {
    interface OrgData {
        organisation: IOrganisation;
        user: IUser;
    }
    const data = useLoaderData() as OrgData;
    const client = useContext(ClientContext);
    
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

    const handleJoin = () => {
        try {

        } catch(e: any) {

        }
    };

    const handleLeave = () => {
        try {

        } catch(e: any) {

        }
    };

    const joinButton = (
        data.organisation.members.find(member => member.userId === data.user.id) ? (
            <a onClick={handleLeave} className="organisation-join-btn joined">Leave organisation</a>
        ) : (
            <a onClick={handleJoin} className="organisation-join-btn">Join organisation</a>
        )
    );

    return (
        <div className="App">
            <Header headerContent={header} />
            <main className="organisation">
                <div className="organisation-title">
                    <div>
                        <img src={data.organisation.picture} className="organisation-img" />
                        <h2>{data.organisation.name}</h2>
                    </div>
                    <div>
                        <div>
                            <i className="bi bi-people"></i>
                            <span>{data.organisation.members.length}</span>
                            { joinButton }
                        </div>
                        <div>
                            <NavLink to={`/organisations/${data.organisation.id}/event/new`} className="organisation-new-event-btn">New event</NavLink>
                        </div>
                    </div>
                </div>

                <p>{data.organisation.description}</p>

                <h3>Contact</h3>
                <div>
                    <i className="bi bi-envelope"></i>
                    <span>sample@email.com (no property yet)</span>
                </div>
                <div>
                    <i className="bi bi-globe2"></i>
                    <span>sample URL (no property yet)</span>
                </div>

                {/* <h3>Events</h3>
                { (data.events as IEvent[]).map((event) => { return <EventCard event={event} key={event.id} /> }) } */}
            </main>
            <Footer />
        </div>
    );
}

export default OrganisationPage;
