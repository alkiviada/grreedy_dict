import React, { Component } from "react";
import { connect } from 'react-redux';
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { fetchConjugateHomework, 
         requestConjugateHomework, 
         storeMyHomeworkConjugs, 
         storeMyHomeworkConjugateRefs,
         logHomeworkTenseIdx
       } from '../actions/conjugsHomeworkActions';

import TenseSelect  from "./TenseSelect";
import ConjugateHomework from "./ConjugateHomework";
import ConjugateHomeworkCheck from "./ConjugateHomeworkCheck";

import { countMatches } from './helpers'

const mapStateToProps = state => ({
  myConjugsRefs: state.conjugsHomework.myConjugsRefs,
  tenseIdx: state.conjugsHomework.tenseIdx,
  homework: state.conjugsHomework.homework,
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
    this.props.fetchConjugateHomework(verb, language)
     .then(() => {
       this.props.storeMyHomeworkConjugateRefs()
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
    const { tenseIdx, myConjugsRefs, language } = this.props

    this.setState( { tabIndex: index } );

    if (index == 1) {
      console.log('check homework');
      this.props.storeMyHomeworkConjugs(myConjugsRefs, language)
    }
  }

  render() {
    const { verb, language, homework } = this.props;

    return ( 
     <div className="conjugate-homework">
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, verb, language)}>
        <TabList>
          <Tab>Try <TenseSelect logTabTense={this.props.logHomeworkTenseIdx} onChangeFunc={this.fetchHomework} /></Tab>
          <Tab>Check</Tab>
        </TabList>
        <TabPanel>
          <ConjugateHomework homework={homework} />
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
