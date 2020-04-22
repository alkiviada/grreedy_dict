import { 
  REGISTER_LESSON_ID,
  CLEAR_FETCHED_LESSON,
  FETCH_LESSON,
  FETCH_LESSONS,
  FETCH_WORK_FULFILLED,
  FETCH_LESSON_FULFILLED,
  FETCH_LESSONS_FULFILLED,
  FETCH_LESSON_REJECTED,
  FETCH_LESSONS_REJECTED,
  POST_LESSON,
  FETCH_COLLECTION_FULFILLED,
  SAVE_COLLECTION_FULFILLED,
  POST_LESSON_FULFILLED,
  POST_WORK_FULFILLED,
  POST_LESSON_REJECTED,
  POST_WORK_REJECTED,
} from './types';

export const registerLessonId = (lessonId) => dispatch => {
  dispatch({
    type: REGISTER_LESSON_ID,
    payload: lessonId,
  })
};

export const clearFetchedLesson = () => dispatch => {
 console.log('clearing fetched lesson');
  dispatch({
    type: CLEAR_FETCHED_LESSON,
  })
};


export const requestLesson = () => (dispatch) => {
  console.log('requesting lesson')
  dispatch({
    type: FETCH_LESSON,
  })
};

export const requestLessons = () => (dispatch) => {
  console.log('requesting lessons')
  dispatch({
    type: FETCH_LESSONS,
  })
};

export const postLesson = (lessonId, text, title) => (dispatch, getState) => {
  console.log('posting lesson');
  console.log(lessonId)
  let headers = {"Content-Type": "application/json"};
  let body = JSON.stringify({lessonId, text, title});

  fetch('/api/lesson/post/', {headers, body, method: "POST"})
  .then(response =>
      response.json().then(json => ({
        status: response.status,
        json
      })
    ))
  .then(
      // Both fetching and parsing succeeded!
      ({ status, json }) => {
        if (status >= 400) {
          // Status looks bad
          console.log(status);
          console.log(json);
          console.log('Server returned error status when posting lesson');
          dispatch({type: POST_LESSON_REJECTED, })
        } else {
          // Status looks good
          console.log(json)
          dispatch({
            type: POST_LESSON_FULFILLED,
            payload: json.text,
          })
          dispatch({
            type: REGISTER_LESSON_ID,
            payload: json.lesson_id,
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: POST_LESSON_REJECTED, })
      }
    ); 
};

export const fetchLesson = (lessonId) => { return (dispatch, getState) => {
  console.log('fetching lesson');
  console.log(lessonId)
  return fetch('/api/lesson/post/' + lessonId)
  .then(response =>
      response.json().then(json => ({
        status: response.status,
        json
      })
    ))
  .then(
      // Both fetching and parsing succeeded!
      ({ status, json }) => {
        if (status >= 400) {
          // Status looks bad
          console.log(status);
          console.log(json);
          console.log('Server returned error status when fetching lesson');
          dispatch({type: FETCH_LESSON_REJECTED, })
        } else {
          // Status looks good
          console.log(json)
          dispatch({
            type: FETCH_LESSON_FULFILLED,
            payload: json.text,
          })
          dispatch({
            type: REGISTER_LESSON_ID,
            payload: json.lesson_id,
          })
          if(json.collId) {
          dispatch({
            type: REGISTER_COLLECTION,
            payload: json.collId,
          })
          }
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_LESSON_REJECTED, })
      }
    ); 
};
};

export const fetchWork = (lessonId) => { return (dispatch, getState) => {
  console.log('fetching work');
  console.log(lessonId)
  return fetch('/api/lesson/' + lessonId)
  .then(response =>
      response.json().then(json => ({
        status: response.status,
        json
      })
    ))
  .then(
      // Both fetching and parsing succeeded!
      ({ status, json }) => {
        if (status >= 400) {
          // Status looks bad
          console.log(status);
          console.log(json);
          console.log('Server returned error status when fetching lesson');
          dispatch({type: FETCH_LESSON_REJECTED, })
        } else {
          // Status looks good
          console.log(json)
          dispatch({
            type: FETCH_WORK_FULFILLED,
            payload: json,
          })
          dispatch({
            type: REGISTER_LESSON_ID,
            payload: json.lesson_id,
          })
          const lastModifiedMap = getState().collections.lastModifiedMap
          const uuid = json.collId
          lastModifiedMap[uuid] = lastModifiedMap[uuid] ? lastModifiedMap[uuid] : {'words': {}, 'time': 0, 'name': ''}
           let time = Date.now();
           time = Math.floor(time/1000);
          lastModifiedMap[uuid]['words'][1] = json.words.map(w => w.word) 
          lastModifiedMap[uuid]['time'] = time 
          lastModifiedMap[uuid]['allWordCount'] = json.words.length 
          dispatch({
            type: SAVE_COLLECTION_FULFILLED,
            payload: { uuid, name, lastModifiedMap }
           });
          return dispatch({
            type: FETCH_COLLECTION_FULFILLED,
            payload: { uuid: json.collId, collWords: json.words.map(w => w.word), },
          });
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_LESSON_REJECTED, })
      }
    ); 
};
};

export const postWork = (lessonId, work, collId) => (dispatch, getState) => {
  console.log('posting lesson work');
  console.log(lessonId)
  console.log(getState().collections)
  const collId = getState().collections.uuid;
  console.log(collId)
  let headers = {"Content-Type": "application/json"};
  let body = JSON.stringify({lessonId, work, collId});

  fetch('/api/lesson/post/work/', {headers, body, method: "POST"})
  .then(response =>
      response.json().then(json => ({
        status: response.status,
        json
      })
    ))
  .then(
      // Both fetching and parsing succeeded!
      ({ status, json }) => {
        if (status >= 400) {
          // Status looks bad
          console.log(status);
          console.log(json);
          console.log('Server returned error status when posting lesson');
          dispatch({type: POST_WORK_REJECTED, })
        } else {
          // Status looks good
          console.log(json)
          dispatch({
            type: POST_WORK_FULFILLED,
            payload: json.work,
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: POST_WORK_REJECTED, error: 'posting work problem'})
      }
    ); 
};

export const fetchLessons = () => { return (dispatch, getState) => {
  console.log('fetching lessons');
  return fetch('/api/lessons/')
  .then(response =>
      response.json().then(json => ({
        status: response.status,
        json
      })
    ))
  .then(
      // Both fetching and parsing succeeded!
      ({ status, json }) => {
        if (status >= 400) {
          // Status looks bad
          console.log(status);
          console.log(json);
          console.log('Server returned error status when fetching lessons');
          dispatch({type: FETCH_LESSONS_REJECTED, })
        } else {
          // Status looks good
          console.log(json.lessons)
          dispatch({
            type: FETCH_LESSONS_FULFILLED,
            payload: json.lessons,
          })
        }
      },
      // Either fetching or parsing failed!
      err => {
        console.log('problems');
        dispatch({type: FETCH_LESSONS_REJECTED, })
      }
    ); 
};
};
