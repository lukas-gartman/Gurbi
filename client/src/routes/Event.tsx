import Footer from '../components/Footer';
import Header from '../components/Header';
import { IEvent } from "../models/models";
import { IOrganisation } from "../models/models";
import { NavLink, useLoaderData } from 'react-router-dom';

function EventPage() {
    const event = useLoaderData() as IEvent;

    return (
        <div className="App">
            <Header />
            <main className="event">
                <h2>{event.name}</h2>

                <div className="event-card-row">
                    <img src={event.picture} className="event-host-img" />
                    <span>{event.host.name}</span>
                </div>
                
                <div className="event-card-row">
                    <i className="bi bi-calendar3"></i>
                    <span>{event.dateTime.toString()}</span>
                </div>

                <div className="event-card-row">
                    <i className="bi bi-geo-alt" />
                    <span>{event.location}</span>
                </div>

                <h3>About</h3>
                <p>{event.description}</p>
                
                <h3>Contact</h3>
                <div className="event-card-row">
                    <i className="bi bi-person"></i>
                    <span>{event.host.name}</span>
                </div>
                <div className="event-card-row">
                    <i className="bi bi-envelope"></i>
                    <span>sample@email.com (no property yet)</span>
                </div>

                <h3>Discussion</h3>
                <p>discussion here</p>

                <h3>Organiser</h3>
                <NavLink to={"/organisations/" + event.host.id} className="event-card">
                    <img className="event-organiser-img" src={event.host.picture} />
                    <div className="event-info">
                        <span>{event.host.name}</span>
                        <span>organisation section here</span>
                    </div>
                    <div className="event-organiser-options">
                        <i className="bi bi-three-dots-vertical"></i>
                        <div>
                            <i className="bi bi-people"></i>
                            <span>1337</span>
                            <NavLink to={`/organisations/${event.host.id}/unfollow`} className="event-organiser-follow-btn following">Following</NavLink>
                        </div>
                    </div>
                </NavLink>
                <div className="event-organiser">
                    <img src={event.host.picture} />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default EventPage;
