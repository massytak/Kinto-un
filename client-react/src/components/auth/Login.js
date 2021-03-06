/** @format */

import React, { Component } from "react";
import { login } from "./auth-service";
import { Link, Redirect } from "react-router-dom";
import "../../Styling/login.css";

class Login extends Component {
  state = { username: "", password: "", err: null };

  handleFormSubmit = (event) => {
    event.preventDefault();
    const username = this.state.username;
    const password = this.state.password;

    login(username, password)
      .then((response) => {
        this.setState({ username: "", password: "" });
        this.props.updateUser(response);
        this.props.history.push("/");
      })
      .catch((error) => {
        this.setState({ err: error.response.data.message });
        setTimeout(() => {
          this.setState({
            err: null,
          });
        }, 3000);
      });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const divstyle = {
      paddingTop: "4em",
    };
    return (
      <div>
        {this.props.userInSession ? (
          <Redirect to="/" />
        ) : (
          <div style={divstyle}>
            <form className="loginsub" onSubmit={this.handleFormSubmit}>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={(e) => this.handleChange(e)}
              />

              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={(e) => this.handleChange(e)}
              />
              <p style={styles.error}>{this.state.err}</p>
              <button className="buttonlogin" type="submit" value="Login">
                Log in
              </button>
              <p className="loginP">
                Don't have account?
                <Link className="linklogin" to={"/signup"}>
                  Register
                </Link>
              </p>
            </form>
          </div>
        )}
      </div>
    );
  }
}

const styles = {
  error: {
    padding:"1em",
    color: "red",
    textShadow: "-2px 0 black, 0 2px black, 2px 0 black, 0 -2px black",
    alignItems: "center",
  },
};

export default Login;
