import React, { Component } from "react";
import ReactDOM from "react-dom";
import DecorateWithLinks from "./DecorateWithLinks";

export const listStyles = {1: 'etym-style', 2: 'def-style', 3: 'exmpl-style'};

export const renderList = (el, fn, ref, orig, styles, styleCount) => {
  styleCount += 1;
  let listClass = styles[styleCount];
  if (!el.length) { 
    return ''
  }
  return el.map(el => ( 
    <ul className={listClass} key={el.id}>
    <li>
      {Object.entries(el).map(el => typeof(el[1]) === 'string' ? 
      <DecorateWithLinks words={el[1]} onLinkClick={fn} original={orig} parentRef={ref} /> : 
      renderList(el[1], fn, ref, orig, styles, styleCount))}
    </li>
    </ul> 
   )
  );
}

export const scrollToDomRef = (ref, offset = 35) => {
  const domNode = ReactDOM.findDOMNode(ref.current)
  window.scrollTo(0, domNode.offsetTop-offset)
}

export const makeTabLabel = (stub) => {
  return tabLabels[stub] ? tabLabels[stub] : stub;
}

const tabLabels = {
 'WordNote': 'Add Note'
}

export const tabs = [ 'Original word', 
               'Translations', 
               'Collocations', 
               'Synonyms', 
               'Pronunciation', 
               'WordNote', 
               'Conjugate' ] 
