import React, { Component } from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveCollection, requestSave, clearFetched } from '../actions/collectionsActions';
import { loadUser, logout } from '../actions/authActions';
import { Link } from "react-router-dom";

class SaveCollection extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      name: '',
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.onSubmit = this.onSubmitSave.bind(this);
  };

  componentWillMount() {
    console.log('mounting save bar');
    console.log(this.props.auth)
  }

  handleNameChange(n) {
   if (this.props.fetched) {
     this.props.clearFetched();
   }
   this.setState({name: n.target.value});
  }

  onSubmitSave(e) {
    e.preventDefault();
    console.log('saving');
    this.props.requestSave();
    const { uuid } = this.props
    const name = this.state.name ? this.state.name : this.props.name
    console.log(name);
    this.props.saveCollection(name, uuid, this.props.allWords.map(e => e.word).join(','));
    const root = ReactDOM.findDOMNode(this).parentNode;
    window.scrollTo(0, root.offsetTop-35)
    this.setState({name: ''})
  }

  render () {
    const words = this.props.allWords;
    const saving = this.props.saving
    const name = !this.props.fetched ? this.state.name : this.props.name
    console.log(name);

    console.log(this.props.auth)
    const auth = this.props.auth

    const userTagStyle = { bottom: '29px', right: '-34px'}

    if (auth.isAuthenticated) { 
      if (words.length) {
        return (
        <div className="save-coll coll-notification column">
        { !saving ?
        <form onSubmit={(e) => this.onSubmitSave(e)}> 
        <div className="field is-narrow has-addons has-addons-left save-form is-grouped-multiline">
          <p className="control">
          <input class="input" type="text" placeholder="Save Collection" value={name} onChange={this.handleNameChange} />
          </p>
          <p className="control">
          <a className="button save-btn" onClick={(e) => this.onSubmitSave(e)}>
           Save Words 
          </a>
          </p>
      <div className="control user-tag">
      {auth.user.username} (<a onClick={this.props.logout}>logout</a>)
      </div>
        </div>
      </form>  : '' }
      { saving ? <p className="clear-notification-message">Saving...</p> : 
        this.props.error ? <p className="clear-notification-warn">Can't save this collection</p> : ''}
      </div>
      );
    }
    else {
        return (
        <div className="save-coll notification coll-notification column is-mobile">
     <div className="user-tag">
      {auth.user.username} (<a onClick={this.props.logout}>logout</a>)
      </div>
        </div>
    )
    }
    }
    else {
      if (words.length) {
        return (
        <div className="save-coll notification coll-notification column is-mobile">
        <div className="login-notif"><Link className="is-link" to="/login">Login</Link> or <Link className="is-link" to="/register">Register</Link> to save this collection of words</div>
        </div>
       )
      }
      else {
        return ''
      }
   }
  }
};

const mapStateToProps = state => ({
  allWords: state.words.items,
  saving: state.collections.saving,
  fetched: state.collections.fetched,
  name: state.collections.name,
  uuid: state.collections.uuid,
  error: state.collections.error,
  auth: state.auth,
});

SaveCollection.propTypes = {
  saveCollection: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  requestSave: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, { logout, loadUser, saveCollection, requestSave, clearFetched })(SaveCollection);
