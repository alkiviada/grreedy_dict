import React, { Component } from 'react';
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveCollection, requestSave } from '../actions/collectionsActions';

class SaveCollection extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      name: '',
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.onSubmit = this.onSubmitSave.bind(this);
  };

  handleNameChange(n) {
   this.setState({name: n.target.value});
  }

  onSubmitSave(e) {
    e.preventDefault();
    console.log('saving');
    this.props.requestSave();
    const { uuid } = this.props
    const name = this.state.name;
    console.log(name);
    this.props.saveCollection(name, uuid, this.props.allWords.map(e => e.word).join(','));
    const root = ReactDOM.findDOMNode(this).parentNode;
    window.scrollTo(0, root.offsetTop-35)
  }

  render () {
    const words = this.props.allWords;
    const saving = this.props.saving
    const name = this.props.name
    console.log(name);
    return words.length ? (
      <div className="save-coll notification coll-notification column">
      { !saving ?
      <form onSubmit={(e) => this.onSubmitSave(e)}> 
      <div className="field has-addons has-addons-left">
        <p className="control">
        <input class="input" type="text" placeholder="Save Collection" value={this.state.name} onChange={this.handleNameChange} />
        </p>
        <p className="control">
        <a className="button save-btn" onClick={(e) => this.onSubmitSave(e)}>
         Save Words 
        </a>
        </p>
      </div>
    </form>  : '' }
    { saving ? <p className="clear-notification-message">Saving...</p> : 
      this.props.error ? <p className="clear-notification-warn">Can't save this collection</p> : ''}
    </div>
    ) : '';
  }
};

const mapStateToProps = state => ({
  allWords: state.words.items,
  saving: state.collections.saving,
  name: state.collections.name,
  uuid: state.collections.uuid,
  error: state.collections.error,
});

SaveCollection.propTypes = {
  saveCollection: PropTypes.func.isRequired,
  requestSave: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, { saveCollection, requestSave })(SaveCollection);
