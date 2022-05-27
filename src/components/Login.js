import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { login } from "../action/action";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import "./Login.scss";

function Login() {
  const [input, setInput] = useState("");
  const [password, setPass] = useState("");

  const { dispatch } = useContext(AppContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    chrome.storage.sync.set({ tabInfo: { url: window.location.href } });
    login(dispatch, { email: input, password });
  };

  const handleClose = () => {
    chrome.runtime
      .sendMessage({ closeExt: true })
      .then((res) => console.log(res))
      .catch((err) => {});
  };

  useEffect(() => {
    document.body.style.pointerEvents = "none";
    return () => {
      document.body.style.pointerEvents = "auto";
    };
  }, []);

  return (
    <form className="extension__login__form" onSubmit={handleSubmit}>
      <h1 className="title">Sign In</h1>
      <div className="input__wrapper">
        <div>
          <MdEmail className="input__icon" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            name="email"
            placeholder="Email..."
            type="email"
            required
          ></input>
        </div>
      </div>
      <div className="input__wrapper">
        <div>
          <RiLockPasswordLine className="input__icon" />
          <input
            value={password}
            onChange={(e) => setPass(e.target.value)}
            name="password"
            placeholder="Password..."
            type="password"
            required
          ></input>
        </div>
      </div>
      <div className="login__btn__wrapper">
        <button type="button" onClick={handleClose} className="close__button">
          Close
        </button>
        <button type="submit" className="login__button">
          Login
        </button>
      </div>
    </form>
  );
}

export default Login;
