import React, { useState } from 'react';
import axios from 'axios';
import '../stylesheets/Form.css';
import { Link } from 'react-router-dom';

function CreateAccount() {
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

        try {
            await axios.post("/account/create", formData);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="App">
            <main className="form-container">
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
