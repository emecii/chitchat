import { Component } from 'react';
import MyForum from './forum/MyForum';
import AuthenticatedLayout from '../app/AuthenticatedLayout';

export default class Forum extends Component {
  render() {
    return (
      <AuthenticatedLayout>
        <MyForum />
      </AuthenticatedLayout>
    );
  }
}
