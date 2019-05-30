import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getCurrentProfile } from "../../actions/profileActions";
import Spinner from "../commons/spinner";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }
  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let DashboardContent;
    if (profile === null || loading) {
      DashboardContent = <Spinner />;
    } else {
      if (Object.keys(profile).length > 0) {
        DashboardContent = <h4>Todo: display profiles</h4>;
      } else {
        DashboardContent = (
          <div>
            <div className="lead text-muted">Welcome, {user.name}</div>
            <p>Yo have not yet setup your profile.</p>
            <Link to="/create-profile" className="btn btn-warning btn-sm">
              Click here to setup profile
            </Link>
          </div>
        );
      }
    }
    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboards</h1>
              {DashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});
export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Dashboard);
