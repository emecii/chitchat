import { Component } from "react";
import Footer from "../app/Footer";
import MyForum from "./forum/MyForum";
import styled from "styled-components";
import Navbar from "../app/Navbar";
type Props = {};

type State = {
  content: string;
}

const ForumPageWrapper = styled.div`
  padding-top: 20px;
`
export default class Forum extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: "chat page"
    };
  }

  render() {
    return (
      <>
      <Navbar />
      <ForumPageWrapper>
        <MyForum />
        <Footer />
      </ForumPageWrapper>
      </>
    );
  }
}