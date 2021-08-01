import { combineReducers } from "redux";
import calls from "./calls";
import notification from "./notification";

export default combineReducers({ calls, notification });
