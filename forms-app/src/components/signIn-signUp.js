import React from 'react';
import './styles.css'; 
import { IoMdEye, IoIosEyeOff } from "react-icons/io";

const Container = ({ children }) => (
    <div className="container">{children}</div>
);

const SignUpContainer = ({ children, signIn }) => (
    <div className={`signup-container`} style={signIn ? {} : {
        transform: "translateX(100%)",
        opacity: 1,
        zIndex: 5
    }}>{children}</div>
);

const SignInContainer = ({ children, signIn }) => (
    <div className={`signin-container`} style={signIn ? {} : {
        transform: "translateX(100%)"
    }}>{children}</div>
);

const Form = ({ children }) => (
    <div className="form" >
        {children}
    </div>
);

const Title = ({ children, color = "black" }) => <h1 className="title" style={{ color: color, height: color !== "black" ? "10%" : "20%" }}>{children}</h1>;

const Input = ({ type, placeholder, onChange }) => <input className="input" type={type} placeholder={placeholder} onChange={onChange} />;

const InputPass = ({ placeholder, show, onClick, signIn, color, onChange}) => <>
    <input className="input" type={show ? "text" : "password"} placeholder={placeholder} onChange={onChange}/>
    <button onClick={onClick} className={signIn ? "eye-btn-signIn" : "eye-btn-signUp"} style={{ color: color ? "black" : "transparent" }}>
        {show ? <IoMdEye/> : <IoIosEyeOff/>}
    </button>
</>;

const Button = ({ signIn, onClick=null}) => (
    <button className="buttonSubmit" onClick={onClick}>{signIn?"Login" : "Join"}</button>
);

const GhostButton = ({ children, onClick }) => (
    <button className="ghost-button" onClick={onClick}>{children}</button>
);


const OverlayContainer = ({ children, signIn }) => (
    <div className={`overlay-container`} style={signIn ? {} : {
        transform: "translateX(-100%)"
    }}>{children}</div>
);

const Overlay = ({ children, signIn }) => (
    <div className={`overlay`} style={signIn ? {} : {
        transform: "translateX(50%)"
    }}>{children}</div>
);

const OverlayPanel = ({ children }) => (
    <div className={`overlay-panel`}>{children}</div>
);

const LeftOverlayPanel = ({ children, signIn }) => (
    <div className={`overlay-panel left`} style={signIn ? {} : {
        transform: "translateX(0)"
    }}>{children}</div>
);

const RightOverlayPanel = ({ children, signIn }) => (
    <div className={`overlay-panel right`} style={signIn ? {} : {
        transform: "translateX(20%)"
    }}>{children}</div>
);

const Paragraph = ({ children }) => <p className="paragraph">{children}</p>;

export {
    Container,
    SignUpContainer,
    SignInContainer,
    Form,
    Title,
    Input,
    InputPass,
    Button,
    GhostButton,
    OverlayContainer,
    Overlay,
    OverlayPanel,
    LeftOverlayPanel,
    RightOverlayPanel,
    Paragraph,
};
