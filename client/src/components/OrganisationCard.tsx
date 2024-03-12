import { IOrganisation } from "../models/models";
import '../stylesheets/Organisations.css';
import { NavLink } from 'react-router-dom';

function OrganisationCard(props: {org: IOrganisation}) {
    return (
        <NavLink to={"/organisations/" + props.org.id} className="organisation-card">
            <img className="organisation-background" src="bild2.jpg" />
            <div className="organisation-card-title">
                <img className="organisation-card-title-image" src="bild.jpg" />
                <span>{props.org.name}</span>
            </div>
        </NavLink>
    );
}

export default OrganisationCard;
