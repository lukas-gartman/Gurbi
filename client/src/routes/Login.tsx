import '../stylesheets/Login.css'
import '../stylesheets/Form.css';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className="App">
            <main className="login form-container">
                <h1>Login</h1>
                <form className="form" action="/login" method="POST">
                    <input type="text" name="email" placeholder="Email" required />
                    <input type="password" name="password" placeholder="Password" required />
                    <label><input type="checkbox" name="remember-me" />Remember me</label>
                    <input type="submit" value="Login" />
                </form>
                <Link to="/register">Register account</Link>
            </main>
        </div>
    );
}

export default Login;
