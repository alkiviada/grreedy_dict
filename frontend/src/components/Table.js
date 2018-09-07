import React, { Component } from "react";
import PropTypes from "prop-types";
import WordTabs from "./WordTabs";
import key from "weak-key";
import { connect } from 'react-redux';
import { lookUpWord, fetchWords, requestWords } from '../actions/wordsActions';


class Table extends Component {
  constructor(props) { 
    super(props)
    this.addRow = this.addRow.bind(this) 
  }
  componentWillMount() {
    console.log('mounting table');
    this.props.requestWords();
    this.props.fetchWords();
  }

  addRow (e, word) {
    console.log('look up');
    e.preventDefault();
    console.log(this.props.allWordsMap);
    console.log('checking map');
    if (!this.props.allWordsMap[word]) {
      this.props.requestWords();
      this.props.lookUpWord(word, this.props.data);
    }
  }

  render () {
    const data = this.props.data;
    const fetching = this.props.fetching;
    if (fetching && !data.length) {
      return <p className="clear-notification-message">Loading...</p> 
    } 
    return !data.length ? (
      <div className="container">
      <div className="notification" className="clear-notification-message">
      Nothing to show
      </div>
      </div>
    ) : (
    <div className="column">
      <h2 className="subtitle">
        Showing <strong>{data.length} items</strong>
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
    );
  }
}

const mapStateToProps = state => ({
  data: state.words.items,
  allWordsMap: state.words.allWordsMap,
  fetching: state.words.allWordsFetching,
});

Table.propTypes = {
  data: PropTypes.array.isRequired,
  lookUpWord: PropTypes.func.isRequired,
  fetchWords: PropTypes.func.isRequired,
  requestWords: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, { lookUpWord, fetchWords, requestWords })(Table);
