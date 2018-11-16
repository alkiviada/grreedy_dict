import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";
import { clearFetchedNote, requestNote, postNote } from '../actions/notesActions';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  notes: state.notes.allNotes,
  fetchingMap: state.notes.fetchingMap,
  fetched: state.notes.fetchedNote,
});

class WordNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      note: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAddNote = this.handleAddNote.bind(this);
  }

  handleChange(event) {
   if (this.props.fetched) {
     this.props.clearFetchedNote();
   }
   this.setState({note: event.target.value});
  }

  handleAddNote(event) {
    event.preventDefault();
    console.log('adding note');
    const { word, notes, fetchingMap } = this.props;
    const note = this.state.note ? this.state.note : notes[word] ? notes[word]['note'] : ''
    if (note) {
      this.props.requestNote(word, fetchingMap)
      this.props.postNote(word, note, notes, fetchingMap);
    }
  }

  render() {
    const { word, notes, fetchingMap } = this.props;
    const note = !this.props.fetched ? this.state.note : notes[word] ? notes[word]['note'] : '';
    console.log(notes)
    console.log(`i have this note: ${note}`)
    console.log(fetchingMap)
    if (fetchingMap[word]) {
      return (
            <em>Loading...</em>
      )
    }
    return (
      <form className="add-note-form" onSubmit={this.handleAddNote}>
          <textarea className="note-txtarea" value={note} onChange={this.handleChange} />
          <a className="add-note-btn" onClick={(e) => this.handleAddNote(e)}>Add Note</a>
      </form>
    );
  }
}

WordNote.propTypes = {
  word: PropTypes.string.isRequired,
  note: PropTypes.string.isRequired,
  fetchingMap: PropTypes.object.isRequired,
};  

const mapDispatchToProps = {
          postNote, 
          requestNote,
          clearFetchedNote,
}
    
export default connect(mapStateToProps, mapDispatchToProps)(WordNote);
