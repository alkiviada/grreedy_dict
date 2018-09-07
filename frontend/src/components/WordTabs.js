import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import DecorateWithLinks from "./DecorateWithLinks";
import Translations from "./Translations";
import key from "weak-key";
import { connect } from 'react-redux';
import { lookUpTranslations, switchTab } from '../actions/wordsActions';

const fontStylesForLang =  {
 'french': {'fontFamily': 'Parisienne', 'color': '#c18eda'},
 'italian': {'fontFamily': 'Italiana', 'color': '#2e8286'},
 'english': {'fontFamily': 'IM Fell English SC', 'color': '#6c8dbc'},
}

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
                <p style={fontStylesForLang[e['language']]} className="heading lang-head">{e['language']}</p>
                { renderList(e['etymology'], fn[0], listStyles, 0) }
                </div>
               )
          }
        </TabPanel>
        <TabPanel>
          { is_english_word ? <Translations word={word} fn={fn[0]}/> <Collocations word={word} fn={fn[1]} >}
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

export default connect(mapStateToProps, { switchTab, lookUpTranslations })(WordTabs);
