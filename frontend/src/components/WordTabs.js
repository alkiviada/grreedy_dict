import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import DecorateWithLinks from "./DecorateWithLinks";
import Translations from "./Translations";
import key from "weak-key";
import { connect } from 'react-redux';
import { lookUpTranslations, switchTab } from '../actions/wordsActions';

const mapStateToProps = state => ({
  mapTabIndex: state.words.mapTabIndex,
  allTranslations: state.words.allTranslations,
});

const listStyles = {1: 'etym-style', 2: 'def-style', 3: 'exmpl-style'};

class WordTabs extends Component {
  constructor(props) { 
    super(props)
    this.handleSelect = this.handleSelect.bind(this) 
    let i = this.props.mapTabIndex[this.props.word];
    this.state = { tabIndex: i ? i : 0 };
  }

  static propTypes = {
    switchTab: PropTypes.func.isRequired,
    lookUpTranslations: PropTypes.func.isRequired,
    word: PropTypes.string.isRequired,
    element: PropTypes.array.isRequired,
  };

  handleSelect(prev, index, word) {
    this.props.switchTab(index, word, this.props.mapTabIndex);
    this.setState( { tabIndex: index } );

    const tabMap = { 1: 'TRANSLATIONS' };

    switch (tabMap[index]) {
      case 'TRANSLATIONS':
        console.log('looking up translations'); 
        this.props.lookUpTranslations(word, this.props.allTranslations)
      default:
        Function.prototype()
    }
  }

  render() {
    const { word, element, fn } = this.props;
    if (!(typeof (this.props.mapTabIndex[word]) === 'undefined')) {
    }
    return ( 
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, word)}>
        <TabList>
          <Tab>Original Word</Tab>
          <Tab>Translations</Tab>
          <Tab>Synonyms</Tab>
        </TabList>
        <TabPanel>
          { renderList(element, fn[0], listStyles, 0) }
        </TabPanel>
        <TabPanel>
          <Translations word={word} fn={fn[0]}/> 
        </TabPanel>
        <TabPanel>
        <h2>Any content 2</h2>
        </TabPanel>
     </Tabs>
    );
  }
}

function renderList(el, fn, styles, styleCount) {
  styleCount += 1;
  let listClass = styles[styleCount];
  return el.map(el => (
    <ul className={listClass} key={el.id}>
    <li>
      {Object.entries(el).map(el => typeof(el[1]) === 'string' ? 
      <DecorateWithLinks words={el[1]} onLinkClick={fn}/> : 
      renderList(el[1], fn, styles, styleCount))}
    </li>
    </ul>
   )
  );
}

export default connect(mapStateToProps, { switchTab, lookUpTranslations })(WordTabs);
