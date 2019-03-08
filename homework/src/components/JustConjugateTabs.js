import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { connect } from 'react-redux';

import JustConjugate from "./JustConjugate";
import CheckConjugate from "./CheckConjugate";
import TenseSelect  from "./TenseSelect";
import { TENSES } from '../actions/helpers'

import { fetchConjugations, requestConjugations, storeMyConjugs, logTenseIdx } from '../actions/conjugsActions';

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
    const { tenseIdx, myConjugsRefMap, language } = this.props

    this.setState( { tabIndex: index } );

    if (index == 1) {
      console.log('check');
      this.props.storeMyConjugs(myConjugsRefMap, language)
      this.props.requestConjugations()
      this.props.fetchConjugations(verb, language, tenseIdx)
    }
  }

  render() {
    const { verb, myConjugsRefMap, language } = this.props;
    console.log(Object.keys(TENSES).sort())
    return ( 
     <div className="just-conjugate">
      <ScallopedSVG />
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, verb, language)}>
        <TabList>
          <Tab>Conjugate <TenseSelect logTabTense={this.props.logTenseIdx} tenses={Object.keys(TENSES).sort()} /></Tab>
          <Tab>Check</Tab>
        </TabList>
        <TabPanel>
          <JustConjugate language={language} />
        </TabPanel>
        <TabPanel>
          <CheckConjugate language={language} />
        </TabPanel>
     </Tabs>
    </div>
    );
  }
}

const ScallopedSVG = ({
  transform = 'scale(1.28,-1.28) translate(0 -100)',
  width = '100%',
  className = 'scalloped-paper',
  viewBox = '0 88 496 30',
  fillRule = 'evenodd',
  fill = '#ede4d3ed',
}) => 
<svg viewBox={viewBox} width={width} className={className}>
<path class="scallop" d="M20.458 26.965c-.15.023-.302.035-.458.035H3a3 3 0 0 1-3-3V0h388v24a3 3 0 0 1-3 3h-17c-.183 0-.363-.016-.537-.048-5.973-.012-9.968.021-18.88-.006-4.864-.015-4.864-.082-4.734-4.133.199-6.15-4.566-11.096-11.305-11.735-7.9-.75-13.85 2.752-15.327 9.066a7.185 7.185 0 0 0-.113 2.536c.533 4.027.531 4.203-4.517 4.23-11.103.061-22.21-.117-33.313-.033-2.907.022-3.566-.965-3.308-3.079.604-4.967-1.136-9.114-6.711-11.53-4.568-1.979-9.308-1.951-13.753.324-4.363 2.231-6.336 5.595-6.116 9.875.229 4.445.187 4.477-5.272 4.49-10.534.022-21.068.024-31.602-.001-4.334-.01-4.525-.239-4.124-3.716.532-4.608-1.585-8.288-6.229-10.698-4.64-2.409-9.676-2.424-14.32-.007-4.637 2.412-6.773 6.084-6.238 10.694.398 3.43.2 3.708-3.757 3.72-10.992.032-21.985.043-32.976-.011-4.526-.023-4.533-.118-4.313-3.889.41-7.024-5.012-12.058-13.196-12.252-7.838-.185-13.594 5.01-13.392 12.087.108 3.784.11 3.933-4.534 3.984-11.217.126-22.433.237-33.652-.053-2.656-.068-3.346-.944-3.163-2.959.18-1.982.253-3.987-.667-5.917-2.491-5.222-8.484-7.834-15.643-6.77-5.698.847-10.184 5.569-10.235 10.773-.048 5.015-.048 5.02-6.047 5.022-9.433.002-12.826.01-19.568.001z" fill={fill} fill-rule={fillRule} transform={transform}></path>
</svg>;


const mapDispatchToProps = {
  fetchConjugations, requestConjugations,
  storeMyConjugs, logTenseIdx
}

export default connect(mapStateToProps, mapDispatchToProps)(JustConjugateTabs);
