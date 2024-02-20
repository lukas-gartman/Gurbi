import '../stylesheets/Form.css';
import { Link } from 'react-router-dom';

function CreateAccount() {
    return (
        <div className="App">
            <main className="form-container">
                <h1>Create account</h1>
                <form className="form" action="/account/create" method="POST">
                    <input type="text" name="name" placeholder="Full name" required />
                    <input type="text" name="nickname" placeholder="Nickname (optional)" required />
                    <input type="text" name="email" placeholder="Email" required />
                    <input type="password" name="password"  placeholder="Password" required />
                    <input type="password" name="password2" placeholder="Re-enter password" required />
                    <input type="submit" value="Create account" />
                </form>
                <Link to="/">Already have an account?</Link>
            </main>
        </div>
    );
}

export default CreateAccount;
