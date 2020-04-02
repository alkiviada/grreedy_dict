import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import DecorateWithLinks from "./DecorateWithLinks";
import WordCell from "./WordCell";
import DictionaryWidget from "./DictionaryWidget";
import { fetchWord, requestWord, clearFetching } from '../actions/wordsActions';
import { registerLessonId, requestLesson, postLesson, clearFetchedLesson, fetchLesson, fetchWork, postWork } from '../actions/lessonActions';
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

class Lesson extends Component {
  constructor(props) { 
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.handleLessonSubmit = this.handleLessonSubmit.bind(this);
    this.handleWorkSubmit = this.handleWorkSubmit.bind(this);
    this.dictionary = this.dictionary.bind(this) 
    this.state = {
      tabIndex: 0,
      text: '',
      name: '',
      work: ''
    };
  }
  dictionary(e, word) {
    e.preventDefault();
    console.log('dictionary')
    const { words } = this.props
    const wordElementIndex = words.findIndex(w => w.word == word);
    console.log(wordElementIndex)
      this.props.requestWord(word)
    if (wordElementIndex < 0) { 
      console.log('looking up')
      this.props.fetchWord(word).then(() => {
        console.log(this.props.words)
        this.props.clearFetching()
      })
    }
    this.setState({...this.state, tabIndex: 1});
  }
  handleChange(event) {
    if (this.props.fetched) {
      this.props.clearFetchedLesson();
   }
   console.log(event.target.name)
   console.log(event.target.value)
   this.setState({ [event.target.name]: event.target.value});
  }

  handleLessonSubmit(event) {
    event.preventDefault();
    console.log('adding lesson');
    const { lessonId } = this.props;
    console.log(lessonId)
    const text = this.state.text
    const name = this.state.name 
    if (text) {
      this.props.requestLesson()
      this.props.postLesson(lessonId, text, name);
    }
  }
  handleWorkSubmit(event) {
    event.preventDefault();
    console.log('submitting work');
    const { lessonId } = this.props;
    console.log(lessonId)
    const work = this.state.work ? this.state.work : ''
    console.log(work)
    console.log(this.state)
    if (work) {
      this.props.requestLesson()
      this.props.postWork(lessonId, work);
    }
  }

  static propTypes = {
    fetchWord: PropTypes.func.isRequired,
    dictionary: PropTypes.func.isRequired,
    requestWord: PropTypes.func.isRequired,
  };


  componentDidUpdate() {
    console.log('update')
    const lessonId = this.props.match.params.lesson_id
  }
  

  componentDidMount() {
    console.log(this.props)
    console.log('mounted lesson')
    const lessonId = this.props.match.params.lesson_id
    console.log(lessonId)
    console.log('mounting lesson');
    if (lessonId)
      this.props.registerLessonId(lessonId)
    if (lessonId) {
      this.props.requestLesson();
      this.props.fetchWork(lessonId).then(() => { })
    }
  }

  render () {
    const lessonId = this.props.match.params.lesson_id
    console.log(lessonId)

    console.log('render')

    if (this.props.match.path.includes('post')) {
      const text = this.state.text ? this.state.text : this.props.text;
      const name = this.state.name ? this.state.name : this.props.name;
      return (
        <div className="lesson">
          <form className="lesson-add-form" onSubmit={this.handleAddNote}>
            <input className="lesson-name" value={name} name="name" onChange={this.handleChange} />
            <textarea className="lesson-txtarea" value={text} name="text" onChange={this.handleChange} />
            <button type="submit" className="lesson-add-btn" onClick={(e) => this.handleLessonSubmit(e)}>Create Lesson</button>
          </form>
        </div>
      );
    }
    else {
      const work = !this.props.fetched ? this.state.work : this.props.work;
      console.log(this.props);
      console.log(work)
      const { word, words } = this.props;
      const wordElementIndex = words.findIndex(w => w.word == word);
      const displayWord = words[wordElementIndex] ? words[wordElementIndex] : words[0]
      return (
        <div className="work">
          <div className="lesson-container">
          <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
          <TabList className="react-tabs__tab-list lesson-tabs">
           <Tab>Lesson</Tab>
           { words.length ? <Tab>Dictionary</Tab> : '' }
          </TabList>
          <TabPanel className="react-tabs__tab-panel lesson-tab-panel">
          <div className="lesson-material"><DecorateWithLinks words={this.props.text} onLinkClick={this.dictionary} original={null} parentRef={null} /></div> 
          </TabPanel>
          { words.length ? 
          <TabPanel className="react-tabs__tab-panel lesson-tab-panel"><DictionaryWidget word={displayWord} addToDict={this.dictionary} /></TabPanel> : '' 
          }
          </Tabs>
          </div>

          <form className="work-add-form" onSubmit={this.handleWorkSubmit}>
            <textarea className="lesson-txtarea" value={work} name="work" onChange={this.handleChange} />
            <button type="submit" className="lesson-submit-btn" onClick={(e) => this.handleWorkSubmit(e)}>Submit Work</button>
          </form>
        </div>
      )
    }
  }
}

const mapStateToProps = state => ({
  words: state.words.items,
  word: state.words.word,
  uuid: state.collections.uuid,
  text: state.lesson.text,
  work: state.lesson.work,
  lessonId: state.lesson.lessonId,
  fetched: state.lesson.fetched,
  fetching: state.lesson.fetching,
});

export default withRouter(connect(mapStateToProps, { 
  clearFetching,
  clearFetchedLesson,
  requestWord, 
  fetchWord, 
  fetchWork, 
  registerLessonId,
  requestLesson,
  postLesson,
  postWork,
  fetchLesson,
})(Lesson));
