import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import DecorateWithLinks from "./DecorateWithLinks";
import Translations from "./Translations";
import Collocations from "./Collocations";
import Conjugate from "./Conjugate";
import Corpora from "./Corpora";
import Synonyms from "./Synonyms";
import WordNote from "./WordNote";
import Pronunciation from "./Pronunciation";
import key from "weak-key";
import { connect } from 'react-redux';
import { switchTab } from '../actions/tabActions';
import { lookUpTranslations, requestTranslations, } from '../actions/transActions';
import { fetchCorpora, requestCorpora, } from '../actions/corporaActions';
import { fetchPronunciation, requestPronunciation, } from '../actions/pronounceActions';
import { fetchConjugations, requestConjugations, } from '../actions/conjugateActions';
import { lookUpCollocations, requestCollocations, } from '../actions/collocationsActions';
import { lookUpSynonyms, requestSynonyms, } from '../actions/synonymsActions';
import { fetchNote, requestNote } from '../actions/notesActions';
import { renderList, listStyles, makeTabLabel, tabs } from './helpers';
import { logWordDivOffset } from '../actions/refActions';

const mapStateToProps = state => ({
  mapTabIndex: state.tabs.mapTabIndex,
  allTranslations: state.translations.allTranslations,
  allSynonyms: state.synonyms.allSynonyms,
  allPronunciations: state.pronounce.allPronunciations,
  allConjugations: state.conjugate.allConjugations,
  allCorpora: state.corpora.allCorpora,
  allCollocations: state.collocations.allCollocations,
  allNotes: state.notes.allNotes,
  transFetchingMap: state.translations.fetchingMap,
  notesFetchingMap: state.notes.fetchingMap,
  collocsFetchingMap: state.collocations.fetchingMap,
  synonymsFetchingMap: state.synonyms.fetchingMap,
});

const carouselItems5 = 5;
const carouselItems4 = 4;
const carouselItems3 = 3;
const carouselItems2 = 2;

const tabPanels = [
  'Translations', 'Collocations', 'Synonyms', 'Pronounciation', 'Add Note', 'Conjugate', 'Corpora'
]

