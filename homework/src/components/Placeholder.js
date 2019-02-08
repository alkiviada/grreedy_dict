import React, { Component } from "react";

class Placeholder extends Component {
  constructor(props) { 
    super(props)
  }
  componentWillUnmount() {
  }

  componentDidUpdate() {
  }

  render () {
    const { pref, styleClass } = this.props
    console.log(pref)
    return <span ref={pref} className={styleClass} contenteditable="true" placeholder={"..."}></span>
  }
}

export default Placeholder
