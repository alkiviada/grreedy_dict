import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { connect } from 'react-redux';

const mapStateToProps = state => ({
});


class ConjugateTabs extends Component {
  constructor(props) { 
    super(props)
    this.handleSelect = this.handleSelect.bind(this) 
    this.state = { tabIndex: 0 };
  }

  static propTypes = {
  };

  handleSelect(prev, index, verb) {
    console.log('switchinh tabs')
    console.log('check');
    this.props.requestConjugations()
    this.props.fetchConjugations(verb).then(() => {
      const { conjugs } = this.props
      prons.forEach((p, i) => { 
        console.log(this.jconjRefMap[p][1].current.innerHTML)
        console.log(conjugs[i])
        if (conjugs[i] != this.jconjRefMap[p][1].current.innerHTML.trim())  
          this.jconjRefMap[p][0].current.innerHTML = conjugs[i]
      })
    });
  }

  render() {
    const { verb } = this.props;

    return ( 
      <Tabs selectedIndex={this.state.tabIndex} 
        onSelect={(prev, index) => this.handleSelect(index, prev, verb)}>
        <TabList>
          <Tab>Try</Tab>
          <Tab>Check</Tab>
        </TabList>
        <TabPanel>
        <JustConjugate />
        </TabPanel>
        <TabPanel>
        </TabPanel>
     </Tabs>
    );
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ConjugateTabs);
