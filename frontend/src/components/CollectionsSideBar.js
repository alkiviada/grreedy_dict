import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";
import { connect } from 'react-redux';
import { fetchCollections, 
         fetchCollection, 
         saveCollection, 
         saveCollectionAndLoadNew, 
         requestCollections, 
         requestCollection } from '../actions/collectionsActions';
import { loadUser } from '../actions/authActions';
import { requestWords } from '../actions/wordsActions';

const mapStateToProps = state => ({
  colls: state.collections.items,
  auth: state.auth,
  origUUId: state.collections.uuid,
  origName: state.collections.name,
  allWords: state.words.items,
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

  componentWillMount() {
    console.log('mounting sidebar');
    if (this.props.auth.isAuthenticated) {
      this.props.requestCollections();
      this.props.fetchCollections();
    }
  }

  onCollectionClick(e, uuid) {
    console.log('collection look up');
    e.preventDefault();
    this.setState({isSidebarOpen: false});
    this.props.requestCollection();
    const origUUId = this.props.origUUId
    if (origUUId) {
      this.props.saveCollectionAndLoadNew(this.props.origName, uuid);
    }
    else {
    console.log(`i am here continuing with ${uuid}`)
    this.props.fetchCollection(uuid);
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
    console.log('collections')
    return auth.isAuthenticated && colls.length ? (
      <div className="colls-sidebar">
      <input type="checkbox" className="colls-toggle" id="colls-toggle" checked={this.state.isSidebarOpen} onChange={this.handleSidebarOpen} />
      <div className="colls-list">
      <ul className="coll-ul">
       { colls.map(e => 
          <li><a target="_blank" href={`/api/collection/${e.uuid}`} 
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
                                          fetchCollections, 
                                          fetchCollection, 
                                          saveCollection, 
                                          saveCollectionAndLoadNew, 
                                          requestCollection })(CollectionsSideBar);
