import { IOrganisation } from "../models/models";
import '../stylesheets/Organisations.css';
import { NavLink } from 'react-router-dom';

function OrganisationCard(props: {org: IOrganisation}) {
    const hasUrl = props.org.id !== -1;
    return (
        hasUrl ? (
        <NavLink to={"/organisations/" + props.org.id} className="organisation-card">
            <img className="organisation-background" src={props.org.picture} />
            <div className="organisation-card-title">
                <img className="organisation-card-title-image" src="bild.jpg" />
                <span>{props.org.name}</span>
            </div>
        </NavLink>
        ) : (
        <div className="organisation-card">
            <img className="organisation-background" src={props.org.picture} />
            <div className="organisation-card-title">
                <img className="organisation-card-title-image" src={props.org.picture} />
                <span>{props.org.name}</span>
            </div>
        </div>
        )
    );
}

export default OrganisationCard;
