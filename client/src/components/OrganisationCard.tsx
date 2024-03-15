import { useContext } from "react";
import { IOrganisation } from "../models/models";
import '../stylesheets/Organisations.css';
import { NavLink } from 'react-router-dom';
import { ClientContext } from "../App";

function OrganisationCard(props: {org: IOrganisation}) {
    const client = useContext(ClientContext);
    
    const hasUrl = props.org.id !== -1;
    return (
        hasUrl ? (
        <NavLink to={"/organisations/" + props.org.id} className="organisation-card">
            <img className="organisation-background" src={client.defaults.baseURL + props.org.banner} alt="Organisation banner" />
            <div className="organisation-card-title">
                <img className="organisation-card-title-image" src={client.defaults.baseURL + props.org.picture} alt="Organisation" />
                <span>{props.org.name}</span>
            </div>
        </NavLink>
        ) : (
        <div className="organisation-card">
            <img className="organisation-background" src={props.org.banner} alt="Organisation banner" />
            <div className="organisation-card-title">
                <img className="organisation-card-title-image" src={client.defaults.baseURL + props.org.picture} alt="Organisation" />
                <span>{props.org.name}</span>
            </div>
        </div>
        )
    );
}

export default OrganisationCard;
