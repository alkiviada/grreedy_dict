import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { openMenu, closeMenu } from '../actions/contextActions';
import { loadUser, logout } from '../actions/authActions';
import { 
         fetchCollections, 
         fetchCollection, 
         saveCollection, 
         saveCollectionAndLoadNew, 
         requestCollections, 
         requestCollection } from '../actions/collectionsActions';
import { requestWords, fetchWords } from '../actions/wordsActions';

class Menu extends Component {
  constructor(props) { 
    super(props)
    this.handleMainClick = this.handleMainClick.bind(this) 
    this.onSignOutClick = this.onSignOutClick.bind(this) 
    this.handleCollectionsClick = this.handleCollectionsClick.bind(this) 
    this.state = {
      collsClass: 'collections-button',
    };
  }

  onSignOutClick(e) {
    console.log('cisgn out click');
    e.preventDefault();
    this.props.logout();
  }

  handleMainClick(e) {
    console.log('burger click');
    e.preventDefault();
    const opened = this.props.menuOpen
    if (!opened) 
      this.props.openMenu() 
    else { 
      this.props.closeMenu();
      if (this.state.collsClass.match('full')) 
        this.setState({ collsClass: 'collections-button full' });
      else 
        this.setState({ collsClass: 'collections-button' });
    }
  }

  onCollectionClick(e, uuid) {
    e.preventDefault();
    this.props.closeMenu();
    this.setState({ collsClass: 'collections-button full' });
    this.props.requestCollection();
    const { origUUId, allWords } = this.props
    
    if (origUUId && allWords.length) {
      this.props.saveCollectionAndLoadNew(this.props.origName, uuid);
    }
    else {
      console.log('fetch words')
      this.props.requestWords();
      this.props.fetchWords(uuid);
    }
  }

  handleCollectionsClick(e) {
    console.log('collections click');
    e.preventDefault();
    if (!this.props.colls.length) {
// I clicked - but the data is not loaded yet
// which means this can only be to open for the first time
// therefore - load collections and show them
      this.props.requestCollections();
      this.props.fetchCollections();
      this.setState({ collsClass: 'collections-button full open' });
    }
    else {
       if (this.state.collsClass.match('open')) {
// I clicked and the list of collections is already opened - close it
         this.setState({ collsClass: 'collections-button full' });
       }
       else 
         this.setState({ collsClass: 'collections-button full open' });
    }
  }

  render() {
    const auth = this.props.auth
    if (!auth.isAuthenticated) {
      return <div className="empty-menu"></div>
    }
    const opened = this.props.menuOpen
    const colls = this.props.colls
    console.log(opened)
    console.log(colls)
    console.log('menu')
    return opened ? 
      ( 
<Fragment>
      <button className="menu-open-button" onClick={this.handleMainClick}>
    <svg     
      className="menu-open-svg"
      xmlns="http://www.w3.org/2000/svg"    
      version="1.1"
      viewBox="0 3 18 22" width="100%" height="100%">
<defs>
</defs>
<path  
  d="
  M 1 20
  L 8 22
  A 2.6 2 0 0 0 10 22
  L 17 20
  L 17 10 
  L 10 12
  A 2.6 2 0 0 1 8 12
  L 1 10
  z
  "
/>
<line x1="8" x2="8" y1="22" y2="12" />
<line x1="10" x2="10" y1="22" y2="12" />
<path id="girth-arc" d="M 8 20 A 2.6 2 0 0 0 10 20" />
  <use href="#girth-arc" transform="translate(0, -1)" />
<circle fill="var(--sky-color)" cx="9" cy="8" r="2.6" />
</svg>
      </button>
         <nav className="menu" role="navigation" aria-label="Grreedy Menu">
          <ul className="menu-list">
            <li className="menu-li">
               <button className={this.state.collsClass} onClick={this.handleCollectionsClick}>Collections</button>
               { colls.length ?
               <ul class="collections-list">
                 { colls.map(e => 
                   <li className="collections-li"><a target="_blank" href={`/api/collection/${e.uuid}`} 
                   onClick={(c) => this.onCollectionClick(c, e.uuid)} className="coll-link">
                    <span className="coll-name">{e.name}</span> <span className="coll-date">{e.last_modified_date}</span>
                 </a></li>)}
               </ul> : ''
              }
            </li>
            <li className="menu-li">
               <button className="sign-out-button" onClick={this.onSignOutClick}>Sign Out</button>
            </li>
          </ul>
        </nav>
</Fragment>
      ) : 
      (
      <button className="menu-closed-button" onClick={this.handleMainClick}>
    <svg     
      xmlns="http://www.w3.org/2000/svg"    
      version="1.1"
      className="menu-closed-svg"
      viewBox="31 6.4 19 11.1" width="100%" height="100%">
<defs>
<path id="girth-line"
  stroke="white"
  stroke-width=".28"
  stroke-linejoin="round"
  fill="none"
  d="M 12 12
     A 2 1.5 0 0 1 12 10
  "
/>
<line stroke="#b9bcc8" x1="19.9" x2="22" y1="10.5" y2="9.3" stroke-width=".1" id="page" />
</defs>
  <use href="#book" transform="scale(1.4) translate(13, 0)" />
  <use href="#book" transform="scale(1.2) translate(18, -.8)" />
<g transform="scale(1) translate(25, -1.4)">
<g id="book">
<path  class="book-cover"
  stroke="white"
  stroke-width=".2"
  stroke-linejoin="round"
  fill="#b78d52"
  fill-rule="evenodd"
  d="M 10 10 
     A 2 1.5 0 0 0 10 12
     L 20 12
     A 2 1.5 0 0 1 20 10
     L 10 10
     L 13 8.5
     L 22.6 8.5
     L 20 10
  "
/>
<path  class="book-girth"
  stroke="white"
  stroke-width=".2"
  stroke-linejoin="round"
  fill="white"
  fill-rule="evenodd"
  d="M 20 12
     A 2 1.5 0 0 1 20 10
     L 22.6 8.5
     A 2 1.5 0 0 0 22.5 10.5
  "
/>
  <use href="#page" transform="translate(0, 0)" />
  <use href="#page" transform="translate(-.1, .4)" />
  <use href="#page" transform="translate(-.1, .75)" />
  <use href="#page" transform="translate(.05, 1)" />
  <use href="#girth-line" transform="translate(0, 0)" />
  <use href="#girth-line" transform="translate(.6, 0)" />
</g>
</g>
</svg>
      </button>
    )
  }
}

const mapStateToProps = state => ({
  menuOpen: state.context.menuOpen,
  colls: state.collections.items,
  auth: state.auth,
  origUUId: state.collections.uuid,
  origName: state.collections.name,
  allWords: state.words.items,
});

export default connect(mapStateToProps, { 
  logout, 
  openMenu, closeMenu, 
  fetchCollections, requestCollections,
  requestCollection,
 
                                          requestWords, 
                                          fetchWords, 
                                          fetchCollection, 
                                          saveCollection, 
                                          saveCollectionAndLoadNew, 
  })(Menu);
