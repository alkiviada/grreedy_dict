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
    this.saveCollectionLabelRef = React.createRef()
    this.state = {
      name: '',
      label: 'floating-label',
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.inputOrLabel = this.inputOrLabel.bind(this) 
    this.hideLabel = this.hideLabel.bind(this) 
    this.showLabel = this.showLabel.bind(this) 
    this.onSubmit = this.onSubmitSave.bind(this);
  };

  componentDidMount() {
    console.log('mounting save bar');
  }

  hideLabel(e, labelRef) {
    const key = labelRef.current.htmlFor 
    this.setState({ label: 'floating-label top-label' });
  }

  showLabel(e, labelRef) {
    this.setState({ label: 'floating-label' });
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
    this.props.saveCollection(name, this.props.allWords.map(e => e.word).join(','));
    const root = ReactDOM.findDOMNode(this).parentNode;
    window.scrollTo(0, root.offsetTop-35)
    this.setState({name: ''})
  }

  render () {
    const words = this.props.allWords;
    const { fetched, error, saving } = this.props;
    const name = !fetched ? (this.state.name ? this.state.name : this.props.name) : this.props.name
    const label = error ? 'floating-label top-label error' : name ? 'floating-label top-label' : this.state.label
    const inputClass = error ? 'input error' : 'input'
    const labelText = error ? "Cant' save collection" : 'Name Collection'

    const auth = this.props.auth

    if (auth.isAuthenticated) { 
      if (words.length) {
        return (
        !saving ?
        <form className="save-coll" onSubmit={(e) => this.onSubmitSave(e)}> 
       <div className="input-form-wrapper">
        <label className={label} htmlFor="save-coll" ref={this.saveCollectionLabelRef}>{labelText}</label>
        <input className={inputClass} onFocus={(e) => this.hideLabel(e, this.saveCollectionLabelRef)} onInput={(e) => this.inputOrLabel(e, this.saveCollectionLabelRef)} onBlur={(e) => this.inputOrLabel(e, this.saveCollectionLabelRef)} type="text" value={name} onChange={this.handleNameChange} id="save-coll" />
    <button className="save-coll-button">
    &#9660;
    </button>
</div>
    </form> : 
      <div className="colls-footer">
        <div className="save-coll"><p className="grid-notification"><em>Saving...</em></p></div>
        </div>
      );
    }
    else {
      return (
        <div className="colls-footer">
        </div>
      )
    }
    }
    else {
      if (words.length) {
        return this.props.error ? (
        <div className="coll-invite">To work with collections, please, <Link className="is-link" to="/login">login</Link> or <Link className="is-link" to="/register">register</Link>
        </div>
        ) : (
        <div className="colls-footer">
        <div className="coll-invite"><Link className="is-link" to="/login">Login</Link> or <Link className="is-link" to="/register">Register</Link> to save this collection</div>
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
