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
import Book from "./Book";
import Lesson from "./Lesson";
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
          <Route exact path="/book/:what/:page?" component={Book} />
          <Route exact path="/lesson/post/:lesson_id?" component={Lesson} />
          <Route exact path="/lesson/:lesson_id?" component={Lesson} />
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
