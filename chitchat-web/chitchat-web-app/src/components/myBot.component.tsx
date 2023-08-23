import { Component } from 'react';
import CreateNewBot from './mybot/createNewBot';
import { createRandomUserId } from '../util/createRandomUserId';
import AuthenticatedLayout from '../app/AuthenticatedLayout';

export default class MyBot extends Component {
  render() {
    const modelId = createRandomUserId();
    return (
      <AuthenticatedLayout>
        <CreateNewBot modelId={modelId} />
      </AuthenticatedLayout>
    );
  }
}
