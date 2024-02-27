import '../stylesheets/Profile.css';
import '../stylesheets/Form.css';
import { NavLink, useLoaderData, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { IUser } from "../../../server/src/model/dataModels";

function Profile() {
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

    const user = useLoaderData() as IUser;
    return (
        <div className="App">
            <Header headerContent={header} />
            <main className="profile">
                <div className="profile-row">
                    <img src="profile_pic.jpg" className="profile-pic" />
                    <h3>{user.name}</h3>
                </div>

                <div className="profile-stats-block">
                    <h4>Organisations</h4>
                </div>
                <div className="profile-row">
                    <div className="profile-stats-block">
                        <b>2</b>
                        <span>Memberships</span>
                    </div>
                    <div className="profile-stats-block">
                        <b>5</b>
                        <span>Following</span>
                    </div>
                </div>

                <h4>Saved events</h4>
                <div className="empty-block">
                    <p>You have no saved events</p>
                </div>
            </main>
        </div>
    );
}

export default Profile;
