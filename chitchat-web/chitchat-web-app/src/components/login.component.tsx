import { Component } from "react";
import Footer from "../app/Footer";
import Cover from "./home/Cover";

type Props = {};

type State = {
  redirect: string | null,
  username: string,
  password: string,
  loading: boolean,
  message: string
};

export default class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    //this.handleLogin = this.handleLogin.bind(this);

    this.state = {
      redirect: null,
      username: "",
      password: "",
      loading: false,
      message: ""
    };
  }

  // componentWillUnmount() {
  //   window.location.reload();
  // }

  // validationSchema() {
  //   return Yup.object().shape({
  //     username: Yup.string().required("This field is required!"),
  //     password: Yup.string().required("This field is required!"),
  //   });
  // }

  // handleLogin(formValue: { username: string; password: string }) {
  //   const { username, password } = formValue;

  //   this.setState({
  //     message: "",
  //     loading: true
  //   });

  // }

  render() {
    // if (this.state.redirect) {
    //   return <Navigate to={this.state.redirect} />
    // }

    // const { loading, message } = this.state;

    // const initialValues = {
    //   username: "",
    //   password: "",
    // };
    return (
      <>
        <Footer/>
      </>
    );
  }
}