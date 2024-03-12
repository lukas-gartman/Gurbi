import '../stylesheets/Profile.css';
import '../stylesheets/Form.css';
import { NavLink, useLoaderData, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { IUser } from "../../../server/src/model/UserModels";
import { ClientContext } from '../App';
import { useContext } from 'react';
import { IEvent, IProfile } from '../models/models';
import EventCard from '../components/EventCard';

function Profile() {
    const client = useContext(ClientContext);
    let nav = useNavigate();
    const goBack = () => {
        nav(-1);
    };
    const navSettings = () => {
        nav("/profile/settings");
    };
    
    const header = (
        <>
        <div className="header-row">
            <i id="back-button" onClick={goBack} className="bi bi-arrow-left-short" />
            <h2>Profile</h2>
        </div>
        <i id="settings-button" onClick={navSettings} className="bi bi-gear" />
        </>
    );

    const data = useLoaderData() as IProfile;

    return (
        <div className="App">
            <Header headerContent={header} />
            <main className="profile">
                <div className="profile-row">
                    <img src={client.defaults.baseURL + data.user.picture} className="profile-pic" />
                    <h3>{data.user.name}</h3>
                </div>

                <div className="profile-stats-block">
                    <h4>Organisations</h4>
                </div>
                <div className="profile-row">
                    <div className="profile-stats-block">
                        <b>{data.membershipsCount}</b>
                        <span>Memberships</span>
                    </div>
                    <div className="profile-stats-block">
                        <b>{data.followingCount}</b>
                        <span>Following</span>
                    </div>
                </div>
                <div className="profile-stats-block">
                    <NavLink to={"/organisation/new"} className={"new-org-btn"}>New organisation</NavLink>
                </div>

                <h4>Saved events</h4>
                    {data.savedEvents.length === 0 ? (
                        <div className="empty-block">
                            <p>You have no saved events</p>
                        </div>
                    ) : (
                        data.savedEvents.map((event) => (
                            <EventCard event={event} key={event.id} />
                        ))
                    )}
            </main>
        </div>
    );
}

export default Profile;
