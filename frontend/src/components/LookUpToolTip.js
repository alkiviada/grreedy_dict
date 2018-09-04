import React, { Component } from "react";
import PropTypes from "prop-types";
import Popover from "react-text-selection-popover";

class LookUpToolTip extends Component {
state = {
    selected: null
  };

constructor(props) {
    super(props);
    this.refParagraph = React.createRef();
    this.refCode = React.createRef();
  }

render() {
  return <div>
    <p ref={this.ref}>This text will trigger the popover</p>
<Popover isOpen={true} selectionRef={this.ref}>haha</Popover>
  </div>
}
}

export default LookUpToolTip;
