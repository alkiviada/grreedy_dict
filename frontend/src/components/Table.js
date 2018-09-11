import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import WordTabs from "./WordTabs";
import key from "weak-key";
import { connect } from 'react-redux';
import { lookUpWord, fetchWords, requestWords, requestWord } from '../actions/wordsActions';


class Table extends Component {
  constructor(props) { 
    super(props)
    this.addRow = this.addRow.bind(this) 
    this.myRef = React.createRef();
  }
  static propTypes = {
    data: PropTypes.array.isRequired,
    lookUpWord: PropTypes.func.isRequired,
    fetchWords: PropTypes.func.isRequired,
    requestWords: PropTypes.func.isRequired,
    requestWord: PropTypes.func.isRequired,
  };

  componentWillMount() {
    console.log('mounting table');
    this.props.requestWords();
    this.props.fetchWords();
  }

  addRow (e, word) {
    console.log('look up');
    e.preventDefault();
    console.log('checking map');
    if (!this.props.allWordsMap[word]) {
      this.props.requestWord();
      this.props.lookUpWord(word, this.props.data);
    }
    this.scrollToDomRef()
  }

  scrollToDomRef = () => {
    const domNode = ReactDOM.findDOMNode(this.myRef.current)
    window.scrollTo(0, domNode.offsetTop-35)
  }

  render () {
    const data = this.props.data;
    const allFetching = this.props.allFetching;
    const wordFetching = this.props.newWordFetching;
    if (allFetching && !data.length) {
      return (
        <div className="words-container">
        <div className="clear-notification-message notification">Loading...</div> 
        </div>
      )
    } 
    return !data.length ? (
    <div className="column is-10">
      <div className="words-container" ref={this.myRef}>
      <div className="notification clear-notification-message">
      Start new collection
      </div>
      </div>
      </div>
    ) : (
    <div className="words-container" ref={this.myRef}>
    { wordFetching ? <div className="clear-notification-message">Loading...</div> : '' }
    <div className="column is-10">
      <h2 className="subtitle table-subtitle is-6">
        Showing <strong>{data.length} word{data.length > 1 ? 's' : ''}</strong>
      </h2>
      <table className="table is-striped">
        <thead>
          <tr>
            {Object.entries(data[0]).map(el => <th key={key(el)}>{el[0]}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map(el => {
            let word = el.word;
            return (
              <tr key={el.id}>
                { Object.entries(el).map(el => 
                <td><div className="word" key={key(el)}>
                {typeof(el[1]) === 'string' ? 
                el[1] : 
                <WordTabs word={word} element={el[1]} fn={[this.addRow]} />}
                </div></td>) }
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.words.items,
  allWordsMap: state.words.allWordsMap,
  allFetching: state.words.allWordsFetching,
  wordFetching: state.words.newWordFetching,
});

export default connect(mapStateToProps, { lookUpWord, fetchWords, requestWords, requestWord })(Table);
