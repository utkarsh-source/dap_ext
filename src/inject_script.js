window.dapExtensionCore = {
  get dapDasLoader() {
    const loaderWrapper = document.createElement("div");
    loaderWrapper.id = "dapdasloaderwrapper";
    const loader = document.createElement("div");
    loader.className = "dap-das-loader";
    loader.id = "dap-das-loader";
    loader.innerHTML = `
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      `;
    loaderWrapper.append(loader);
    return loaderWrapper;
  },
  get loaderStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
        #dapdasloaderwrapper{
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          border-radius: "10px";
          width: 100px;
          height: 100px;
          box-shadow: 0 0 20px 0 rgba(0 0 0 / 0.09);
          display: grid;
          place-content: center;
          border-radius: 5px;
        }
        .dap-das-loader {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;
          }
          .dap-das-loader div {
            animation: dap-das-loader 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            transform-origin: 40px 40px;
          }
          .dap-das-loader div:after {
            content: " ";
            display: block;
            position: absolute;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #4361ee;
            margin: -4px 0 0 -4px;
          }
          .dap-das-loader div:nth-child(1) {
            animation-delay: -0.036s;
          }
          .dap-das-loader div:nth-child(1):after {
            top: 63px;
            left: 63px;
          }
          .dap-das-loader div:nth-child(2) {
            animation-delay: -0.072s;
          }
          .dap-das-loader div:nth-child(2):after {
            top: 68px;
            left: 56px;
          }
          .dap-das-loader div:nth-child(3) {
            animation-delay: -0.108s;
          }
          .dap-das-loader div:nth-child(3):after {
            top: 71px;
            left: 48px;
          }
          .dap-das-loader div:nth-child(4) {
            animation-delay: -0.144s;
          }
          .dap-das-loader div:nth-child(4):after {
            top: 72px;
            left: 40px;
          }
          .dap-das-loader div:nth-child(5) {
            animation-delay: -0.18s;
          }
          .dap-das-loader div:nth-child(5):after {
            top: 71px;
            left: 32px;
          }
          .dap-das-loader div:nth-child(6) {
            animation-delay: -0.216s;
          }
          .dap-das-loader div:nth-child(6):after {
            top: 68px;
            left: 24px;
          }
          .dap-das-loader div:nth-child(7) {
            animation-delay: -0.252s;
          }
          .dap-das-loader div:nth-child(7):after {
            top: 63px;
            left: 17px;
          }
          .dap-das-loader div:nth-child(8) {
            animation-delay: -0.288s;
          }
          .dap-das-loader div:nth-child(8):after {
            top: 56px;
            left: 12px;
          }
          @keyframes dap-das-loader {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
    `;
    return style;
  },
  get shadowStyles() {
    const style = document.createElement("style");
    style.innerHTML = `
            @import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");


            :host{
                  display: block;
                  position: relative;
                  z-index: 2147483647;
            }

            input,
            a,
            button,
            textarea {
            border: none;
            outline: none;
            }
            a:focus,
            button:focus,
            input:focus,
            textarea:focus {
            outline: none;
            }
            li {
            list-style: none;
            }

            * {
              font-family: "Montserrat", sans-serif;
              box-sizing: border-box;
              -webkit-font-smoothing: antialiased;
              padding: 0;
              margin: 0;
            }
        `;
    style.id = "shadow-styles";
    return style;
  },
  get reactRoot() {
    const ReactRoot = document.createElement("div");
    ReactRoot.id = "react-root";
    return ReactRoot;
  },
  get foreground() {
    const foreground = document.createElement("div");
    foreground.id = "dap__ext__foreground";
    const shadowRoot = foreground.attachShadow({ mode: "open" });
    shadowRoot.append(this.shadowStyles, this.reactRoot);
    return foreground;
  },
};

// if () {
// }
document.documentElement.append(window.dapExtensionCore.foreground);
