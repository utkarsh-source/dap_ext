import axios from "axios";

export default axios.create({
  baseURL: "https://dap.digitalaidedschool.com:5000/",

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
