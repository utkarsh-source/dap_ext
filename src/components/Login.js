import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../../AppContext";
import { login } from "../action/action";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import {
  Button,
  ButtonWrapper,
  FormBox,
  FormHeading,
  Icon,
  Input,
  InputBox,
  PopupWrapper,
  Ruler,
} from "../styled-component";

function Login() {
  const [input, setInput] = useState("");
  const [password, setPass] = useState("");

  const { dispatch } = useContext(AppContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    // chrome.storage.sync.set({ tabInfo: { url: window.location.href } });
    const full_domain = input.split("@")[1].split(".");
    const full_domain_length = full_domain.length;
    const main_domain = full_domain[full_domain_length - 2];
    login(dispatch, main_domain, { email: input, password });
  };

  const handleClose = () => {
    let port = chrome.runtime.connect({ name: "content_script" });
    port.postMessage({ type: "unloadExtension" });
    window.location.reload();
  };

  return (
    <PopupWrapper toggle={true}>
      <FormBox toggle={true} onSubmit={handleSubmit}>
        <FormHeading>Sign In</FormHeading>
        <InputBox>
          <Icon as={MdEmail} />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            name="email"
            placeholder="Email..."
            type="email"
            required
          ></Input>
        </InputBox>
        <InputBox>
          <Icon as={RiLockPasswordLine} />
          <Input
            value={password}
            onChange={(e) => setPass(e.target.value)}
            name="password"
            placeholder="Password..."
            type="password"
            required
          ></Input>
        </InputBox>
        <Ruler />
        <ButtonWrapper>
          <Button type="button" onClick={handleClose}>
            Close
          </Button>
          <Button primary type="submit">
            Login
          </Button>
        </ButtonWrapper>
      </FormBox>
    </PopupWrapper>
  );
}

export default Login;
