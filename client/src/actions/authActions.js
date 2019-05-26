import { GET_ERRORS } from "./types";
import axios from "axios";

export const registerUser = (userData, history) => disppatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      disppatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
