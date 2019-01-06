import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import DecorateWithLinks from "./DecorateWithLinks";
import Translations from "./Translations";
import Collocations from "./Collocations";
import Conjugate from "./Conjugate";
import Synonyms from "./Synonyms";
import WordNote from "./WordNote";
import Pronunciation from "./Pronunciation";
import key from "weak-key";
import { connect } from 'react-redux';
import { switchTab } from '../actions/tabActions';
import { lookUpTranslations, requestTranslations, } from '../actions/transActions';
import { fetchPronunciation, requestPronunciation, } from '../actions/pronounceActions';
import { fetchConjugations, requestConjugations, } from '../actions/conjugateActions';
import { lookUpCollocations, requestCollocations, } from '../actions/collocationsActions';
import { lookUpSynonyms, requestSynonyms, } from '../actions/synonymsActions';
import { fetchNote, requestNote } from '../actions/notesActions';
import { renderList, listStyles } from './helpers';
import { logWordDivOffset } from '../actions/refActions';

const mapStateToProps = state => ({
  mapTabIndex: state.tabs.mapTabIndex,
  allTranslations: state.translations.allTranslations,
  allSynonyms: state.synonyms.allSynonyms,
  allPronunciations: state.pronounce.allPronunciations,
  allConjugations: state.conjugate.allConjugations,
  allCollocations: state.collocations.allCollocations,
  allNotes: state.notes.allNotes,
  transFetchingMap: state.translations.fetchingMap,
  notesFetchingMap: state.notes.fetchingMap,
  collocsFetchingMap: state.collocations.fetchingMap,
  synonymsFetchingMap: state.synonyms.fetchingMap,
});


class WordTabs extends Component {
  constructor(props) { 
    super(props)
    this.handleSelect = this.handleSelect.bind(this) 
    let i = this.props.mapTabIndex[this.props.word];
    this.state = { tabIndex: i ? i : 0 };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { word } = nextProps
    if (nextProps.mapTabIndex[word] == this.props.mapTabIndex[word]) {
      return 0
    }
    else {
      return 1
    }
  }

  static propTypes = {
    switchTab: PropTypes.func.isRequired,
    lookUpTranslations: PropTypes.func.isRequired,
    word: PropTypes.string.isRequired,
    element: PropTypes.array.isRequired,
  };

  handleSelect(prev, index, word, isEnglishWord, parentRef) {
    const parentOffset = parentRef.current.scrollTop
    if (parentOffset && [0,1,2].filter(i => i == prev)) {
      this.props.logWordDivOffset(word, parentOffset);
    }
     
    this.props.switchTab(index, word, this.props.mapTabIndex);
    this.setState( { tabIndex: index } );

    const tabWordMap = {
                        'english': { 1: 'TRANSLATIONS', 2: 'COLLOCATIONS', 3: 'SYNONYMS', 4: 'PRONUNCIATION', 5: 'ADD_NOTE', 6: 'CONJUGATE' },
                        'non-english': { 1: 'COLLOCATIONS', 2: 'SYNONYMS', 3: 'PRONUNCIATION', 4: 'ADD_NOTE', 5: 'CONJUGATE' },
                       }
    let tabMap = {}
    if (isEnglishWord) {
      tabMap = tabWordMap['english']
    }
    else {
      tabMap = tabWordMap['non-english']
    }

    switch (tabMap[index]) {
      case 'ADD_NOTE':
        if (!this.props.allNotes[word]) {
          console.log('looking up notes'); 
          this.props.requestNote(word)
          this.props.fetchNote(word)
        }
        break
      case 'TRANSLATIONS':
        if (!this.props.allTranslations[word]) {
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
        if (!this.props.allSynonyms[word]) {
          console.log('looking up synonyms'); 
          this.props.requestSynonyms(word, this.props.synonymsFetchingMap)
          console.log('after request up synonyms'); 
          this.props.lookUpSynonyms(word, this.props.allSynonyms, this.props.synonymsFetchingMap)
        }
        break
      case 'PRONUNCIATION':
        if (!this.props.allPronunciations[word]) {
          console.log('looking up pronuciation'); 
          this.props.requestPronunciation(word)
          console.log('after request up pronunciation'); 
          this.props.fetchPronunciation(word)
        }
        break
      case 'CONJUGATE':
        console.log(9999999999)
        if (!this.props.allConjugations[word]) {
          console.log('looking up conjugations'); 
          this.props.requestConjugations(word)
          console.log('after request up conjugations'); 
          this.props.fetchConjugations(word)
        }
        break
      default:
        Function.prototype()
    }
  }

  render() {
    const { word, element, addRow, parentRef } = this.props;

    const isEnglishWord = element.reduce((englishFlag, e) => 
      {return e['language'] === 'english' ?  ++englishFlag : englishFlag}, 0)

    const isVerb = element.reduce((isVerb, e) => 
      {return e['is_verb'] ?  ++isVerb : isVerb}, 0)

    return ( 
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, word, isEnglishWord, parentRef)}>
        <TabList>
          <Tab>Original Word</Tab>
          { isEnglishWord ? <Tab>Translations</Tab> : <Tab>Collocations</Tab> }
          { isEnglishWord ? <Tab>Collocations</Tab> : <Tab>Synonyms</Tab> }
          { isEnglishWord ? <Tab>Synonyms</Tab> : <Tab>Pronunciation</Tab> }
          { isEnglishWord ? <Tab>Pronunciation</Tab> : <Tab>Add Note</Tab> }
          { isEnglishWord ? <Tab>Add Note</Tab> : isVerb ? <Tab>Conjugate</Tab> : '' }
          { isVerb && isEnglishWord ? <Tab>Conjugate</Tab> : '' }
        </TabList>
        <TabPanel>
          { element.map(e => 
                <div>
                <p className={`heading lang-head lang-${e['language']}`}>{e['language']}</p>
                { renderList(e['etymology'], addRow, parentRef, word, listStyles, 0) }
                </div>
               )
          }
        </TabPanel>
        <TabPanel>
          { isEnglishWord ? <Translations word={word} addRow={addRow} parentRef={parentRef} /> : <Collocations word={word} addRow={addRow} parentRef={parentRef} />}
        </TabPanel>
        <TabPanel>
          { isEnglishWord ? <Collocations word={word} addRow={addRow} parentRef={parentRef} /> : <Synonyms word={word} addRow={addRow} parentRef={parentRef} />}
        </TabPanel>
        { isEnglishWord ? <TabPanel><Synonyms word={word} addRow={addRow} parentRef={parentRef} /></TabPanel> : <TabPanel><Pronunciation word={word} /></TabPanel>}
        { isEnglishWord ? <TabPanel><Pronunciation word={word} /></TabPanel> : <TabPanel><WordNote word={word} /></TabPanel>}
        { isEnglishWord ? <TabPanel><WordNote word={word} /></TabPanel> : isVerb ? <TabPanel><Conjugate word={word} /></TabPanel> : '' }
        { isVerb ? <TabPanel><Conjugate word={word} /></TabPanel> : '' }
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
          fetchPronunciation, 
          requestPronunciation,
          fetchConjugations, 
          requestConjugations,
          fetchNote, 
          requestNote,
          logWordDivOffset
}

export default connect(mapStateToProps, mapDispatchToProps)(WordTabs);
