import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import DecorateWithLinks from "./DecorateWithLinks";
import WordCell from "./WordCell";
import DictionaryWidget from "./DictionaryWidget";
import { fetchWord, requestWord, clearFetching } from '../actions/wordsActions';
import { registerCollection } from '../actions/collectionsActions';
import { registerLessonId, requestLesson, postLesson, clearFetchedLesson, fetchLesson, fetchWork, postWork } from '../actions/lessonActions';
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

class Lesson extends Component {
  constructor(props) { 
    super(props)
    this.handleChange = this.handleChange.bind(this);
    this.handleLessonSubmit = this.handleLessonSubmit.bind(this);
    this.handleWorkSubmit = this.handleWorkSubmit.bind(this);
    this.dictionary = this.dictionary.bind(this) 
    this.workRef = React.createRef();
    this.state = {
      tabIndex: 0,
      text: '',
      title: '',
      work: '',
      workScrollTop: 0,
    };
  }
  handleSelect(prev, index, workRef) {
    console.log('select')
    console.log(prev)
     if (prev == 0) {
       console.log('logging scroll top')
       console.log(this.workRef.current); 
       console.log(this.workRef.current.children[0]); 
       this.setState( { workScrollTop: this.workRef.current.children[0].children[0].children[1].children[0].scrollTop} );
     }
     else {
     }
     this.setState( { tabIndex: index } );
  }

  dictionary(e, word) {
    e.preventDefault();
    console.log('dictionary')
    const { words, collId } = this.props
    this.setState( { workScrollTop: this.workRef.current.children[0].children[0].children[1].children[0].scrollTop} );
    const wordElementIndex = words.findIndex(w => w.word == word);
    console.log(wordElementIndex)
    this.props.requestWord(word)
    if (wordElementIndex < 0) { 
      console.log('looking up')
      this.props.fetchWord(word).then(() => {
        console.log(this.props.words)
        this.props.clearFetching()
        console.log('need to register?')
        console.log(collId)
        this.setState({...this.state, tabIndex: 1});
      })
    }
    else {
        this.setState({...this.state, tabIndex: 1});
    }
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
    const text = this.state.text ? this.state.text : this.props.text
    const title = this.state.title ? this.state.title : this.props.title
    console.log(text)
    console.log(title)
    if (text) {
      this.props.requestLesson()
      this.props.postLesson(lessonId, text, title);
    }
  }
  handleWorkSubmit(event) {
    event.preventDefault();
    console.log('submitting work');
    const { lessonId, collId } = this.props;
    console.log(lessonId)
    const work = this.props.work ? this.props.work : this.state.work
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
    if (this.state.workScrollTop && this.workRef.current && this.state.tabIndex == 0) {
      workScrollTop: this.workRef.current.children[0].children[0].children[1].children[0].scrollTop = this.state.workScrollTop;
    }
  }
  

  componentDidMount() {
    console.log(this.props)
    console.log('mounted lesson')
    const lessonId = this.props.match.params.lesson_id
    console.log(lessonId)
    console.log('mounting lesson');
    if (lessonId) {
      this.props.registerLessonId(lessonId)
      this.props.requestLesson();
      this.props.fetchWork(lessonId).then(() => { 
        
        console.log(this.props.collWords)
        console.log('i will fetch first word')
        if (this.props.collWords.length) {
        this.props.requestWord(this.props.collWords[0])
        this.props.fetchWord(this.props.collWords[0]).then(() => {})
        }
      })
    }
  }

  render () {
    const lessonId = this.props.match.params.lesson_id
    console.log(lessonId)

    console.log('render')

    if (this.props.match.path.includes('post')) {
      const text = this.state.text ? this.state.text : this.props.text;
      const title = this.state.title ? this.state.title : this.props.title;
      return (
        <div className="lesson">
          <form className="lesson-add-form" onSubmit={this.handleAddNote}>
            <input className="lesson-name" value={title} name="title" onChange={this.handleChange} />
            <textarea className="lesson-txtarea" value={text} name="text" onChange={this.handleChange} />
            <button type="submit" className="lesson-add-btn" onClick={(e) => this.handleLessonSubmit(e)}>Create Lesson</button>
          </form>
        </div>
      );
    }
    else {
      const work = !this.props.fetched ? this.state.work : this.props.work;
      const { word, words } = this.props;
      return (
        <div className="work" ref={this.workRef}>
          <div className="lesson-container">
          <Tabs selectedIndex={this.state.tabIndex} onSelect={(prev, index) => this.handleSelect(index, prev, this.workRef)}>
          <TabList className="react-tabs__tab-list lesson-tabs">
           <Tab>Lesson</Tab>
           { words.length ? <Tab>Dictionary</Tab> : '' }
          </TabList>
          <TabPanel className="react-tabs__tab-panel lesson-tab-panel">
          <div className="lesson-material"><DecorateWithLinks words={this.props.text} onLinkClick={this.dictionary} original={null} parentRef={null} /></div> 
          </TabPanel>
          { words.length ? 
          <TabPanel className="react-tabs__tab-panel lesson-tab-panel"><DictionaryWidget redirect={0} /></TabPanel> : '' 
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
  words: state.words.words,
  collWords: state.collections.collWords,
  word: state.words.word,
  text: state.lesson.text,
  work: state.lesson.work,
  lessonId: state.lesson.lessonId,
  collId: state.collections.uuid,
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
  registerCollection,
  requestLesson,
  postLesson,
  postWork,
  fetchLesson,
})(Lesson));
