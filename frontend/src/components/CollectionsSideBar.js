import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";
import { connect } from 'react-redux';
import { fetchCollections, 
         fetchCollection, 
         saveCollection, 
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
    this.onCollectionClick = this.onCollectionClick.bind(this) 
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
    this.props.requestCollection();
    const origUUId = this.props.origUUId
    if (origUUId) {
      this.props.saveCollection(this.props.origName, origUUId, this.props.allWords.map(e => e.word).join(','));
    }
    this.props.fetchCollection(uuid);
  }
  
  render () {
    const { colls, auth } = this.props;
    return auth.isAuthenticated && colls.length ? (
      <aside class="column is-2 is-narrow-mobile section colls-column">
      <p className="menu-label">Collections</p>
      <ul className="menu-list">
       { colls.map(e => 
        <li className="coll-text">
          <a target="_blank" href={`/api/collection/${e.uuid}`} 
          onClick={(c) => this.onCollectionClick(c, e.uuid)} className="coll-link">
            {e.name}<br />{e.last_modified_date}
          </a>
        </li>
       )}
      </ul>
    </aside>
   ) : '';
 }
}

export default connect(mapStateToProps, { loadUser, 
                                          requestCollections, 
                                          requestWords, 
                                          fetchCollections, 
                                          fetchCollection, 
                                          saveCollection, 
                                          requestCollection })(CollectionsSideBar);
