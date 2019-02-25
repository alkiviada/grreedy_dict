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

const carouselItems = 4;
const tabs = { 1: 'Original Word', 2: 'COLLOCATIONS', 3: 'SYNONYMS', 4: 'PRONUNCIATION', 5: 'ADD NOTE' }

class WordTabs extends Component {
  constructor(props) { 
    super(props)
    this.handleSelect = this.handleSelect.bind(this) 
    let i = 1;
    this.state = { tabIndex: i ? i : 1,
                   carouselIdx: 0,
    };
  }


  static propTypes = {
  };

  handleSelect(prev, index, word) {
    if (index) { 
// this is a legit tab - let's switch to it
      console.log(index)
      console.log('index')
      const myItemsCount = Object.keys(tabs).length;

// if this is the end of my tab's list
// which means this is a fake 'tab'
// that is: an arrow to move tabs to the right is being clicked

      if (index == myItemsCount) {
        let c = this.state.carouselIdx 
        console.log(c)
        console.log(myItemsCount)
        c = myItemsCount - c - 1 > carouselItems ? c + 1 : c
        this.setState( { carouselIdx: c } );
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
      let c = this.state.carouselIdx 
      c = c - 1
      this.setState( { carouselIdx: c } );
    }
  }

  render() {
    const { word, addWord } = this.props;
    console.log(word)

    const iAmHidden = this.state.carouselIdx
    console.log('i am hidden')
    console.log(iAmHidden)
    let i = 1;

    const myItemsCount = Object.keys(tabs).length

    let canMoveRight = myItemsCount - iAmHidden - 1 > carouselItems ? 1 : 0 

    console.log(canMoveRight)

    let canMoveLeft = iAmHidden > 0 ? 1 : 0 

    return ( 
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, word)}>
        <TabList>
          { canMoveLeft ? 
          <Tab className="tab-carousel-arrow-tab react-tabs__tab"><a className="tab-carousel-right fas fa-chevron-left"></a></Tab> :
          <Tab className="tab-carousel-arrow-tab hide-tab-item"><a className="tab-carousel-right fas fa-chevron-left"></a></Tab>
         }
{         
          Object.keys(tabs).map((t, i) =>  {
               const visibilityClassName = (i >= iAmHidden) && (i <= carouselItems + iAmHidden) ? 'react-tabs__tab show-tab-item' : 'react-tabs__tab hide-tab-item'
               return (
              t == myItemsCount ? '' : <Tab className={visibilityClassName}>{ makeTabLabel(tabs[t]) }</Tab> 
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
