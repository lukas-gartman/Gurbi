import React from 'react';
import '../Form.css';

function Login() {
    return (
        <div className="App">
            <main className="form-container">
                <h1>Login</h1>
                <form className="form" action="/login" method="POST">
                    <input type="text" name="email" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <label><input type="checkbox" name="remember-me" />Remember me</label>
                    <input type="submit" value="Login" />
                </form>
                <a href="/register">Register account</a>
            </main>
        </div>
    );
}

export default Login;
