import { Component } from 'react';
import Footer from '../app/Footer';
import Cover from './home/Cover';

export default class Home extends Component {
  render() {
    return (
      <>
        <Cover />
        <Footer />
      </>
    );
  }
}
