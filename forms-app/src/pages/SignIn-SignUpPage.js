import React, { useState } from "react";
import * as Components from "../components/signIn-signUp";
import { signUp, signIn } from "../firebase/firebase";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/loading";


function SignInSignUp() {
    const [username, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [signInValue, setSignIn] = useState(true);
    const [show, setShow] = useState(false);
    const [see, setSee] = useState(true);
    const [loading, setLoading] = useState(false);
    const { updateAuthUser } = useAuth();
    const navigate = useNavigate();

    const toggleShow = () => {
        setShow(!show);
    };


    const toggleSee = () => {
        setSee(false);
        setTimeout(() => setSee(true), 400);

    }

    const toggleSignIn = () => {
        setSignIn(!signInValue);
    };

    const SignUp = async () => {
        if (!email || !password || !username) {
            toast.error('Please fill all fields');
            console.error("Preencher campos");
            return;
        }
        setLoading(true);
        try {
            const user = await signUp(email, password, username);
            updateAuthUser(user);
            setLoading(false);
            toast.success("Account created successfully!")
            navigate("/home");

        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                toast.error('Email already in use');
            } else if (error.code === "auth/weak-password") {
                toast.error('Password must have at least 6 characters');
            } else if (error.code === "auth/invalid-email") {
                toast.error('Invalid email');
            } else
                toast.error('Error creating account');
            console.error("Erro ao criar conta:", error.message);
            setLoading(false);
        }
    };

    const LogIn = async () => {
        if (!email || !password) {
            toast.error('Please fill all fields');
            console.error("Preencher campos");
            return;
        }
        setLoading(true);

        try {
            const user = await signIn(email, password);
            updateAuthUser(user);
            setLoading(false);
            navigate("/home");
            toast.success('Logged in successfully!');
        } catch (error) {
            toast.error('Wrong email or password');
            console.error("Erro ao fazer login:", error.message);
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "#FCF7E7", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "100vh" }}>
            <Toaster />

            <Components.Container>
                <Components.SignUpContainer signIn={signInValue}>
                    <Components.Form >
                        <Components.Title>Create account</Components.Title>
                        <Components.Input type='text' placeholder='Name' onChange={(e) => setName(e.target.value)} />
                        <Components.Input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                        <Components.InputPass color={see} signIn={signInValue} show={show} onClick={() => toggleShow()} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                        <Components.Button onClick={SignUp} signIn={signInValue} ></Components.Button>
                    </Components.Form>
                </Components.SignUpContainer>

                <Components.SignInContainer signIn={signInValue}>
                    <Components.Form>
                        <Components.Title>Login</Components.Title>
                        <Components.Input type='text' placeholder='User Email' onChange={(e) => setEmail(e.target.value)} />
                        <Components.InputPass color={see} signIn={signInValue} show={show} onClick={() => toggleShow()} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                        <Components.Button onClick={LogIn} signIn={signInValue} ></Components.Button>
                    </Components.Form>
                </Components.SignInContainer>

                <Components.OverlayContainer signIn={signInValue}>
                    <Components.Overlay signIn={signInValue}>

                        <Components.LeftOverlayPanel signIn={signInValue}>
                            <Components.Title color="white">Welcome Back!</Components.Title>
                            <Components.Paragraph>
                                Press the button to login
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => { toggleSignIn(); toggleSee() }}>
                                Login
                            </Components.GhostButton>
                        </Components.LeftOverlayPanel>

                        <Components.RightOverlayPanel signIn={signInValue}>
                            <Components.Title color="white">Welcome!</Components.Title>
                            <Components.Paragraph>
                                Create an account to start using our services
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => { toggleSignIn(); toggleSee() }}>
                                Join
                            </Components.GhostButton>
                        </Components.RightOverlayPanel>

                    </Components.Overlay>
                </Components.OverlayContainer>
            </Components.Container>
            <Loading isOpen={loading} />
        </div>
    );
}

export default SignInSignUp;
