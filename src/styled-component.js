import styled from "styled-components";
import { theme } from "./theme";

export const PopupWrapper = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${(props) => theme.lightBlack};
  opacity: ${(props) => (props.toggle ? 1 : 0)};
  pointer-events: ${(props) => (props.toggle ? "auto" : "none")};
`;

export const FormBox = styled.form`
  background-color: white;
  /* box-shadow: ${(props) => theme.shadow}; */
  border: 1px solid rgba(red, 0.8);
  border-radius: 10px;
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 700px;
  min-height: 500px;
  padding: 100px 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${(props) => (props.toggle ? 1 : 0)};
  transform: translate(-50%, -50%)
    ${(props) => (props.toggle ? "scale(100%)" : "scale(98%)")};
  pointer-events: ${(props) => (props.toggle ? "auto" : "none")};
  transition: transform 0.05s ease-out, opacity 0.05s ease-out;
  height: 350px;
`;

export const InputBox = styled.div`
  position: relative;
  display: flex;
  border-radius: 4px;
  overflow: hidden;
  align-items: center;
  height: ${(props) => props.height || "60px"};
  position: relative;
  width: 100%;
  margin-bottom: 15px;
  padding: 0 15px;
  border: 1px solid ${(props) => theme.lightGray};
  background-color: white;
  color: black;
  & > input {
    background-color: transparent;
    color: inherit;
    width: 100%;
    height: 100%;
    font-size: 15px;
    &::placeholder {
      color: gray;
      font-size: inherit;
    }
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  column-gap: 10px;
  margin-top: 10px;
  width: 100% !important;
`;

export const Button = styled.button`
  border-radius: 4px;
  background-color: ${(props) => (props.primary ? theme.waterBlue : "white")};
  color: ${(props) => (props.primary ? "white" : "black")};
  font-weight: lighter;
  border: ${(props) =>
    props.primary
      ? `1px solid ${theme.waterBlue}`
      : `1px solid ${theme.lightBlack}`};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 13px;
  font-size: 14.5px;
  transition: transform 0.05s ease-out;
  flex-grow: 1;
  &:active {
    transform: scale(0.98);
  }
  cursor: pointer;
  & > svg {
    font-size: 20px;
    &:not(:only-child) {
      margin-right: 5px;
    }
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 100%;
  &::placeholder {
    font-size: 15px;
  }
`;

export const FormHeading = styled.h1`
  color: black;
  font-size: 25px;
  margin-bottom: 25px;
`;

export const Icon = styled.svg`
  /* color: ${(props) => theme.lightGray}; */
  color: ${[(props) => theme.waterBlue]};
  font-size: 30px;
  margin-right: 10px;
`;

export const Ruler = styled.hr`
  height: 0.5px;
  border: none;
  border-top: 1px dashed ${(props) => theme.lightGray};
  width: 100%;
  /* background-color: rgba(0 0 0 / 0.1); */
  margin: 8px auto;
  margin-top: auto;
`;

export const Settings = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  height: 80px;
  box-shadow: 0 0 15px rgba(0 0 0 / 0.15);
  padding: 5px 10px;
  justify-content: space-between;
  transform: ${(props) =>
    props.toggle ? "translateY(0)" : "translateY(100%)"};
  transition: transform 0.07s ease-out;
  background-color: white;
  /* & > button[data-settings="true"] {
    position: absolute;
    top: 0;
    right: 0;
    transform: translateY(-100%);
    color: white;
    font-size: 13px;
    padding: 2px 10px;
    border-radius: 2px;
    background-color: ${(props) => theme.waterBlue};
    display: grid;
    place-content: center;
  } */
`;

export const FlexBox = styled.div`
  display: flex;
  /* align-items: center; */
  column-gap: 10px;
`;

export const InfoBox = styled.p`
  background-color: ${(props) => theme.gray};
  border-radius: 5px;
  padding: 10px 15px;
  color: white;
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  & > span {
    display: inline-block;
    background-color: white;
    padding: 2px 5px;
    color: black;
    margin: 0 2px;
    border-radius: 2px;
  }
  opacity: ${(props) => (props.toggle ? 1 : 0)};
  transition: opacity 0.07s ease-out;
`;

export const FlowManager = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  min-width: 300px;
  background-color: white;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) => theme.shadow};
  transform: ${(props) =>
    props.toggle ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.2s ease-out;
  & > ul {
    display: flex;
    flex-direction: column;
    & > li {
      position: relative;
      background-color: white;
      border-radius: 5px;
      box-shadow: ${(props) => theme.shadow};
      padding: 10px;
      &:not(:last-child) {
        margin-bottom: 20px;
      }
      & > span {
        display: inline-block;
        font-weight: bold;
        font-size: 15px;
        padding-bottom: 10px;
      }
    }
  }
`;

export const FilterIcon = styled.svg`
  background-color: ${(props) => theme.waterBlue};
  width: 50px;
  height: 50px;
  padding: 10px;
  color: white;
  border-radius: 4px;
  margin-top: 0;
`;

export const CloseButton = styled.svg`
  font-size: 20px;
  margin: 10px 0;
  margin-left: auto;
`;

export const CurrentFlowBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
  border: 1px dashed ${(props) => theme.lightGray};
  & > p {
    margin-bottom: 10px;
    & > span {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 5px;
      color: black;
      background-color: rgba(0 0 0 / 0.03);
      border-radius: 4px;
    }
  }
  & > button {
    background-color: ${(props) => theme.waterBlue};
    color: white;
    padding: 10px 15px;
    border-radius: 4px;
    box-shadow: 0 0 5px 0 rgba(0 0 0 / 0.1);
    margin-left: auto;
    width: max-content;
  }
  margin: 15px 0;
`;

export const ErrorMessage = styled.p`
  background-color: white;
  border-radius: 5px;
  padding: 10px 15px;
  box-shadow: 0 0 8px 0 rgba(0 0 0 / 0.09);
  width: max-content;
  margin: 10px auto;
`;

export const Loader = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: "10px";
  width: 100px;
  height: 100px;
  box-shadow: ${(props) => theme.shadow};
  display: grid;
  place-content: center;
  border-radius: 5px;
  & > div > svg {
    fill: ${(props) => theme.waterBlue};
  }
`;

export const Feedback = styled.div`
  position: fixed;
  bottom: 80px;
  right: 10px;
  & > ul {
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 300px;
    position: absolute;
    top: -2px;
    right: 0;
    transform: translateY(-100%);
    background-color: white;
    box-shadow: ${(props) => theme.shadow};
    border-radius: 5px;
    padding: 20px;
    opacity: ${(props) => (props.toggle ? 1 : 0)};
    pointer-events: ${(props) => (props.toggle ? "auto" : "none")};
    transition: opacity 0.05s ease-out;
    & > div[style] {
      display: inline-block;
      margin: auto;
    }
    & > li {
      border-radius: 5px;
      & > p {
        font-size: 20px;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        & > span {
          padding-top: 15px;
          font-weight: bold;
          font-size: 15px;
          padding-bottom: 15px;
        }
      }
      & > ul {
        display: flex;
        align-items: center;
        margin-left: 1px;
        & > li {
          display: flex;
          align-items: center;
          & > span {
            font-size: 14px;
            margin-left: 10px;
          }
          & > input {
            transform: scale(125%);
          }
          &:not(:last-child) {
            margin-right: 20px;
          }
        }
      }
    }
  }
`;

export const AnnouncementBox = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  background-color: white;
  border-radius: 10px;
  box-shadow: ${(props) => theme.shadow};
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  min-width: 350px;
  opacity: ${(props) => (props.toggle ? 1 : 0)};
  transform: translate(-50%, -50%)
    ${(props) => (props.toggle ? "scale(100%)" : "scale(98%)")};
  pointer-events: ${(props) => (props.toggle ? "auto" : "none")};
  transition: transform 0.05s ease-out, opacity 0.05s ease-out;
  & > ul {
    & > li {
      & > p {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        & > span {
          background-color: ${(props) => theme.waterBlue};
          padding: 1px 8px;
          color: white;
          border-radius: 3px;
          margin-right: 5px;
          font-weight: bold;
        }
        font-size: 16px;
      }
    }
  }
`;

export const Subject = styled.p`
  margin: 0 5px;
  font-size: 14px;
`;

export const From = styled.p`
  margin: 0 5px;
  font-weight: bold;
`;

export const AnnoucemnetBody = styled.p`
  font-size: 15px;
`;

export const ButtonRounded = styled(Button)`
  margin: 0;
  max-width: 20px;
  width: 20px;
  height: 20px;
  max-height: 20px;
  border-radius: 100px;
  margin-left: auto;
  padding: 1px;
`;

export const Badge = styled.p`
  position: absolute;
  top: 0;
  left: 30px;
  transform: translateY(-50%);
  padding: 5px 10px;
  color: white;
  background-color: ${(props) => theme.waterBlue};
  border-radius: 5px;
  font-weight: bold;
`;

export const TooltipBox = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  padding: 10px;
  position: fixed;
  min-width: 350px;
  filter: drop-shadow(0 0 50px rgba(0 0 0 / 0.2));
  pointer-events: auto;
  & > input {
    font-size: 20px;
    color: gray;
    font-weight: bold;
    padding: 5px;
  }
  & > textarea {
    border: 1px dashed ${(props) => theme.lightGray};
    border-radius: 5px;
    padding: 5px;
    margin: 10px 0;
    font-size: 15px;
    min-height: 60px;
    resize: vertical;
  }
`;

export const Arrow = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 2px;
  background-color: white;
`;

export const PreviewTooltip = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 5px;
  padding: 15px;
  min-width: 350px;
  filter: drop-shadow(0 0 50px rgba(0 0 0 / 0.2));
  & > p {
    font-size: 20px;
    color: gray;
    font-weight: bold;
  }
  & > div > p {
    margin: 10px 0;
    margin-bottom: 0;
    font-size: 15px;
  }
`;

export const HoverHighlighter = styled.div`
  --padding: 3px;
  position: fixed;
  pointer-events: none;
  background-color: ${(props) => theme.pink};
  opacity: 0.4;
  border-radius: 1px;
  padding: var(--padding);
  box-sizing: content-box !important;
  transform: translate(-3px, -3px);
`;

export const HighlighterTooltip = styled.div`
  position: fixed;
  pointer-events: none;
  background-color: black;
  padding: 10px;
  color: white;
  font-size: 14.5px;
  border-radius: 2px;
`;

export const ToastBox = styled.div`
  max-width: 400px;
  width: max-content;
  box-shadow: ${(props) => theme.shadow};
  & > div {
    display: flex;
    align-items: center;
    border-radius: 5px;
    width: 100%;
    height: 100%;
    align-items: stretch;
    justify-content: space-between;
    background-color: white;
    overflow: hidden;
    border-left: 6px solid ${(props) => theme.waterBlue};
  }
`;

export const ToastMessage = styled.div`
  font-size: 16px;
  flex-grow: 1;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  & > svg {
    font-size: 25px;
    margin-right: 12px;
    color: ${(props) => (props.success ? "lightgreen" : "red")};
  }
`;

export const ToastButtonBox = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.single ? "row" : "column")};
  align-items: stretch;
  margin-left: 20px;
  & > button {
    border: none;
    width: 50px;
    min-height: 50px;
    background-color: whitesmoke;
    & > svg {
      font-size: 20px;
    }
    &:first-child {
      background-color: ${(props) => theme.waterBlue};
      color: white;
    }
  }
`;

export const PreviewBox = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  column-gap: 5px;
  height: 40px;
  transition: opacity 0.07s linear, transform 0.07s ease-out;
  opacity: ${(props) => (props.toggle ? 1 : 0)};
  transform: ${(props) =>
    props.toggle ? "translateY(0%)" : "translateY(-200%)"};
  pointer-events: ${(props) => (props.toggle ? "auto" : "none")};
  & > span {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${(props) => theme.gray};
    font-size: 14px;
    color: white;
    border-radius: 5px;
    align-self: stretch;
    padding: 0 20px;
    border-radius: 4px;
    column-gap: 5px;
  }
  & > button {
    padding: 0 12px;
    display: inline-grid;
    place-content: center;
    background-color: ${(props) => theme.gray};
    color: white;
    border-radius: 4px;
    align-self: stretch;
    flex-grow: 1;
  }
`;
