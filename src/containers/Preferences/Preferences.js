import React, { Component } from "react";
import styles from "./Preferences.module.css";
import { Button, Col, Divider, Modal, Popconfirm, Row, Typography } from "antd";

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
    isFetching: true,
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
        this.setState({ isFetching: false });
      });
  };

  handleFormSubmit = (fieldsValues) => {
    const {
      contactMethods,
      district,
      zipCode,
      firstName,
      reminderDayOfMonth,
      lastName,
      phone,
      email,
      paused,
    } = fieldsValues;

    let notes = this.state.caller.notes || "";

    if (paused !== this.state.caller.paused) {
      if (paused === true) {
        notes =
          `${new Date().toDateString()} caller self-serve paused\n` + notes;
      } else {
        notes =
          `${new Date().toDateString()} caller self-serve unpaused\n` + notes;
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
      reminderDayOfMonth,
      notes: notes,
    };

    if (phone) {
      caller["phone"] = phone;
    }

    this.updateCaller(caller);
  };

  confirmUnsubscribed = () => {
    
    const {
      contactMethods,
      districtId,
      zipCode,
      firstName,
      lastName,
      phone,
      email,
      paused,
      notes,
      reminderDayOfMonth
    } = this.state.caller;

    const caller = {
        zipCode,
        firstName,
        lastName,
        contactMethods,
        email,
        phone,
        districtId,
        reminderDayOfMonth,
        paused,
        notes,
      };

    caller.unsubscribed = true;
    caller.unsubscribedReason = `caller self-serve unsubscribed`;
    
    this.updateCaller(caller);
  }

  updateCaller = (caller) => {
    this.setState({ isFetching: true }, () => {
        axios_api
          .put(`callers/${this.state.callerId}`, caller, {
            auth: {
              username: this.state.callerId,
              password: this.state.trackingId,
            },
          })
          .then((response) => {
            this.setState({ caller: response.data });
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
          })
          .finally(() => {
            this.setState({ isFetching: false });
          });
      });
  }

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
          <Divider />
          <Typography.Title level={4} className={styles.Title}>
            Or...
          </Typography.Title>
          <Typography.Title level={2} className={styles.Title}>
            Unsubscribe from all notifications?
          </Typography.Title>
          <Row>
              <Col span={12} offset={6}>
          <Popconfirm
            title="Are you sure you want to unsubscribe from all future notifications?"
            onConfirm={this.confirmUnsubscribed}
            okText="Yes"
            cancelText="No"
          >
            <Button loading={this.state.isFetching} disabled={this.state.fetchError || (this.state.caller && this.state.caller.unsubscribed) } block={true} type="danger" size="large" >Unsubscribe from all notifications</Button>
          </Popconfirm>
          </Col>
          </Row>
        </div>
      </SimpleLayout>
    );
  }
}

export default Preferences;
