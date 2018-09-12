import React, { Component } from "react";
import PropTypes from "prop-types";
import key from "weak-key";
import { connect } from 'react-redux';
import { fetchCollections, requestCollections } from '../actions/collectionsActions';

const mapStateToProps = state => ({
  colls: state.collections.items,
});

class CollectionsSideBar extends Component {
  constructor(props) { 
    super(props)
  }

  static propTypes = {
    items: PropTypes.array.isRequired,
  }

  componentWillMount() {
    console.log('mounting sidebar');
    this.props.requestCollections();
    this.props.fetchCollections();
  }
  
  render () {
    const { colls } = this.props;
    return colls.length ? ( 
      <aside class="column is-2 is-narrow-mobile is-fullheight section">
      <p class="menu-label">Collections</p>
      <ul class="menu-list">
       { colls.map(e => 
        <li>
          <a href="#" class="">
            { `${e.name} ${e.created_date}` }
          </a>
        </li>
       )}
      </ul>
    </aside>
   ) : '';
 }
}

export default connect(mapStateToProps, { requestCollections, fetchCollections })(CollectionsSideBar);
