import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import DecorateWithLinks from "./DecorateWithLinks";
import Synonyms from "./Synonyms";
import Collocations from "./Collocations";
import Pronunciation from "./Pronunciation";
import WordNote from "./WordNote";
import key from "weak-key";
import { connect } from 'react-redux';
import { lookUpSynonyms, requestSynonyms, } from '../actions/synonymsActions';
import { renderList, listStyles, makeTabLabel } from './helpers';

const mapStateToProps = state => ({
  allSynonyms: state.synonyms.allSynonyms,
  synonymsFetchingMap: state.synonyms.fetchingMap,
});

const carouselItems2 = 2;
const carouselItems3 = 3;
const carouselItems4 = 4;
const tabs = { 1: 'Original Word', 2: 'COLLOCATIONS', 3: 'SYNONYMS', 4: 'PRONUNCIATION', 5: 'ADD NOTE' }
const myItemsCount = Object.keys(tabs).length + 1

class WordTabs extends Component {
  constructor(props) { 
    super(props)
    this.handleSelect = this.handleSelect.bind(this) 
    let i = 1;
    this.state = { tabIndex: i ? i : 1,
                   carouselIdx2: 0,
                   carouselIdx3: 0,
                   carouselIdx4: 0,
    };
  }


  static propTypes = {
  };

  handleSelect(prev, index, word) {
    let c2 = this.state.carouselIdx2
    let c3 = this.state.carouselIdx3
    let c4 = this.state.carouselIdx4
    if (index) { 
// this is a legit tab - let's switch to it
      console.log(index)
      console.log('index')

// if this is the end of my tab's list
// which means this is a fake 'tab'
// that is: an arrow to move tabs to the right is being clicked

      if (index == myItemsCount) {
        console.log(c2)
        console.log(c3)
        console.log(c4)
        console.log(myItemsCount)
        c2 = myItemsCount - c2 - 1 > carouselItems2 ? c2 + 1 : c2
        c3 = myItemsCount - c3 - 1 > carouselItems3 ? c3 + 1 : c3
        c4 = myItemsCount - c4 - 1 > carouselItems4 ? c4 + 1 : c4
        this.setState( { carouselIdx3: c3, carouselIdx4: c4, carouselIdx2: c2 } );
      }
      else {
      this.setState( { tabIndex: index } );
    switch (tabs[index]) {
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
      default:
        Function.prototype()
    }
    }
    }
    else {
// this is a legit tab - let's switch to it
      c2 = c2 - 1
      c3 = c3 ? c3 - 1 : c3
      c4 = c4 ? c4 - 1 : c4
      this.setState( { carouselIdx3: c3, carouselIdx4: c4, carouselIdx2: c2 } );
    }
  }

  render() {
    const { word, addWord } = this.props;

    const iAmHidden2 = this.state.carouselIdx2
    const iAmHidden3 = this.state.carouselIdx3
    const iAmHidden4 = this.state.carouselIdx4
    const canMoveLeftClass = iAmHidden4 ? "tab-carousel-arrow-tab4 react-tabs__tab" :
      iAmHidden3 ? "tab-carousel-arrow-tab3 react-tabs__tab" : 
      iAmHidden2 ? "tab-carousel-arrow-tab2 react-tabs__tab" : ''

    console.log('i am hidden')
    console.log(iAmHidden2)
    console.log(iAmHidden3)
    console.log(iAmHidden4)

    console.log(myItemsCount)

    let canMoveRight2 = myItemsCount - iAmHidden2 - 1 > carouselItems2 ? 1 : 0 
    let canMoveRight3 = myItemsCount - iAmHidden3 - 1 > carouselItems3 ? 1 : 0 
    let canMoveRight4 = myItemsCount - iAmHidden4 - 1 > carouselItems4 ? 1 : 0 

    console.log(canMoveRight2)
    console.log(canMoveRight3)
    console.log(canMoveRight4)

    return ( 
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, word)}>
        <TabList>
          { iAmHidden3 + iAmHidden4 + iAmHidden2 > 0 ? 
              <Tab className={canMoveLeftClass}>
                <a className="tab-carousel-right fas fa-chevron-left"></a>
              </Tab> :
              <Tab className="tab-carousel-arrow-tab hide-tab-item">
                <a className="tab-carousel-right fas fa-chevron-left"></a>
              </Tab>
          }
          {         
            Object.keys(tabs).map((t, i) =>  {
              const visibilityClassName = 
                (t > iAmHidden2) && (t <= carouselItems2 + iAmHidden2) ? 
                'react-tabs__tab show-tab-item' : 
                (t > iAmHidden3) && (t <= carouselItems3 + iAmHidden3) ? 
                'react-tabs__tab show-tab-item3' : 
                (t > iAmHidden4) && (t <= carouselItems4 + iAmHidden4) ? 
                'react-tabs__tab show-tab-item4' :
                'react-tabs__tab hide-tab-item4'
              return <Tab className={visibilityClassName}>{ makeTabLabel(tabs[t]) }</Tab> 
            })
          }
          { canMoveRight4 ? 
              <Tab className="tab-carousel-arrow-tab4 react-tabs__tab">
                <a className="tab-carousel-right fas fa-chevron-right"></a>
              </Tab> :
           canMoveRight3 ? 
              <Tab className="tab-carousel-arrow-tab3 react-tabs__tab">
                <a className="tab-carousel-right fas fa-chevron-right"></a>
              </Tab> :
           canMoveRight2 ? 
              <Tab className="tab-carousel-arrow-tab2 react-tabs__tab">
                <a className="tab-carousel-right fas fa-chevron-right"></a>
              </Tab> :
              <Tab className="tab-carousel-arrow-tab hide-tab-item">
                <a className="tab-carousel-right fas fa-chevron-right"></a>
              </Tab>
         }
        </TabList>
        <TabPanel className="carousel-dummy-tab" />
        <TabPanel>
          { word.description.map(e => 
                <div>
                <p className={`heading lang-head lang-${e['language']}`}>{e['language']}</p>
                { renderList(e['etymology'], addWord, listStyles, 0) }
                </div>
               )
          }
        </TabPanel>
        <TabPanel>
          <Collocations word={word} addWord={addWord} /> 
        </TabPanel>
        <TabPanel>
          <Synonyms word={word.word} addWord={addWord} />
        </TabPanel>
        <TabPanel><Pronunciation word={word} /></TabPanel>
        <TabPanel><WordNote word={word} /></TabPanel>
        <TabPanel className="carousel-dummy-tab" />
     </Tabs>
    );
  }
}

const mapDispatchToProps = {
          lookUpSynonyms, 
          requestSynonyms,
}

export default connect(mapStateToProps, mapDispatchToProps)(WordTabs);
