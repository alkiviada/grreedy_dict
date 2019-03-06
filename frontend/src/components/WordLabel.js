import React, { Component } from "react";
import PropTypes from "prop-types";
import { maxWordsOnPages } from '../actions/constants';

const WordLabel = (props) => {
  const { page, count, allCount } = props;
  if (page == 1 && !(count < allCount)) { 
    return (
      <strong>
      {count}
      </strong>
    )
  }
  else {
    const start = page == 1 ? 1 : count == maxWordsOnPages ? (page-1)*count + 1 : (page-1)*maxWordsOnPages + 1 
    const end = page == 1 ? maxWordsOnPages : start + count - 1
    return (
      <strong>
      {start} - {end}
      </strong>
    )
  }
}

export default WordLabel;
