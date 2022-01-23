import React, { Component } from "react";
import styles from "./Preferences.module.css";

import axios_api from "../../util/axios-api";

import getUrlParameter from "../../util/urlparams";

class Preferences extends Component {
  state = {
    callerId: "",
    trackingId: "",
  };

  componentDidMount() {
    const params = this.props.history.location.search;
    const trackingId = getUrlParameter(params, "t");
    const callerId = getUrlParameter(params, "c");
    this.setState(
      {
        trackingId: trackingId,
        callerId: callerId,
      },
      () => {
        this.fetchCallerDetails();
      }
    );
    // this.removeGetArgs();
  }

  removeGetArgs = () => {
    this.props.history.push({
      pathname: this.props.history.location.pathname,
      search: "",
      state: { ...this.state },
    });
  };

  fetchCallerDetails = () => {
    const callerRequest = axios_api.get(`callers/${this.state.callerId}`, {
      auth: {
        username: this.state.callerId,
        password: this.state.trackingId,
      },
    });

    const districtsRequest = axios_api.get("districts");

    Promise.all([callerRequest, districtsRequest])
      .then((responses) => {
        const caller = responses[0].data;
        const districts = responses[1].data;
        this.setState({
          caller: caller,
          districts: districts,
          fetchError: null,
        });
      })
      .catch((error) => {
        this.setState({
          caller: null,
          districts: null,
          fetchError: error,
        });
      });
  };

  render() {
    return (
      <>
        <p>{this.state.trackingId ? this.state.trackingId : "No tracking id provided"}</p>
        <p>{this.state.callerId ? this.state.callerId : "No caller id provided"}</p>
        <p>{this.state.caller ? JSON.stringify(this.state.caller) : "No caller info yet"}</p>
        <p>{this.state.districts ? JSON.stringify(this.state.districts).substring(0,100) : "No districts info yet"}</p>
        <p>{this.state.fetchError ? this.state.fetchError.message : "Fetching..."}</p>
      </>
    );
  }
}

export default Preferences;
