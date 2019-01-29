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
import { renderList, listStyles, makeTabLabel } from './helpers';
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

const carouselItems = 4;
    const tabWordMap = {
                        'english': { 1: 'Original word', 2: 'TRANSLATIONS', 3: 'COLLOCATIONS', 4: 'SYNONYMS', 5: 'PRONUNCIATION', 6: 'ADD NOTE', 7: 'CONJUGATE' },
                        'non-english': { 1: 'Original Word', 2: 'COLLOCATIONS', 3: 'SYNONYMS', 4: 'PRONUNCIATION', 5: 'ADD NOTE', 6: 'CONJUGATE' },
                       }

class WordTabs extends Component {
  constructor(props) { 
    super(props)
    this.handleSelect = this.handleSelect.bind(this) 
    let i = this.props.mapTabIndex[this.props.word];
    this.state = { tabIndex: i ? i : 1,
                   carouselIdx: 0,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { word } = nextProps
    const { carouselIdx } = nextState
    console.log(carouselIdx)
    console.log(this.state.carouselIdx)
    if (nextProps.mapTabIndex[word] == this.props.mapTabIndex[word] && (carouselIdx == this.state.carouselIdx)) {
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

  handleSelect(prev, index, word, isEnglishWord, isVerb, parentRef) {
    const parentOffset = parentRef.current.scrollTop
    if (parentOffset && [1, 2, 3].filter(i => i == prev)) {
      this.props.logWordDivOffset(word, parentOffset);
    }
    let tabMap = {}
    if (isEnglishWord) {
      tabMap = tabWordMap['english']
    }
    else {
      tabMap = tabWordMap['non-english']
    }

    if (index) { 
// this is a legit tab - let's switch to it
      if ((isVerb && ((isEnglishWord && index == 8) || index == 7)) || ((isEnglishWord && index == 7) || (!isEnglishWord && index == 6)) {
      let c = this.state.carouselIdx 
      const myItems = isEnglishWord ? 6 + isVerb : 5 + isVerb;
      console.log(c)
      console.log(myItems)
      c = myItems - c - 1 > carouselItems ? c + 1 : c
      this.setState( { carouselIdx: c } );
      }
      else {
      this.props.switchTab(index, word, this.props.mapTabIndex);
      this.setState( { tabIndex: index } );
    switch (tabMap[index]) {
      case 'ADD NOTE':
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
    }
    else {
// this is a legit tab - let's switch to it
      let c = this.state.carouselIdx 
      c = c - 1
      this.setState( { carouselIdx: c } );
    }
  }

  render() {
    const { word, element, addRow, parentRef } = this.props;

    const isEnglishWord = element.reduce((englishFlag, e) => 
      {return e['language'] === 'english' ?  ++englishFlag : englishFlag}, 0)

    const isVerb = element.reduce((isVerb, e) => 
      {return e['is_verb'] ?  ++isVerb : isVerb}, 0)
    const iAmHidden = this.state.carouselIdx
    console.log('i am hidden')
    console.log(iAmHidden)
    let i = 1;
    let tabMap = isEnglishWord ? tabWordMap['english'] : tabWordMap['non-english']
    const myItems = isEnglishWord ? 6 + isVerb : 5 + isVerb;
    let canMoveRight = myItems - iAmHidden - 1 > carouselItems ? 1 : 0 
    console.log(myItems)
    let canMoveLeft = iAmHidden > 0 ? 1 : 0 

    return ( 
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, word, isEnglishWord, isVerb, parentRef)}>
        <TabList>
          { canMoveLeft ? 
          <Tab className="tab-carousel-arrow-tab react-tabs__tab"><a className="tab-carousel-right fas fa-chevron-left"></a></Tab> :
          <Tab className="tab-carousel-arrow-tab hide-tab-item"><a className="tab-carousel-right fas fa-chevron-left"></a></Tab>
         }
{         
          Object.keys(tabMap).map((t, i) =>  {
               const visibilityClassName = (i >= iAmHidden) && (i <= carouselItems + iAmHidden) ? 'react-tabs__tab show-tab-item' : 'react-tabs__tab hide-tab-item'
               return (
              ((!isEnglishWord && t == 6) || t == 7) && ! isVerb ? '' : 
              isEnglishWord ? <Tab className={visibilityClassName}>{ makeTabLabel(tabWordMap['english'][t]) }</Tab> : 
                              <Tab className={visibilityClassName}>{ makeTabLabel(tabWordMap['non-english'][t]) }</Tab>
             )
})
}
          { canMoveRight ? 
          <Tab className="tab-carousel-arrow-tab react-tabs__tab"><a className="tab-carousel-right fas fa-chevron-right"></a></Tab> :
          <Tab className="tab-carousel-arrow-tab hide-tab-item"><a className="tab-carousel-right fas fa-chevron-right"></a></Tab>
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
        <TabPanel className="carousel-dummy-tab" />
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
