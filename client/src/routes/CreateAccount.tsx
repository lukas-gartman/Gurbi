import React from 'react';
import '../stylesheets/Form.css';

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
                <a href="/">Already have an account?</a>
            </main>
        </div>
    );
}

export default CreateAccount;
