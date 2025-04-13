import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { setUserData } from '../Features/User/UserSlice';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // A Dispatch is used to dispatch actions to the store
    const dispatch = useDispatch()
    // A Selector is used to get the state from the store
    const User=useSelector(state=>state.User)


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(User)
        console.log('Email:', email);
        console.log('Password:', password);

        // Just testing the Redux Store 
        dispatch(
            setUserData({
                email: email,
                password: password,
            })
        )

    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;