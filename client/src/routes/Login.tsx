import React, { useState } from 'react';
import axios from 'axios';
import '../stylesheets/Login.css'
import '../stylesheets/Form.css';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login() {
    const nav = useNavigate();

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

        axios.post("http://localhost:8080/user/login", formData).then(r => {
            if (r.status == 200) {
                const jwt = r.data.token;
                Cookies.set("jwt", jwt, { sameSite: "lax" });
                console.log(Cookies.get("jwt"));
                nav("/events");
            }
        }).catch(err => console.error(err));
    };

    return (
        <div className="App">
            <main className="login form-container">
                <h1>Login</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <input name="email" type="text" onChange={handleChange} placeholder="Email" required />
                    <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
                    <label><input name="rememberMe" type="checkbox" onChange={handleChange} />Remember me</label>
                    <input type="submit" value="Login" />
                </form>
                <Link to="/register">Register account</Link>
            </main>
        </div>
    );
}

export default Login;
