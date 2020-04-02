import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { fetchLessons, requestLessons } from '../actions/lessonActions';

const mapStateToProps = state => ({
  lessons: state.lesson.lessons,
});

class LessonsList extends Component {
  constructor(props) { 
    super(props)
  }

  static propTypes = {
    lessons: PropTypes.array.isRequired,
  }

  componentDidMount() {
    this.props.requestLessons();
    this.props.fetchLessons();
  }

  render () {
    const { lessons } = this.props;
    console.log(lessons)
    return lessons.length ? (
      <ul className="lessons-list">
       { lessons.map(l => 
          <li><a href={`/lesson/${l.lesson_id}`} className="lesson-link">
            <span className="lessons-name">{l.title}</span>
            </a>
         </li>
       )}
      </ul>
   ) : <div className="colls-sidebar"><div className="colls-empty"></div></div>
 }
}

export default connect(mapStateToProps, {  
                                          requestLessons, 
                                          fetchLessons, 
                                          })(LessonsList);
