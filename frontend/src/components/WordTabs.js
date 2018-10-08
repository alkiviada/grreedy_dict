import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import DecorateWithLinks from "./DecorateWithLinks";
import Translations from "./Translations";
import Collocations from "./Collocations";
import Synonyms from "./Synonyms";
import key from "weak-key";
import { connect } from 'react-redux';
import { switchTab } from '../actions/tabActions';
import { lookUpTranslations, requestTranslations, } from '../actions/transActions';
import { lookUpCollocations, requestCollocations, } from '../actions/collocationsActions';
import { lookUpSynonyms, requestSynonyms, } from '../actions/synonymsActions';
import { renderList, listStyles } from './helpers';

const mapStateToProps = state => ({
  mapTabIndex: state.tabs.mapTabIndex,
  allTranslations: state.translations.allTranslations,
  allSynonyms: state.synonyms.allSynonyms,
  allCollocations: state.collocations.allCollocations,
  transFetchingMap: state.translations.fetchingMap,
  collocsFetchingMap: state.collocations.fetchingMap,
  synonymssFetchingMap: state.synonyms.fetchingMap,
});


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
                        'english': { 1: 'TRANSLATIONS', 2: 'COLLOCATIONS', 3: 'SYNONYMS' },
                        'non-english': { 1: 'COLLOCATIONS', 2: 'SYNONYMS' },
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
        }
        break
      case 'COLLOCATIONS':
        if (!this.props.allCollocations[word]) {
          console.log('looking up collocations'); 
          this.props.requestCollocations(word, this.props.collocsFetchingMap)
          this.props.lookUpCollocations(word, this.props.allCollocations, this.props.collocsFetchingMap)
        }
        break
      case 'SYNONYMS':
        console.log(this.props.allSynonyms)
        if (!this.props.allSynonyms[word]) {
          console.log('looking up synonyms'); 
          this.props.requestSynonyms(word, this.props.synonymsFetchingMap)
          console.log('after request up synonyms'); 
          this.props.lookUpSynonyms(word, this.props.allSynonyms, this.props.synonymsFetchingMap)
        }
        break
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
          { isEnglishWord ? <Tab>Collocations</Tab> : <Tab>Synonyms</Tab> }
          { isEnglishWord ? <Tab>Synonyms</Tab> : '' }
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
          { isEnglishWord ? <Translations word={word} fn={fn[0]}/> : <Collocations word={word} fn={fn[0]} />}
        </TabPanel>
        <TabPanel>
          { isEnglishWord ? <Collocations word={word} fn={fn[0]}/> : <Synonyms word={word} fn={fn[0]} />}
        </TabPanel>
        { isEnglishWord ? <TabPanel><Synonyms word={word} fn={fn[0]} /></TabPanel> : '' }
     </Tabs>
    );
  }
}

const mapDispatchToProps = {
   
          switchTab, 
          lookUpTranslations, 
          requestTranslations, 
          lookUpCollocations, 
          requestCollocations,
          lookUpSynonyms, 
          requestSynonyms,
}

export default connect(mapStateToProps, mapDispatchToProps)(WordTabs);
