import React, { Component } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";

class Navbar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();

    // this.props.history.push("/login");
  };
  render() {
    console.log(this.props);
    const { user, isAuthenticated } = this.props.auth;

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="feed.html">
            Post Feed
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="dashboard.html">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            to="#"
            onClick={this.onLogoutClick.bind(this)}
          >
            <img
              className="rounded-circle"
              style={{ width: "25px", marginRight: "5px" }}
              src="https://www.gravatar.com/avatar/anything?s=200&d=mm"
              alt=""
              title="You must have a Gravatar connected to your email to display an image"
            />{" "}
            Logout
          </Link>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            DevConnector
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/profiles">
                  {" "}
                  Developers
                </Link>
              </li>
            </ul>

            {isAuthenticated === true ? authLinks : guestLinks}
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, clearCurrentProfile }
)(Navbar);
