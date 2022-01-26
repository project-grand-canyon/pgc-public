import React, { Component } from "react";
import styles from "./Preferences.module.css";
import { Modal, Typography } from "antd";

import axios_api from "../../util/axios-api";
import SimpleLayout from "../Layout/SimpleLayout/SimpleLayout";

import getUrlParameter from "../../util/urlparams";
import PreferencesForm from "./PreferencesForm/PreferencesForm";

class Preferences extends Component {
  state = {
    caller: null,
    districts: null,
    callerId: "",
    trackingId: "",
    isFetching: true
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
  }

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
      })
      .finally(() => {
          this.setState({isFetching: false});
      })
  };

  handleFormSubmit = (fieldsValues) => {
    const {
      contactMethods,
      district,
      zipCode,
      firstName,
      lastName,
      phone,
      email,
      paused
    } = fieldsValues;

    let notes = this.state.caller.notes || "";

    if (paused != this.state.caller.paused) {
        if (paused == true) {
            notes = `${new Date().toDateString()} caller self-serve paused\n` + notes;
        } else {
            notes = `${new Date().toDateString()} caller self-serve unpaused\n` + notes;
        }
    }

    const caller = {
      districtId: district.districtId,
      zipCode,
      firstName,
      lastName,
      contactMethods,
      email,
      paused,
      notes: notes,
    };

    if (phone) {
      caller["phone"] = phone;
    }

    this.setState({ isFetching: true }, () => {

        axios_api
      .put(`callers/${this.state.callerId}`, caller, {
        auth: {
          username: this.state.callerId,
          password: this.state.trackingId,
        },
      })
      .then((response) => {
        this.setState({caller: response.data})
      })
      .catch((error) => {
        const errMessage = error.response.data.message;

        Modal.error({
          title: "There was an error submitting the form",
          content: (
            <div>
              <p>{`${errMessage}`}</p>
            </div>
          ),
        });
      }).finally(() => {
          this.setState({isFetching: false});
      });
    });
  };

  render() {
    return (
      <SimpleLayout>
        <div>
          <Typography.Title level={2} className={styles.Title}>
            Edit Your Preferences
          </Typography.Title>
          <PreferencesForm
            isFetching={this.state.isFetching}
            fetchError={this.state.fetchError}
            districts={this.state.districts}
            caller={this.state.caller}
            onSuccessfulSubmit={this.handleFormSubmit}
          />
        </div>
      </SimpleLayout>
    );
  }
}

export default Preferences;
