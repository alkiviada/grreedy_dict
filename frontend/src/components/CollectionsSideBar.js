import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";
import { connect } from 'react-redux';
import { 
         fetchCollections, 
         fetchCollection, 
         saveCollection, 
         saveCollectionAndLoadNew, 
         requestCollections, 
         requestCollection } from '../actions/collectionsActions';
import { loadUser } from '../actions/authActions';
import { requestWords, fetchWords } from '../actions/wordsActions';

const mapStateToProps = state => ({
  colls: state.collections.items,
  auth: state.auth,
  origUUId: state.collections.uuid,
  origName: state.collections.name,
  allWords: state.collections.collWords,
});

class CollectionsSideBar extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      isSidebarOpen: false,
    };

    this.onCollectionClick = this.onCollectionClick.bind(this) 
    this.handleSidebarOpen = this.handleSidebarOpen.bind(this) 
  }

  static propTypes = {
    items: PropTypes.array.isRequired,
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated && !this.props.colls.length) {
      this.props.requestCollections();
      this.props.fetchCollections();
    }
  }

  onCollectionClick(e, uuid) {
    e.preventDefault();
    console.log('click')
    this.setState({isSidebarOpen: false});
    this.props.requestCollection();
    const { origUUId, allWords } = this.props
    
    if (origUUId && allWords.length) {
      this.props.saveCollectionAndLoadNew(this.props.origName, uuid);
    }
    else {
      console.log('fetch words')
      this.props.requestWords();
      this.props.fetchWords(uuid).then(() => {});
    }
  }
  
  handleSidebarOpen(e) {
    if (this.state.isSidebarOpen) {
      this.setState({isSidebarOpen: false});
    }
    else {
      this.setState({isSidebarOpen: true});
    }
  }

  render () {
    const { colls, auth } = this.props;
    return auth.isAuthenticated && colls.length ? (
      <div className="colls-sidebar">
      <input type="checkbox" className="colls-toggle" id="colls-toggle" checked={this.state.isSidebarOpen} onChange={this.handleSidebarOpen} />
      <div className="colls-list">
      <ul className="coll-ul">
       { colls.map(e => 
          <li><a target="_blank" href=""
          onClick={(c) => this.onCollectionClick(c, e.uuid)} className="coll-link">
            <span className="coll-name">{e.name}</span> <span className="coll-date">{e.last_modified_date}</span>
         </a></li>
       )}
      </ul>
     </div>
    <label for="colls-toggle" className="colls-toggle-label">
    <span>Collections</span>
    </label>
    </div>
   ) : <div className="colls-sidebar"><div className="colls-empty"></div></div>
 }
}

export default connect(mapStateToProps, { loadUser, 
                                          requestCollections, 
                                          requestWords, 
                                          fetchWords, 
                                          fetchCollections, 
                                          fetchCollection, 
                                          saveCollection, 
                                          saveCollectionAndLoadNew, 
                                          requestCollection })(CollectionsSideBar);
