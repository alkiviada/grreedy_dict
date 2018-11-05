import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login, loadUser, clearLoginError } from '../actions/authActions';
import { Link, Redirect } from "react-router-dom";
import BodyClassName from 'react-body-classname';

class Login extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      username: '',
      password: '',
    };
    this.onSubmit = this.onSubmitLogin.bind(this);
  };

  componentDidMount() {
    console.log('i am mounting what else?')
    if (!this.props.isAuthenticated) {
    this.props.clearLoginError();
    }
  }

  onSubmitLogin(e) {
    e.preventDefault();
    console.log('login');
    this.props.login(this.state.username, this.state.password);
  }

  render () {
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    }
    console.log('rendering login');
    return (
      <BodyClassName className="body-with-image">
      <div className="login-container">
      <form  className="login-form" onSubmit={(e) => this.onSubmitLogin(e)}> 
        { this.props.errors.non_field_errors ? <span className="login-warn">{this.props.errors.non_field_errors}</span> : ''}
      <label className="login-label">Whose there?</label>
        <input className="login-username-input" type="text" placeholder="Username" id="username" onChange={e => this.setState({username: e.target.value})} />
        { this.props.errors.username ? <span className="login-warn">{this.props.errors.username}</span> : ''}
      <label className="login-label">Unfold yourself!</label>
        <input className="login-pass-input" type="password" placeholder="Password" id="password" onChange={e => this.setState({password: e.target.value})} />
        { this.props.errors.password ? <span className="login-warn">{this.props.errors.password}</span> : ''}
        <a className="login-btn" onClick={(e) => this.onSubmitLogin(e)}>
         Login 
        </a>
        <span className="register-invite">Do not have an account? <Link className="is-link" to="/register">Register</Link></span>
    </form>
    </div>
    </BodyClassName>
    );
  }
};

const mapStateToProps = state => {
  let errors = {};
  if (state.auth.loginErrors) {
    console.log(state.auth.loginErrors)
    Object.keys(state.auth.loginErrors).map(field => errors[field] = state.auth.loginErrors[field][0] );
  }
  console.log(errors)
  return {
    errors,
    isAuthenticated: state.auth.isAuthenticated
  };
}

export default connect(mapStateToProps, { login, loadUser, clearLoginError })(Login);
