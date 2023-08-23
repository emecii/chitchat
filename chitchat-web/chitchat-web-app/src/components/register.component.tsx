import { Component } from 'react';
import Footer from '../app/Footer';
import RegisterWizard from './register/RegisterWizard';
import PageLayout from '../app/PageLayout';

export default class Register extends Component {
  render() {
    return (
      <PageLayout>
        <RegisterWizard />
        <Footer />
      </PageLayout>
    );
  }
}
