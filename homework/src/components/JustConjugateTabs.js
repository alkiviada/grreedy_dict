import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { connect } from 'react-redux';

import JustConjugate from "./JustConjugate";
import CheckConjugate from "./CheckConjugate";
import TenseSelect  from "./TenseSelect";

import { fetchConjugations, requestConjugations, storeMyConjugs } from '../actions/conjugsActions';
const mapStateToProps = state => ({
  myConjugsRefMap: state.conjugs.myConjugsRefMap,
  tenseIdx: state.conjugs.tenseIdx,
});

class JustConjugateTabs extends Component {
  constructor(props) { 
    super(props)
    this.handleSelect = this.handleSelect.bind(this) 
    
    this.state = { tabIndex: 0 };
  }


  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('getting snap shot tabs')
  }

  static propTypes = {
  };

  handleSelect(prev, index, verb) {
    console.log('switchinh tabs')
    const { tenseIdx, myConjugsRefMap } = this.props

    this.setState( { tabIndex: index } );

    if (index == 1) {
      console.log('check');
      this.props.storeMyConjugs(myConjugsRefMap)
      this.props.requestConjugations()
      this.props.fetchConjugations(verb, language, tenseIdx)
    }
  }

  render() {
    const { verb, myConjugsRefMap, language } = this.props;

    return ( 
     <div className="just-conjugate">
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, verb, language)}>
        <TabList>
          <Tab>Try <TenseSelect /></Tab>
          <Tab>Check</Tab>
        </TabList>
        <TabPanel>
          <JustConjugate language={language} />
        </TabPanel>
        <TabPanel>
          <CheckConjugate />
        </TabPanel>
     </Tabs>
    </div>
    );
  }
}

const mapDispatchToProps = {
  fetchConjugations, requestConjugations,
  storeMyConjugs,
}

export default connect(mapStateToProps, mapDispatchToProps)(JustConjugateTabs);
