import React from 'react';
import LoginPage from './register/LoginPage';
import UnAuthenticatedLayout from '../app/UnAuthenticatedLayout';

export default class Login extends React.Component {
  render() {
    return (
      <UnAuthenticatedLayout>
        <LoginPage />
      </UnAuthenticatedLayout>
    );
  }
}
