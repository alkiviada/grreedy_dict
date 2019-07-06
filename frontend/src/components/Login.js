import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login, loadUser, clearAuthError } from '../actions/authActions';
import { Link, Redirect } from "react-router-dom";
import BodyClassName from 'react-body-classname';

class Login extends Component {
  constructor(props) { 
    super(props)
    this.usernameLabelRef = React.createRef()
    this.passwordLabelRef = React.createRef()
    this.state = {
      username: '',
      password: '',
      usernameLabel: 'floating-label',
      passwordLabel: 'floating-label',
    };
    this.onSubmit = this.onSubmitLogin.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.inputOrLabel = this.inputOrLabel.bind(this) 
    this.hideLabel = this.hideLabel.bind(this) 
    this.showLabel = this.showLabel.bind(this) 
  };

  handleInputChange(e, iName) {
    console.log(this.props.errors)
    if (this.props.errors.length) {
     this.props.clearAuthError();
    }
    console.log(e)
    this.setState({ [iName]: e.target.value});
  }

  hideLabel(e, labelRef) {
    console.log('focus')
    console.log(this.props.errors)
    if (this.props.errors) {
     this.props.clearAuthError();
    }
    const key = labelRef.current.htmlFor  + 'Label'
    console.log(key)
    this.setState({ [key]: 'floating-label top-label' });
  }

  showLabel(e, labelRef) {
    const key = labelRef.current.htmlFor  + 'Label'
    this.setState({ [key]: 'floating-label' });
  }

  inputOrLabel(e, labelRef) {
    if (e.target.value == "") {
      console.log('hmm')
      this.showLabel(e, labelRef);
    } 
    else if (e.target.value != "") {
      this.hideLabel(e, labelRef);
    }
  }

  componentDidMount() {
    console.log('i am mounting what else?')
    if (!this.props.isAuthenticated) {
    this.props.clearAuthError();
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
    const uError = this.props.errors.username ? 1 : this.props.errors.non_field_errors ? 1 : 0
    const passError = this.props.errors.password ? 1 : this.props.errors.non_field_errors ? 1 : 0
    const username = !uError ? this.state.username : this.props.username
    const password = !passError ? this.state.password : this.props.password
    const usernameLabel = uError ? 'floating-label top-label error' : username ? 'floating-label top-label' : this.state.usernameLabel
    console.log(usernameLabel)
    console.log(this.state.usernameLabel)
    const passwordLabel = passError ? 'floating-label top-label error' : password ? 'floating-label top-label' : this.state.passwordLabel
    const usernameLabelText = uError ? "No friend to this ground!" : 'Whose there?'
    const passwordLabelText = passError ? "Not liegman to the Dane" : 'Unfold yourself!'
    const usernameClass = uError ? 'input error' : 'input'
    const passwordClass = passError ? 'input error' : 'input'
    console.log('rendering login');
    return (
      <BodyClassName className="body-with-image">
<Fragment>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" className="svg-filters">
  <defs>
    <filter id="filter">
      <feTurbulence type="fractalNoise" baseFrequency="0 0.15" numOctaves="1" result="warp" />
      <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="18" in="SourceGraphic" in2="warp" />
    </filter>
  </defs>
</svg>
      <div className="login-container">
      <form  className="login-form" onSubmit={(e) => this.onSubmitLogin(e)}> 
       <div className="login-input-wrapper username">
        <label className={usernameLabel} htmlFor="username" ref={this.usernameLabelRef}>{usernameLabelText}</label>
        <input className={usernameClass} onFocus={(e) => this.hideLabel(e, this.usernameLabelRef)} onInput={(e) => this.inputOrLabel(e, this.usernameLabelRef)} onBlur={(e) => this.inputOrLabel(e, this.usernameLabelRef)} type="text" onChange={(e) => this.handleInputChange(e, 'username')} id="username" />
</div>
       <div className="login-input-wrapper password">
        <label className={passwordLabel} htmlFor="password" ref={this.passwordLabelRef}>{passwordLabelText}</label>
        <input className={passwordClass} onFocus={(e) => this.hideLabel(e, this.passwordLabelRef)} onInput={(e) => this.inputOrLabel(e, this.passwordLabelRef)} onBlur={(e) => this.inputOrLabel(e, this.passwordLabelRef)} type="password" onChange={(e) => this.handleInputChange(e, 'password')} id="password" />
</div>
       <div className="login-input-wrapper button">
        <button className="login-button" onClick={(e) => this.onSubmitLogin(e)}>
         Login 
        </button>
</div>
        <span className="words-invite">Do not have an account? <Link className="is-link" to="/register">Register</Link></span>
    </form>
    </div>

</Fragment>
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

export default connect(mapStateToProps, { login, loadUser, clearAuthError })(Login);
