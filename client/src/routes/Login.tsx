import { useContext, useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import '../stylesheets/Login.css'
import '../stylesheets/Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { ClientContext } from '../App';

// const client = axios.create({baseURL: "http://localhost:8080", withCredentials: true });

function Login() {
    const client = useContext(ClientContext);
    const nav = useNavigate();

    const jwt = Cookie.get("jwt");
    const isValid = async () : Promise<boolean> => {
        const response = await client.post("/user/authorized/validate", { token: jwt });
        return response.data.valid;
    }

    if (jwt) {
        isValid().then(isValid => {
            if (isValid) {
                console.log("login evaluated to true");
                nav("/events");
            }
        });
    }

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

        client.post("/user/login", formData).then(r => {
            if (r.status == 200) {
                const jwt = r.data.token;
                Cookie.set("jwt", jwt, { sameSite: "lax" });
                client.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
                console.log("[Login: setting jwt cookie]" + Cookie.get("jwt"));
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
