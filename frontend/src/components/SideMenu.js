import React, { Component } from 'react'

class SideMenu extends Component {

  render() {
    return (
      <div className="side-menu-wrapper">
    <svg     
      xmlns="http://www.w3.org/2000/svg"    
      version="1.1"
      className="side-menu-svg"
      viewBox="31 6.4 19 11.1" width="100%" height="100%">
<defs>
<path id="girth-line"
  stroke="white"
  stroke-width=".28"
  stroke-linejoin="round"
  fill="none"
  d="M 12 12
     A 2 1.5 0 0 1 12 10
  "
/>
<line stroke="#b9bcc8" x1="19.9" x2="22" y1="10.5" y2="9.3" stroke-width=".1" id="page" />
</defs>
  <use href="#book" transform="scale(1.4) translate(13, 0)" />
  <use href="#book" transform="scale(1.2) translate(18, -.8)" />
<g transform="scale(1) translate(25, -1.4)">
<g id="book">
<path  class="book-cover"
  stroke="white"
  stroke-width=".2"
  stroke-linejoin="round"
  fill="#b78d52"
  fill-rule="evenodd"
  d="M 10 10 
     A 2 1.5 0 0 0 10 12
     L 20 12
     A 2 1.5 0 0 1 20 10
     L 10 10
     L 13 8.5
     L 22.6 8.5
     L 20 10
  "
/>
<path  class="book-girth"
  stroke="white"
  stroke-width=".2"
  stroke-linejoin="round"
  fill="white"
  fill-rule="evenodd"
  d="M 20 12
     A 2 1.5 0 0 1 20 10
     L 22.6 8.5
     A 2 1.5 0 0 0 22.5 10.5
  "
/>
  <use href="#page" transform="translate(0, 0)" />
  <use href="#page" transform="translate(-.1, .4)" />
  <use href="#page" transform="translate(-.1, .75)" />
  <use href="#page" transform="translate(.05, 1)" />
  <use href="#girth-line" transform="translate(0, 0)" />
  <use href="#girth-line" transform="translate(.6, 0)" />
</g>
</g>
</svg>
      </div>
    )
  }
}

export default SideMenu
