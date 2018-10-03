import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { login, loadUser } from '../actions/authActions';
import { Link, Redirect } from "react-router-dom";

class Login extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      username: '',
      password: '',
    };
    this.onSubmit = this.onSubmitLogin.bind(this);
  };

  onSubmitLogin(e) {
    e.preventDefault();
    console.log('login');
    this.props.login(this.state.username, this.state.password);
  }

  render () {
    console.log(this.props)
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    }
    console.log('rendering login');
    return (
      <div className="section">
      <div className="container">
      <div className="columns is-mobile is-centered">
      <div className="column is-narrow">
      <form onSubmit={(e) => this.onSubmitLogin(e)}> 
       {this.props.errors.length > 0 && (
            <ul>
              {this.props.errors.map(error => (
                <li key={error.field}>{error.message}</li>
              ))}
            </ul>
          )}
      <div class="field">
      <label class="label">Whose there?</label>
       <div class="control">
        <input className="input" type="text" placeholder="Username" id="username" onChange={e => this.setState({username: e.target.value})} />
       </div>
      </div>
      <div class="field">
      <label class="label">Unfold yourself!</label>
       <div class="control">
        <input className="input" type="password" placeholder="Password" id="password" onChange={e => this.setState({password: e.target.value})} />
        </div>
      </div>
      <div class="field">
        <div className="control">
        <a className="button look-up-btn" onClick={(e) => this.onSubmitLogin(e)}>
         Login 
        </a>
        </div>
        </div>
        <div className="control">
        Do not have an account? <Link className="is-link" to="/register">Register</Link>
        </div>
    </form>
    </div>
    </div>
    </div>
    </div>
    );
  }
};

const mapStateToProps = state => {
  let errors = [];
  if (state.auth.loginErrors) {
    console.log(state.auth.loginErrors)
    errors = Object.keys(state.auth.loginErrors).map(field => {
      return {field, message: state.auth.loginErrors[field]};
    });
  }
  return {
    errors,
    isAuthenticated: state.auth.isAuthenticated
  };
}

export default connect(mapStateToProps, { login, loadUser })(Login);
