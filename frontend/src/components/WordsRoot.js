import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import Login from "./Login";
import NotFound from "./NotFound";
import Register from "./Register";
import { Switch, Route, Router } from 'react-router-dom'
import { Redirect } from "react-router-dom";
import DictionaryList from "./DictionaryList";
import DictionaryEntry from "./DictionaryEntry";
import Book from "./Book";
import Lesson from "./Lesson";
import LessonsList from "./LessonsList";
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
    console.log(this.state)
    console.log(this.props)
    console.log('render root')
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/logout" component={DictionaryList} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/book/:what/:page?" component={Book} />
          <Route exact path="/word/:word?" component={DictionaryEntry} />
          <Route exact path="/lesson/post/:lesson_id?" component={Lesson} />
          <Route exact path="/lessons" component={LessonsList} />
          <Route exact path="/lesson/:lesson_id?" component={Lesson} />
          <PrivateRoute path="/:page_id?" component={DictionaryList} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  collections: state.collections,
  words: state.words,
});

export default connect(mapStateToProps, { loadUser })(WordsRoot);
