import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import DecorateWithLinks from "./DecorateWithLinks";
import Translations from "./Translations";
import key from "weak-key";
import { connect } from 'react-redux';
import { switchTab } from '../actions/tabActions';
import { lookUpTranslations, requestTranslations, } from '../actions/transActions';
import { lookUpCollocations, requestCollocations, } from '../actions/collocationsActions';

const mapStateToProps = state => ({
  mapTabIndex: state.tabs.mapTabIndex,
  allTranslations: state.translations.allTranslations,
  allCollocations: state.collocations.allCollocations,
  transFetchingMap: state.translations.fetchingMap,
  collocsFetchingMap: state.collocations.fetchingMap,
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

  handleSelect(prev, index, word, isEnglishWord) {
    this.props.switchTab(index, word, this.props.mapTabIndex);
    this.setState( { tabIndex: index } );

    const tabWordMap = {
                        'english': { 1: 'TRANSLATIONS' },
                        'non-english': { 1: 'COLLOCATIONS' },
                       }
    let tabMap = {}
    if (isEnglishWord) {
      tabMap = tabWordMap['english']
    }
    else {
      tabMap = tabWordMap['non-english']
    }
    console.log(tabMap)
    console.log(tabMap[index])

    switch (tabMap[index]) {
      case 'TRANSLATIONS':
        if (!this.props.allTranslations[word]) {
          console.log('looking up translations'); 
          this.props.requestTranslations(word, this.props.transFetchingMap)
          this.props.lookUpTranslations(word, this.props.allTranslations, this.props.transFetchingMap)
          break
        }
      case 'COLLOCATIONS':
        if (!this.props.allCollocations[word]) {
          console.log('looking up collocations'); 
          this.props.requestCollocations(word, this.props.collocsFetchingMap)
          this.props.lookUpCollocations(word, this.props.allCollocations, this.props.collocsFetchingMap)
          break
        }
      default:
        Function.prototype()
    }
  }

  render() {
    const { word, element, fn } = this.props;
    const isEnglishWord = element.reduce((englishFlag, e) => 
      {return e['language'] === 'english' ?  ++englishFlag : englishFlag}, 0)
    return ( 
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, word, isEnglishWord)}>
        <TabList>
          <Tab>Original Word</Tab>
          { isEnglishWord ? <Tab>Translations</Tab> : <Tab>Collocations</Tab> }
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
          { isEnglishWord ? <Translations word={word} fn={fn[0]}/> : ''}
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

export default connect(mapStateToProps, { switchTab, lookUpTranslations, requestTranslations, lookUpCollocations, requestCollocations })(WordTabs);
