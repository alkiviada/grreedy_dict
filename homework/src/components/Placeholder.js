import React, { Component } from "react";

const Placeholder = React.forwardRef((props, ref) => (
 <span ref={ref} className="my-conjugate-verb" contenteditable="true"> ... </span>
))

export default Placeholder
