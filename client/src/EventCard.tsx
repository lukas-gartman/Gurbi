import React from 'react';
import {Event} from "../../src/server/model/dataModels";
import './routes/Events.css';

function EventCard(props: {event: Event}) {
    return (
        <div className="event-card">
            <img className="event-img" src={props.event.picture} />
            <div className="event-info">
                <span>{props.event.dateTime.toString()}</span>
                <p>{props.event.name}</p>
                <div className="event-card-row">
                    <img className="event-host-img" src={props.event.picture} />
                    <span>{props.event.name}</span>
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
        </div>
    );
}

export default EventCard;
