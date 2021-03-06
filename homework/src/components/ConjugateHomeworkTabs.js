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
  verbTensesMap: state.tenses.verbTensesMap,
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
    this.props.fetchVerbTenses(verb, language)
      .then(() => {
        this.props.fetchConjugateHomework(verb, language)
         .then(() => {
           this.props.storeMyHomeworkConjugateRefs()
        })
    })
  }

  componentDidMount() {
    const { verb, homework, language, tenseIdx } =  this.props
    this.fetchHomework()
  }

  static propTypes = {
  };

  handleSelect(prev, index, verb) {
    const { tenseIdx } = this.props

    this.setState( { tabIndex: index } );

    if (index == 1) {
      this.props.storeMyHomeworkConjugs()
    }
  }

  render() {
    const { verb, verbTensesMap, language, homework, addWord, fetching, fetched } = this.props;
    const tenses = verbTensesMap[verb] ? verbTensesMap[verb] : [ 0 ]
    const hwClassNames = classNames({ 'conjugate-homework': true, 'conjugate-hw__empty': fetching });
    return ( 
     <div className={hwClassNames}>
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, verb, language)}>
        <TabList>
          <Tab>Practice <TenseSelect logTabTense={this.props.logHomeworkTenseIdx} onChangeFunc={this.fetchHomework} tenses={tenses} /></Tab>
          <Tab>Check</Tab>
        </TabList>
        <TabPanel>
          { fetching ? <div className="hconjugate-empty"><em>Loading...</em></div> : <ConjugateHomework homework={homework} addWord={addWord} /> }
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
  storeMyHomeworkConjugateRefs,
  fetchVerbTenses,
}

export default connect(mapStateToProps, mapDispatchToProps)(ConjugateHomeworkTabs);
