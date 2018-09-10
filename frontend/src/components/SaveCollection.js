import React, { Component } from 'react';
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
    this.props.saveCollection(this.state.name, this.props.allWords);
    this.setState({name: ''});
  }

  render () {
    console.log('rendering save form');
    return (
      <div className="save-coll notification coll-notification">
      <form onSubmit={(e) => this.onSubmitSave(e)}> 
      <div className="field has-addons has-addons-centered">
        <p className="control">
        <input class="input" type="text" placeholder="New Collection" value={this.state.name} onChange={this.handleNameChange} />
        </p>
        <p className="control">
        <a className="button save-btn" onClick={(e) => this.onSubmitSave(e)}>
         Save Words 
        </a>
        </p>
      </div>
    </form> 
    { this.props.saving? <p className="clear-notification-message">Saving...</p> : 
        this.props.error ? <p className="clear-notification-warn">Can't save this collection</p> : ''}
    </div>
    );
  }
};

const mapStateToProps = state => ({
  allWords: state.words.items,
  saving: state.collections.saving,
  error: state.collections.error,
});

SaveCollection.propTypes = {
  saveCollection: PropTypes.func.isRequired,
  requestSave: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { saveCollection, requestSave })(SaveCollection);
