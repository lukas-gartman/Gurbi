import { Event } from "../models/modles";
import { Organisation } from "../../../server/src/model/organisationModels";
import '../stylesheets/Events.css';
import { NavLink } from 'react-router-dom';

function EventCard(props: {event: Event}) {
    return (
        <NavLink to={"/events/" + props.event.id} className="event-card">
            <img className="event-img" src={props.event.picture} />
            <div className="event-info">
                <span>{props.event.dateTime.toString()}</span>
                <p>{props.event.name}</p>
                <div className="event-card-row">
                    <img className="event-host-img" src={props.event.picture} />
                    <NavLink to={"/organisations/" + props.event.host.id}>{props.event.host.name}</NavLink>
                </div>
                <div className="event-card-row">
                    <i className="bi bi-geo-alt-fill" />
                    <p>{props.event.location}</p>
                </div>
            </div>
            <div className="event-options">
                <i className="bi bi-three-dots-vertical"></i>
                <i className="bi bi-heart"></i>
            </div>
        </NavLink>
    );
}

export default EventCard;
