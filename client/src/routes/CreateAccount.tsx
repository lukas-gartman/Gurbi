import React, { useContext, useEffect, useState } from 'react';
import Cookie from 'js-cookie';
import '../stylesheets/Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { ClientContext } from '../App';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';

function CreateAccount() {
    const client = useContext(ClientContext);
    const nav = useNavigate();

    useEffect(() => {
        const jwt = Cookie.get("jwt");
        if (jwt) {
            nav("/events");
        }
    });

    interface CreateAccountFormData {
        fullName: string;
        nickname: string;
        email: string;
        password: string;
        repeatPassword: string;
    };

    const [formData, setFormData] = useState<CreateAccountFormData>({fullName: "", nickname: "", email: "", password: "", repeatPassword: ""});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const toastConfig: ToastOptions = { position: "bottom-left", autoClose: 3000, theme: "colored" };
        try {
            client.post("/user/register", formData).then(r => {
                if (r.status === 200) {
                    toast.success(r.data, toastConfig);
                    nav("/");
                }
            }).catch(err => {
                toast.error(err.response.data, toastConfig);
                console.error(err);
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="App">
            <main className="form-container">
                <ToastContainer />
                <h1>Create account</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <input name="fullName" type="text" onChange={handleChange} placeholder="Full name" required />
                    <input name="nickname" type="text" onChange={handleChange} placeholder="Nickname (optional)" required />
                    <input name="email" type="text" onChange={handleChange} placeholder="Email" required />
                    <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
                    <input name="repeatPassword" type="password" onChange={handleChange} placeholder="Re-enter password" required />
                    <input type="submit" value="Create account" />
                </form>
                <Link to="/">Already have an account?</Link>
            </main>
        </div>
    );
}

export default CreateAccount;
