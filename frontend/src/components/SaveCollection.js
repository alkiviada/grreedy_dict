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
    this.props.saveCollection(name, uuid, this.props.allWords.map(e => e.word).join(','));
    const root = ReactDOM.findDOMNode(this).parentNode;
    window.scrollTo(0, root.offsetTop-35)
    this.setState({name: ''})
  }

  render () {
    const words = this.props.allWords;
    const saving = this.props.saving
    const name = !this.props.fetched ? this.state.name : this.props.name
    console.log(this.props.error)

    const auth = this.props.auth

    if (auth.isAuthenticated) { 
      if (words.length) {
        return (
        !saving ?
        <div className="colls-footer">
        <form className="save-coll" onSubmit={(e) => this.onSubmitSave(e)}> 
          <input class="save-coll-input" type="text" placeholder="Save Collection" value={name} onChange={this.handleNameChange} />
          <a className="save-btn" onClick={(e) => this.onSubmitSave(e)}>Save Words</a>
        { this.props.error ?  <p className="grid-warn">Can't save this collection</p> : '' }
      </form>  
      <div className="user-tag">
      {auth.user.username} (<a onClick={this.props.logout}>logout</a>)
      </div>
      </div>
      : <div className="colls-footer">
        <div className="save-coll"><p className="grid-notification"><em>Saving...</em></p></div>
      <div className="user-tag">
      {auth.user.username} (<a onClick={this.props.logout}>logout</a>)
      </div>
        </div>
      );
    }
    else {
        return (
        <div className="colls-footer">
     <div className="user-tag">
      {auth.user.username} (<a onClick={this.props.logout}>logout</a>)
      </div>
        </div>
    )
    }
    }
    else {
      if (words.length) {
        return this.props.error ? (
        <div className="save-coll">
        <div className="coll-invite">To work with collections, please, <Link className="is-link" to="/login">login</Link> or <Link className="is-link" to="/register">register</Link>
        </div></div>
        ) : (
        <div className="colls-footer">
        <div className="save-coll">
        <div className="coll-invite"><Link className="is-link" to="/login">Login</Link> or <Link className="is-link" to="/register">Register</Link> to save this collection of words</div>
        </div>
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
