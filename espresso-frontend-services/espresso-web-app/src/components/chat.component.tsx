import { Component } from "react";
import Footer from "../app/Footer";
import ChatBox from "./chat/ChatBox";
import styled from "styled-components";
type Props = {};

type State = {
  content: string;
}

const ChatPageWrapper = styled.div`
  padding-top: 60px;
`

export default class Chat extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: "chat page"
    };
  }

  render() {
    return (
      <ChatPageWrapper>
        <ChatBox userId={"test1"}/>
        <Footer />
      </ChatPageWrapper>
    );
  }
}