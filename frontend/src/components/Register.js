import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { register, loadUser } from '../actions/authActions';
import { Link, Redirect } from "react-router-dom";
import BodyClassName from 'react-body-classname';

class Register extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      username: '',
      password: '',
    };
    this.onSubmit = this.onSubmitRegister.bind(this);
  };


  onSubmitRegister(e) {
    e.preventDefault();
    console.log('register');
    this.props.register(this.state.username, this.state.password);
  }

  render () {
    console.log(this.props)
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    }
    console.log('rendering register');
    return (
      <BodyClassName className="body-with-image">
      <div className="login-container">
      <form className="register-form" onSubmit={(e) => this.onSubmitRegister(e)}> 
        { this.props.errors.username ? <span className="register-warn">{this.props.errors.username}</span> : ''}
        <input className="register-user" type="text" placeholder="Username" id="username" onChange={e => this.setState({username: e.target.value})} />
        { this.props.errors.password ? <span className="register-warn">{this.props.errors.password}</span> : ''}
        <input className="register-pass" type="password" placeholder="Password" id="password" onChange={e => this.setState({password: e.target.value})} />
        <a className="register-btn" onClick={(e) => this.onSubmitRegister(e)}>
        Register
        </a>
        <span className="login-invite">Already have an account? <Link className="is-link" to="/login">Login</Link></span>
    </form>
    </div>
    </BodyClassName>
    );
  }
};

const mapStateToProps = state => {
  let errors = {};
  console.log(`Errors ${state.auth.registerErrors}`)
  if (state.auth.registerErrors) {
    Object.keys(state.auth.registerErrors).map(field => errors[field] = state.auth.registerErrors[field][0] );
  }
  console.log(errors)
  return {
    errors,
    isAuthenticated: state.auth.isAuthenticated
  };
}

export default connect(mapStateToProps, { register, loadUser })(Register);
