import React, { Component } from "react";
import DecorateWithLinks from "./DecorateWithLinks";

export const listStyles = {1: 'etym-style', 2: 'def-style', 3: 'exmpl-style'};

export const renderList = (el, fn, styles, styleCount) => {
  styleCount += 1;
  let listClass = styles[styleCount];
  if (!el.length) { 
    return ''
  }
  return el.map(el => ( 
    <ul className={listClass} key={el.id}>
    <li>
      {Object.entries(el).map(el => typeof(el[1]) === 'string' ? 
      <DecorateWithLinks words={el[1]} onLinkClick={fn}/> : 
      renderList(el[1], fn, styles, styleCount))}
    </li>
    </ul> 
   )
  );
}
