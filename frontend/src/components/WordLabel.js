import React, { Component } from "react";
import PropTypes from "prop-types";

const WordLabel = (props) => {
  const { page, count, allCount } = props;
  console.log(page)
  if (page == 1 && !(count < allCount)) { 
    return (
      <strong>
      {count}
      </strong>
    )
  }
  else {
    const start = page == 1 ? 1 : count == 20 ? (page-1)*count + 1 : (page-1)*20 + 1 
    const end = page == 1 ? 20 : start + count - 1
    return (
      <strong>
      {start} - {end}
      </strong>
    )
  }
}

export default WordLabel;
