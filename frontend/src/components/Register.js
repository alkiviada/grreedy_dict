import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { register, loadUser } from '../actions/authActions';
import { Link, Redirect } from "react-router-dom";

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
    console.log('login');
    this.props.register(this.state.username, this.state.password);
  }

  render () {
    console.log(this.props)
    if (this.props.isAuthenticated) {
      return <Redirect to="/" />
    }
    console.log('rendering register');
    return (
      <div className="section">
      <div className="container">
      <div className="columns is-mobile is-centered">
      <div className="column is-narrow">
      <form onSubmit={(e) => this.onSubmitRegister(e)}> 
      <div class="field">
       {this.props.errors.length > 0 && (
            <ul>
              {this.props.errors.map(error => (
                <li key={error.field}>{error.message}</li>
              ))}
            </ul>
          )}
       </div>
      <div class="field">
       <div class="control">
        <input className="input" type="text" placeholder="Username" id="username" onChange={e => this.setState({username: e.target.value})} />
       </div>
      </div>
      <div class="field">
       <div class="control">
        <input className="input" type="password" placeholder="Password" id="password" onChange={e => this.setState({password: e.target.value})} />
        </div>
      </div>
      <div class="field">
        <div className="control">
        <a className="button look-up-btn" onClick={(e) => this.onSubmitRegister(e)}>
        Register
        </a>
        </div>
        </div>
        <div className="control">
        Already have an account? <Link className="is-link" to="/login">Login</Link>
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
  if (state.auth.registerErrors) {
  console.log(state.auth.registerErrors)
    errors = Object.keys(state.auth.registerErrors).map(field => {
      return {field, message: state.auth.registerErrors[field]};
    });
  }
  return {
    errors,
    isAuthenticated: state.auth.isAuthenticated
  };
}

export default connect(mapStateToProps, { register, loadUser })(Register);
