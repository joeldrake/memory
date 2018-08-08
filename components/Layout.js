import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './../static/css/main.css';

class Layout extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default Layout;
