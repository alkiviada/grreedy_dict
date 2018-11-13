import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";
import { clearFetched } from '../actions/notesActions';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  notes: state.notes.allNotes,
  fetchingMap: state.notes.fetchingMap,
  fetched: state.notes.fetched,
});

class WordNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAddNote = this.handleAddNote.bind(this);
  }

  handleChange(event) {
   if (this.props.fetched) {
     this.props.clearFetched();
   }
   this.setState({note: event.target.value});
  }

  handleAddNote(event) {
    event.preventDefault();
  }

  render() {
    const { word, notes, fetchingMap } = this.props;
    const note = !this.props.fetched ? this.state.note : notes[word] ? notes[word]['note'] : '';
    console.log(notes)
    console.log(`i have this note: ${note}`)
    if (fetchingMap[word]) {
      return (
            <em>Loading...</em>
      )
    }
    return (
      <form className="add-note-form" onSubmit={this.handleAddNote}>
          <textarea className="note-txtarea" value={note} onChange={this.handleChange} />
          <a className="add-note-btn" onClick={(e) => this.handelAddNote(e)}>Add Note</a>
      </form>
    );
  }
}

WordNote.propTypes = {
  word: PropTypes.string.isRequired,
  note: PropTypes.string.isRequired,
  fetchingMap: PropTypes.object.isRequired,
};  
    
export default connect(mapStateToProps)(WordNote);
