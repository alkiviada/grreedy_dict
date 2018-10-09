import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import Login from "./Login";
import NotFound from "./NotFound";
import Register from "./Register";
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import Dictionary from "./Dictionary";
import { loadUser } from '../actions/authActions';

class WordsRoot extends Component {

  componentDidMount() {
    this.props.loadUser();
  }

  PrivateRoute = ({component: ChildComponent, ...rest}) => {
    return <Route {...rest} render={props => {
      if (this.props.auth.isLoading) {
        return <em>Loading...</em>;
      } else if (!this.props.auth.isAuthenticated) {
        return <Redirect to="/login" />;
      } else {
        return <ChildComponent {...props} />
      }
    }} />
  }

  render() {
    let {PrivateRoute} = this;
    return (
      <BrowserRouter>
        <Switch>
          <PrivateRoute exact path="/" component={Dictionary} />
          <Route exact path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});




export default connect(mapStateToProps, { loadUser })(WordsRoot);
