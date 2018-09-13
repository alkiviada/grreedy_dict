import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";
import { connect } from 'react-redux';
import { fetchCollections, fetchCollection, requestCollections, requestCollection } from '../actions/collectionsActions';

const mapStateToProps = state => ({
  colls: state.collections.items,
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
    this.props.requestCollections();
    this.props.fetchCollections();
  }
  onCollectionClick(e, uuid) {
    console.log('collection look up');
    e.preventDefault();
    this.props.requestCollection();
    this.props.fetchCollection(uuid);
  }
  
  render () {
    const { colls } = this.props;
    return colls.length ? ( 
      <aside class="column is-2 is-narrow-mobile is-fullheight section">
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

export default connect(mapStateToProps, { requestCollections, fetchCollections, fetchCollection, requestCollection })(CollectionsSideBar);
