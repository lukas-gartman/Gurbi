import React, { useState } from 'react';
import '../stylesheets/Settings.css';
import '../stylesheets/Form.css';
import { NavLink, useLoaderData, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ClientContext } from '../App';
import { useContext } from 'react';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
    const client = useContext(ClientContext);

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

        const toastConfig: ToastOptions = { position: "bottom-left", autoClose: 3000, theme: "colored" };
        client.post("user/authorized/profile/settings/update_password", formData).then(response => {
            if (response.status === 200) {
                toast.success(response.data, toastConfig);
            }
        }).catch(error => {
            toast.error(error.response.data, toastConfig);
        });
    };

    return (
        <div className="App">
            <Header headerContent={header} />
            <main className="settings">
                <ToastContainer />
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
