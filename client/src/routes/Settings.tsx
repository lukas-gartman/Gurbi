import React, { useState } from 'react';
import axios from 'axios';
import '../stylesheets/Settings.css';
import '../stylesheets/Form.css';
import { NavLink, useLoaderData, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { IUser } from "../../../server/src/model/UserModels";
import { ClientContext } from '../App';
import { useContext } from 'react';


function Profile() {
    const client = useContext(ClientContext);
    const user = useLoaderData() as IUser;

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

    interface UpdatePasswordFormData {
        currentPassword: string;
        newPassword: string;
        repeatPassword: string;
    };

    const [formData, setFormData] = useState<UpdatePasswordFormData>({currentPassword: "", newPassword: "", repeatPassword: ""});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await client.post("user/authorized/profile/settings/update_password", formData);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="App">
            <Header headerContent={header} />
            <main className="settings">
                <h3>Update password</h3>
                <div className="form-container">
                    <form className="form" onSubmit={handleSubmit}>
                        <input name="currentPassword" type="password" onChange={handleChange} placeholder="Current password" required />
                        <input name="newPassword" type="password" onChange={handleChange} placeholder="New password" required />
                        <input name="repeatPassword" type="password" onChange={handleChange} placeholder="Repeat new password" required />
                        <input type="submit" value="Update password" />
                    </form>
                </div>

                <NavLink to={"/logout"} className="logout-btn">Logout</NavLink>
            </main>
        </div>
    );
}

export default Profile;
