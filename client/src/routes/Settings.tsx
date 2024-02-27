import '../stylesheets/Settings.css';
import '../stylesheets/Form.css';
import { NavLink, useLoaderData, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { IUser } from "../../../server/src/model/UserModels";

function Profile() {
    let nav = useNavigate();
    const goBack = () => {
        nav(-1);
    };
    
    const header = (
        <>
        <div className="header-row">
            <i id="back-button" onClick={goBack} className="bi bi-arrow-left-short" />
            <h2>Settings</h2>
        </div>
        </>
    );

    const user = useLoaderData() as IUser;
    return (
        <div className="App">
            <Header headerContent={header} />
            <main className="settings">
                <h3>Update password</h3>
                <div className="form-container">
                    <form className="form" action="/profile/settings/update_password" method="POST">
                        <input type="password" name="current_password" placeholder="Current password" required />
                        <input type="password" name="new_password" placeholder="New password" required />
                        <input type="password" name="repeat_new_password" placeholder="Repeat new password" required />
                        <input type="submit" value="Update password" />
                    </form>
                </div>


            </main>
        </div>
    );
}

export default Profile;
