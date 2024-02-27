import React, { useState } from 'react';
import axios from 'axios';
import '../stylesheets/Login.css'
import '../stylesheets/Form.css';
import { Link } from 'react-router-dom';

function Login() {
    interface LoginFormData {
        email: string;
        password: string;
        rememberMe: boolean;
    };

    const [formData, setFormData] = useState<LoginFormData>({email: "", password: "", rememberMe: false});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        try {

            const response = await axios.post("http://localhost:8080/user/login", {test: "my important data"});
    
            // Handle the response here if needed
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="App">
            <main className="login form-container">
                <h1>Login</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <input type="text" onChange={handleChange} placeholder="Email" required />
                    <input type="password" onChange={handleChange} placeholder="Password" required />
                    <label><input type="checkbox" onChange={handleChange} />Remember me</label>
                    <input type="submit" value="Login" />
                </form>
                <Link to="/register">Register account</Link>
            </main>
        </div>
    );
}

export default Login;
