import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import Login from "./Login";
import NotFound from "./NotFound";
import Register from "./Register";
import { Switch, Route, Router } from 'react-router-dom'
import { Redirect } from "react-router-dom";
import Dictionary from "./Dictionary";
import { loadUser } from '../actions/authActions';

import createBrowserHistory from 'history/createBrowserHistory'

export const history = createBrowserHistory()

class WordsRoot extends Component {

  componentDidMount() {
    console.log('i am mounting words root')
    console.log(this.props)
    this.props.loadUser();
  }

  PrivateRoute = ({component: ChildComponent, ...rest}) => {
    return <Route {...rest} render={props => {
      if (this.props.auth.isLoading) {
        return <em>Loading...</em>;
      } else {
        return <ChildComponent {...props} />
      }
    }} />
  }

  render() {
    let {PrivateRoute} = this;
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/logout" component={Dictionary} />
          <Route exact path="/register" component={Register} />
          <PrivateRoute path="/:page_id?" component={Dictionary} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { loadUser })(WordsRoot);
