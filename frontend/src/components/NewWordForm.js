import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { lookUpWord } from '../actions/wordsActions';


const lookUpBtn = {
  backgroundColor: '#856831',
  borderColor: 'transparent',
  color: '#fff',
};

class NewWordForm extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      word: '',
    };
    this.handleWordChange = this.handleWordChange.bind(this);
    this.onSubmit = this.onSubmitLookUp.bind(this);
  };

  handleWordChange(w) {
   this.setState({word: w.target.value});
  }

  onSubmitLookUp(e) {
    e.preventDefault();
    console.log('looking up');
    console.log(this.props.allWordsMap);
    if (!this.props.allWordsMap[this.state.word]) {
      this.props.lookUpWord(this.state.word, this.props.allWords);
    }
    this.setState({word: ''});
  }

  render () {
    return (
      <form onSubmit={(e) => this.onSubmitLookUp(e)}> 
      <div className="field has-addons has-addons-centered">
        <p className="control">
        <input class="input" type="text" placeholder="New Word" value={this.state.word} onChange={this.handleWordChange} />
        </p>
        <p class="control">
        <a class="button" style={lookUpBtn} onClick={(e) => this.onSubmitLookUp(e)}>
          Look Up
        </a>
        </p>
      </div>
    </form> 
    );
  }
};

const mapStateToProps = state => ({
  allWordsMap: state.words.allWordsMap,
  allWords: state.words.items,
});


NewWordForm.propTypes = {
  lookUpWord: PropTypes.func.isRequired
};

export default connect(mapStateToProps, { lookUpWord })(NewWordForm);
