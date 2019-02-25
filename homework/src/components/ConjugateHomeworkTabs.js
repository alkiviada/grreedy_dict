import React, { Component } from "react";
import { connect } from 'react-redux';
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { fetchConjugateHomework, 
         requestConjugateHomework, 
         storeMyHomeworkConjugs, 
         storeMyHomeworkConjugateRefs,
         logHomeworkTenseIdx
       } from '../actions/conjugsHomeworkActions';

import { fetchVerbTenses } from '../actions/tensesActions';

import TenseSelect  from "./TenseSelect";
import ConjugateHomework from "./ConjugateHomework";
import ConjugateHomeworkCheck from "./ConjugateHomeworkCheck";

import { countMatches } from './helpers'
let classNames = require('classnames');

const mapStateToProps = state => ({
  myConjugsRefs: state.conjugsHomework.myConjugsRefs,
  tenseIdx: state.conjugsHomework.tenseIdx,
  homework: state.conjugsHomework.homework,
  fetching: state.conjugsHomework.homeworkFetching,
  fetched: state.conjugsHomework.homeworkFetched,
  verbTensesMap: state.tense.verbTensesMap,
});

class ConjugateHomeworkTabs extends Component {
  constructor(props) { 
    super(props)
    this.handleSelect = this.handleSelect.bind(this) 
    this.fetchHomework = this.fetchHomework.bind(this) 
    
    this.state = { tabIndex: 0 };
  }

  fetchHomework() {
    const { verb, language } = this.props
    this.props.requestConjugateHomework();
    this.props.fetchVerbTenses()
      .then(() => {
        this.props.fetchConjugateHomework(verb, language)
         .then(() => {
           this.props.storeMyHomeworkConjugateRefs()
        })
    })
  }

  componentDidMount() {
    const { verb, homework, language, tenseIdx } =  this.props
    console.log('tis is my verb')
    console.log('mounting homework tabs')
    this.fetchHomework()
  }

  static propTypes = {
  };

  handleSelect(prev, index, verb) {
    console.log('switchinh homework tabs')
    const { tenseIdx } = this.props

    this.setState( { tabIndex: index } );

    if (index == 1) {
      console.log('check homework');
      this.props.storeMyHomeworkConjugs()
    }
  }

  render() {
    const { verb, verbTenseMap, language, homework, addWord, fetching, fetched } = this.props;
    const tenses = verbTenseMap[verb]
    const hwClassNames = classNames({ 'conjugate-homework': true, 'conjugate-hw__empty': fetching });
    console.log(hwClassNames)
    return ( 
     <div className={hwClassNames}>
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, verb, language)}>
        <TabList>
          <Tab>Practice <TenseSelect logTabTense={this.props.logHomeworkTenseIdx} onChangeFunc={this.fetchHomework} tenses={tenses} /></Tab>
          <Tab>Check</Tab>
        </TabList>
        <TabPanel>
          { fetching ? <em>Loading...</em> : <ConjugateHomework homework={homework} addWord={addWord} /> }
        </TabPanel>
        <TabPanel>
          <ConjugateHomeworkCheck homework={homework} />
        </TabPanel>
     </Tabs>
    </div>
    );
  }
}

const mapDispatchToProps = {
  fetchConjugateHomework, requestConjugateHomework,
  storeMyHomeworkConjugs, logHomeworkTenseIdx,
  storeMyHomeworkConjugateRefs
}

export default connect(mapStateToProps, mapDispatchToProps)(ConjugateHomeworkTabs);
