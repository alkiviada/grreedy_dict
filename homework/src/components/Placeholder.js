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
    const { pref } = this.props
  return <span ref={pref} className="my-conjugate-verb" contenteditable="true" placeholder={"..."}></span>
  }
}

export default Placeholder
