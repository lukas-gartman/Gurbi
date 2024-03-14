import { useContext } from 'react';
import { ClientContext } from '../App';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { IEvent } from "../models/models";
import { NavLink, useLoaderData } from 'react-router-dom';

function EventPage() {
    const client = useContext(ClientContext);
    const event = useLoaderData() as IEvent;

    return (
        <div className="App">
            <Header />
            <main className="event">
                <h2>{event.name}</h2>

                <div className="event-card-row">
                    <img src={client.defaults.baseURL + event.host.picture} className="event-host-img" alt="Host" />
                    <span>{event.host.name}</span>
                </div>
                
                <div className="event-card-row">
                    <i className="bi bi-calendar3"></i>
                    <span>{event.dateTime.toDateString()} {event.dateTime.getHours()}:{event.dateTime.getMinutes()}</span>
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
                    <img className="event-organiser-img" src={client.defaults.baseURL + event.host.picture} alt="Host" />
                    <div className="event-info">
                        <span>{event.host.name}</span>
                        <span>organisation section here</span>
                    </div>
                    <div className="event-organiser-options">
                        <i className="bi bi-three-dots-vertical"></i>
                        <div>
                            <i className="bi bi-people"></i>
                            <span>{event.host.members.length}</span>
                            <NavLink to={`/organisations/${event.host.id}/unfollow`} className="event-organiser-follow-btn following">Following</NavLink>
                        </div>
                    </div>
                </NavLink>
            </main>
            <Footer />
        </div>
    );
}

export default EventPage;
