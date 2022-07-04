window.dap_extension = {
  get globalStyles() {
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
    style.id = "global-styles";
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
    shadowRoot.append(this.globalStyles, this.reactRoot);
    return foreground;
  },
};

document.body.appendChild(window.dap_extension.foreground);
