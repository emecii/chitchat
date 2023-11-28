import { Component } from 'react';
import ChatBox from './chat/ChatBox';
import AuthenticatedLayout from '../app/AuthenticatedLayout';

export default class Chat extends Component {
  render() {
    return (
      <AuthenticatedLayout>
        <ChatBox userId={'test1'} />
      </AuthenticatedLayout>
    );
  }
}
