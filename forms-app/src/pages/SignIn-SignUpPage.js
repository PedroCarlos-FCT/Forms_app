import React, { useState } from "react";
import * as Components from "../components/signIn-signUp";
import { signUp, signIn } from "../firebase/firebase";
import { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useHistory
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
    const navigate = useNavigate(); // Use navigate

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
        setLoading(true);
        try {
            const user = await signUp(email, password, username);
            updateAuthUser(user);
            setLoading(false);
            navigate("/home"); // Navigate to the home page

        } catch (error) {
            console.error("Erro ao criar conta:", error.message);
            setLoading(false);
        }
    };

    const LogIn = async () => {
        setLoading(true);
        try {
            const user = await signIn(email, password);
            updateAuthUser(user);
            setLoading(false);
            navigate("/home"); // Navigate to the home page
        } catch (error) {
            console.error("Erro ao fazer login:", error.message);
            setLoading(false);
        }
    };

    return (
        <div style={{ background: "transparent", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "100vh", margin: "-20px 0 50px" }}>
            <Toaster></Toaster>

            <Components.Container>
                <Components.SignUpContainer signIn={signInValue}>
                    <Components.Form >
                        <Components.Title>Crie uma conta</Components.Title>
                        <Components.Input type='text' placeholder='Nome' onChange={(e) => setName(e.target.value)} />
                        <Components.Input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                        <Components.InputPass color={see} signIn={signInValue} show={show} onClick={() => toggleShow()} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                        <Components.Button onClick={SignUp} signIn={signInValue} ></Components.Button>
                    </Components.Form>
                </Components.SignUpContainer>

                <Components.SignInContainer signIn={signInValue}>
                    <Components.Form>
                        <Components.Title>Iniciar sessão</Components.Title>
                        <Components.Input type='text' placeholder='Nome de utilizador' onChange={(e) => setEmail(e.target.value)} />
                        <Components.InputPass color={see} signIn={signInValue} show={show} onClick={() => toggleShow()} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
                        <Components.Button onClick={LogIn} signIn={signInValue} ></Components.Button>
                    </Components.Form>
                </Components.SignInContainer>

                <Components.OverlayContainer signIn={signInValue}>
                    <Components.Overlay signIn={signInValue}>

                        <Components.LeftOverlayPanel signIn={signInValue}>
                            <Components.Title color="white">Bem-Vindo de volta!</Components.Title>
                            <Components.Paragraph>
                                Para fazer login clique no botão abaixo!
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => { toggleSignIn(); toggleSee() }}>
                                Login
                            </Components.GhostButton>
                        </Components.LeftOverlayPanel>

                        <Components.RightOverlayPanel signIn={signInValue}>
                            <Components.Title color="white">Bem-Vindo!</Components.Title>
                            <Components.Paragraph>
                                Preencha o formulário e comece já a analisar a sua cozinha
                            </Components.Paragraph>
                            <Components.GhostButton onClick={() => { toggleSignIn(); toggleSee() }}>
                                Aderir
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
