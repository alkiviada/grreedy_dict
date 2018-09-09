import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import DecorateWithLinks from "./DecorateWithLinks";
import Translations from "./Translations";
import key from "weak-key";
import { connect } from 'react-redux';
import { lookUpTranslations, requestTranslations, switchTab } from '../actions/transActions';

const mapStateToProps = state => ({
  mapTabIndex: state.translations.mapTabIndex,
  allTranslations: state.translations.allTranslations,
  fetchingMap: state.translations.fetchingMap,
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
        if (!this.props.allTranslations[word]) {
          console.log('looking up translations'); 
          this.props.requestTranslations(word, this.props.fetchingMap)
          this.props.lookUpTranslations(word, this.props.allTranslations, this.props.fetchingMap)
        }
      default:
        Function.prototype()
    }
  }

  render() {
    const { word, element, fn } = this.props;
    const is_english_word = element.reduce((english_flag, e) => 
      {return e['language'] === 'english' ?  ++english_flag : english_flag}, 0)
    console.log(is_english_word);
    return ( 
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, word)}>
        <TabList>
          <Tab>Original Word</Tab>
          { is_english_word ? <Tab>Translations</Tab> : <Tab>Collocations</Tab> }
          <Tab>Synonyms</Tab>
        </TabList>
        <TabPanel>
          { element.map(e => 
                <div>
                <p className={`heading lang-head lang-${e['language']}`}>{e['language']}</p>
                { renderList(e['etymology'], fn[0], listStyles, 0) }
                </div>
               )
          }
        </TabPanel>
        <TabPanel>
          { is_english_word ? <Translations word={word} fn={fn[0]}/> : ''}
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
  if (!el.length) { 
    return ''
  }
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

export default connect(mapStateToProps, { switchTab, lookUpTranslations, requestTranslations })(WordTabs);
