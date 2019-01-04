import React, { Component } from "react";
import Placeholder from "./Placeholder";
import { connect } from 'react-redux';
import { fetchConjugations, requestConjugations, } from '../actions/conjugsActions';

const prons = ['je', 'tu', 'il', 'nous', 'vous', 'ils']

class JustConjugate extends Component {
  constructor(props) { 
    super(props)
    this.check = this.check.bind(this) 
    this.jconjRefMap = prons.reduce((map, p) => (map[p] = [ React.createRef(), React.createRef() ], map), {});
  }
  check(e) {
    console.log('check');
    e.preventDefault();
    this.props.requestConjugations()
    this.props.fetchConjugations('fare').then(() => {
      const { conjugs } = this.props
      prons.forEach((p, i) => { 
        console.log(this.jconjRefMap[p][1].current.innerHTML)
        console.log(conjugs[i])
        if (conjugs[i] != this.jconjRefMap[p][1].current.innerHTML.trim())  
          this.jconjRefMap[p][0].current.innerHTML = conjugs[i]
      })
    });
  }

  render () {
    return <div ref={this.jconjRef} className="just-conjugate">
    { prons.map(p => 
       <div className="who-conjugate">
         <div className="who">
           <span className="pron">{p}</span>
         </div>
         <div className="correct">
         <span ref={this.jconjRefMap[p][0]} className="super"></span>
         <Placeholder ref={this.jconjRefMap[p][1]} />
         </div></div>
     )}
    <button onClick={(e) => this.check(e)}>Test</button>
    </div>
  }
}

const mapStateToProps = state => ({
  conjugs: state.conjugs.items,
});

export default connect(mapStateToProps, { fetchConjugations, requestConjugations, })(JustConjugate);
