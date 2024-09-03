import React, {useState} from 'react';

function loginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 

    const handleLogin = async(e) => {
        e.preventDefault();
        await fetch('api/login', {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        });
    };

return (
        <form onSubmit={handleLogin}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default loginForm; 