class WordTabs extends Component {
  constructor(props) { 
    super(props)
    this.handleSelect = this.handleSelect.bind(this) 
    let i = this.props.mapTabIndex[this.props.word];
    this.state = { tabIndex: i ? i : 1,
                   carouselIdx5: 0,
                   carouselIdx4: 0,
                   carouselIdx3: 0,
                   carouselIdx2: 0,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { word } = nextProps
    const { carouselIdx5, carouselIdx4, carouselIdx3, carouselIdx2 } = nextState
    if (nextProps.mapTabIndex[word] == this.props.mapTabIndex[word] && 
        (carouselIdx5 == this.state.carouselIdx5) && 
        (carouselIdx4 == this.state.carouselIdx4) &&
        (carouselIdx2 == this.state.carouselIdx2) &&
        (carouselIdx3 == this.state.carouselIdx3) 
    ) {
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

  handleSelect(prev, index, word, myTabs, parentRef) {
    const parentOffset = parentRef.current.scrollTop
    
    if (parentOffset && [1, 2, 3].filter(i => i == prev).length) {
      console.log(parentOffset)
      console.log('i am logging')
      this.props.logWordDivOffset(word, parentOffset);
    }

    const myItemsCount = myTabs.length + 1

    let c5 = this.state.carouselIdx5 
    let c4 = this.state.carouselIdx4
    let c3 = this.state.carouselIdx3
    let c2 = this.state.carouselIdx2
    
    if (index) { 
// this is a legit tab - let's switch to it
      if (index == myItemsCount) {
        c5 = myItemsCount - c5 - 1 > carouselItems5 ? c5 + 1 : c5
        c4 = myItemsCount - c4 - 1 > carouselItems4 ? c4 + 1 : c4
        c3 = myItemsCount - c3 - 1 > carouselItems3 ? c3 + 1 : c3
        c2 = myItemsCount - c2 - 1 > carouselItems2 ? c2 + 1 : c2
        this.setState({ carouselIdx5: c5, 
                        carouselIdx4: c4, 
                        carouselIdx2: c2,
                        carouselIdx3: c3 });
      }
      else {
      this.props.switchTab(index, word, this.props.mapTabIndex);
      this.setState( { tabIndex: index } );
    switch (myTabs[index-1]) {
      case 'WordNote':
        if (!this.props.allNotes[word]) {
          console.log('looking up notes'); 
          this.props.requestNote(word)
          this.props.fetchNote(word)
        }
        break
      case 'Translations':
        if (!this.props.allTranslations[word]) {
          this.props.requestTranslations(word, this.props.transFetchingMap)
          this.props.lookUpTranslations(word, this.props.allTranslations, this.props.transFetchingMap)
        }
        break
      case 'Collocations':
        if (!this.props.allCollocations[word]) {
          console.log('looking up collocations'); 
          this.props.requestCollocations(word, this.props.collocsFetchingMap)
          this.props.lookUpCollocations(word, this.props.allCollocations, this.props.collocsFetchingMap)
        }
        break
      case 'Synonyms':
        if (!this.props.allSynonyms[word]) {
          console.log('looking up synonyms'); 
          this.props.requestSynonyms(word, this.props.synonymsFetchingMap)
          console.log('after request up synonyms'); 
          this.props.lookUpSynonyms(word, this.props.allSynonyms, this.props.synonymsFetchingMap)
        }
        break
      case 'Pronunciation':
        if (!this.props.allPronunciations[word]) {
          console.log('looking up pronuciation'); 
          this.props.requestPronunciation(word)
          console.log('after request up pronunciation'); 
          this.props.fetchPronunciation(word)
        }
        break
      case 'Conjugate':
        console.log(9999999999)
        if (!this.props.allConjugations[word]) {
          console.log('looking up conjugations'); 
          this.props.requestConjugations(word)
          console.log('after request up conjugations'); 
          this.props.fetchConjugations(word)
        }
        break
      case 'Corpora':
        console.log('boom')
        if (!this.props.allCorpora[word]) {
          console.log('looking up corpora'); 
          this.props.requestCorpora(word)
          console.log('after request up corpora'); 
          this.props.fetchCorpora(word)
        }
        break
      default:
        Function.prototype()
    }
    }
    }
    else {
// this is a left-moving carousel tab - let's deal with it:
// log the carousel count (so the items can be moved accordingly) and NOT switch to it
      c5 = c5 ? c5 - 1 : c5
      c4 = c4 ? c4 - 1 : c4
      c3 = c3 ? c3 - 1 : c3
      c2 = c2 ? c2 - 1 : c2
      this.setState({ carouselIdx5: c5, 
                      carouselIdx4: c4, 
                      carouselIdx2: c2, 
                      carouselIdx3: c3 });
    }
  }

  render() {
    const { word, element, addRow, parentRef } = this.props;

    const isEnglishWord = element.reduce((englishFlag, e) => 
      {return e['language'] === 'english' ?  ++englishFlag : englishFlag}, 0)

    const isNotOnlyEnglishWord = element.reduce((onlyEnglishFlag, e) => 
      {return e['language'] != 'english' ?  ++onlyEnglishFlag : onlyEnglishFlag}, 0)

    const isNotOnlySwedishWord = element.reduce((notOnlySwedishFlag, e) => 
      {return e['language'] != 'swedish' ?  ++notOnlySwedishFlag : notOnlySwedishFlag}, 0)



    const isNonPronWord = element.reduce((nonPronFlag, e) => 
      {return e['language'].match('swedish|russian|ukrainian') ?  ++nonPronFlag : nonPronFlag}, 0)

    const isVerb = element.reduce((isVerbFlag, e) => 
      {return e['is_verb'] ? ++isVerbFlag : isVerbFlag}, 0)

    const hasCorp = element.reduce((hasCorpFlag, e) => 
      {return e['has_corpora'] ? ++hasCorpFlag: hasCorpFlag}, 0)
    console.log(hasCorp)
    
    const myTabs = tabs.filter(t => (!isEnglishWord && t == 'Translations' ? 0 : 1) && 
      (isNonPronWord && t == 'Pronounciation' ? 0 : 1) && 
      (!isVerb && t == 'Conjugate' ? 0 : 1) && 
      (!hasCorp && t == 'Corpora' ? 0 : 1) && 
      (!isNotOnlyEnglishWord && (t == 'Synonyms' || t == 'Collocations') ? 0 : 1) && 
      (!isNotOnlySwedishWord && t == 'Synonyms' ? 0 : 1))
     

    const iAmHidden5 = this.state.carouselIdx5
    const iAmHidden4 = this.state.carouselIdx4
    const iAmHidden3 = this.state.carouselIdx3
    const iAmHidden2 = this.state.carouselIdx2

    const canMoveLeftClass = iAmHidden5 ? "tab-carousel arrow-tab5 react-tabs__tab" : 
      iAmHidden4 ? "tab-carousel arrow-tab4 react-tabs__tab" : 
      iAmHidden3 ? "tab-carousel arrow-tab3 react-tabs__tab" : 
      iAmHidden2 ? "tab-carousel arrow-tab2 react-tabs__tab" : ''

    const myItemsCount = myTabs.length + 1

    let canMoveRight5 = myItemsCount - iAmHidden5 - 1 > carouselItems5 ? 1 : 0 
    let canMoveRight4 = myItemsCount - iAmHidden4 - 1 > carouselItems4 ? 1 : 0 
    let canMoveRight3 = myItemsCount - iAmHidden3 - 1 > carouselItems3 ? 1 : 0 
    let canMoveRight2 = myItemsCount - iAmHidden2 - 1 > carouselItems2 ? 1 : 0 

    return ( 
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, word, myTabs, parentRef)}>
        <TabList>
          { iAmHidden5 + iAmHidden4 + iAmHidden3 + iAmHidden2 > 0 ? 
              <Tab className={canMoveLeftClass}>&#9664;</Tab> :
              <Tab className="tab-carousel arrow-tab hide-tab-item">
              &#9664;
              </Tab>
          }
          {         
            myTabs.map((t, i) =>  {
              const visibilityClassName = 
                (i >= iAmHidden2) && (i < carouselItems2 + iAmHidden2) ? 
                  'react-tabs__tab show-tab-item2' : 
                (i >= iAmHidden3) && (i < carouselItems3 + iAmHidden3) ? 
                  'react-tabs__tab show-tab-item3' : 
                  (i >= iAmHidden4) && (i < carouselItems4 + iAmHidden4) ? 
                  'react-tabs__tab show-tab-item4' : 
                  (i >= iAmHidden5) && (i < carouselItems5 + iAmHidden5) ? 
                  'react-tabs__tab show-tab-item5' : 
                  'react-tabs__tab hide-tab-item5'
               return <Tab className={visibilityClassName}>{ makeTabLabel(t) }</Tab> 
            })
          }
          { canMoveRight5 ? 
              <Tab className="tab-carousel arrow-tab5 react-tabs__tab">
              &#9654;
              </Tab> :
           canMoveRight4 ? 
              <Tab className="tab-carousel arrow-tab4 react-tabs__tab">
               &#9654;
              </Tab> :
           canMoveRight3 ? 
              <Tab className="tab-carousel arrow-tab3 react-tabs__tab">
              &#9654;
              </Tab> :
           canMoveRight2 ? 
              <Tab className="tab-carousel arrow-tab2 react-tabs__tab">
              &#9654;
              </Tab> :
              <Tab className="tab-carousel arrow-tab hide-tab-item">
               &#9654;
              </Tab>
          }
          </TabList>
          <TabPanel className="carousel-dummy-tab" />
          <TabPanel>
          { element.map(e => 
                <div>
                <p className={`heading lang-head lang-${e['language']}`}>{e['language']}</p>
                { renderList(e['etymology'], addRow, parentRef, word, listStyles, 0) }
                </div>
               )
          }
        </TabPanel>
        {  myTabs.slice(1).map(t => {
    switch (t) {
      case 'WordNote':
             return <TabPanel><WordNote word={word} /></TabPanel>
        break
      case 'Translations':
             return <TabPanel><Translations word={word} addRow={addRow} parentRef={parentRef} /></TabPanel>
        break
      case 'Collocations':
             return <TabPanel><Collocations word={word} addRow={addRow} parentRef={parentRef} /></TabPanel>
        break
      case 'Synonyms':
             return <TabPanel><Synonyms word={word} addRow={addRow} parentRef={parentRef} /></TabPanel>
        break
      case 'Pronunciation':
             return <TabPanel><Pronunciation word={word} /></TabPanel>
        break
      case 'Conjugate':
             return <TabPanel><Conjugate word={word} /></TabPanel>
      case 'Corpora':
             return <TabPanel><Corpora word={word} addRow={addRow} parentRef={parentRef} /></TabPanel>
        break
      default:
        Function.prototype()
           }}) 
        }
        <TabPanel className="carousel-dummy-tab" />
     </Tabs>
    );
  }
}

const mapDispatchToProps = {
          switchTab, 
          lookUpTranslations, 
          requestTranslations, 
          requestCorpora, 
          lookUpCollocations, 
          requestCollocations,
          lookUpSynonyms, 
          requestSynonyms,
          requestCorpora,
          fetchCorpora,
          fetchPronunciation, 
          requestPronunciation,
          fetchConjugations, 
          requestConjugations,
          fetchNote, 
          requestNote,
          logWordDivOffset
}

export default connect(mapStateToProps, mapDispatchToProps)(WordTabs);
