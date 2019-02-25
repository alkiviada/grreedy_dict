import React, { Component } from "react";
export const prons = { 'french': ['je', 'tu', 'il', 'nous', 'vous', 'ils'],
                       'italian': ['io', 'tu', 'lui', 'noi', 'voi', 'loro'],
                     }
export const tenses = ['present', 'past progressive', 'simple past', 'future', 'preterite past', ]

export const countMatches = (str) => {
  const re = /(\.\.\.)/g
  return ((str || '').match(re) || []).length
}

import DecorateWithLinks from "./DecorateWithLinks";

export const listStyles = {1: 'etym-style', 2: 'def-style', 3: 'exmpl-style'};

export const renderList = (el, fn, styles, styleCount) => {
  console.log('render')
  styleCount += 1;
  let listClass = styles[styleCount];
  if (!el.length) { 
    return ''
  }
  return el.map(el => ( 
    <ul className={listClass} key={el.id}>
    <li>
      {Object.entries(el).map(el => typeof(el[1]) === 'string' ? 
      <DecorateWithLinks words={el[1]} onLinkClick={fn} /> : 
      renderList(el[1], fn, styles, styleCount))}
    </li>
    </ul> 
   )
  );
}

export const makeTabLabel = (stub) => {
  const tabLabelPartsCapitalized = stub.split(' ').map(p => p.charAt(0) + p.slice(1).toLowerCase())
  return tabLabelPartsCapitalized.join(' ');
}
