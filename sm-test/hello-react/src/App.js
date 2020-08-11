import React, { Component } from 'react';
import axios from 'axios'
import LogPage from './components/LogPage'
import LoginPage from './components/LoginPage.js'
import AdminPage from './components/AdminPage.js'
import './Global'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class App extends Component {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);
    const { cookies } = props;
    this.state = {
      id: cookies.get('id')||"",
      page: cookies.get('page')||"Login",
    }
  }



  handleLogin = (id, msg) => {
    const{cookies}=this.props;
    const newPage=(msg === "admin") ? "Admin" : "Log";
    this.setState({
      id: id,
      page: newPage
    });
    cookies.set('id',id,{path:'/'});
    cookies.set('page',newPage,{path:'/'});
  }

  handleLogout = () => {
const{cookies}=this.props;
    axios.get(global.url + "logout", { withCredentials: true }).then(res => {
      console.log(res);
      this.setState({
        id: '',
        page: "Login"
      })
      cookies.set('id','',{path:'/'});
      cookies.set('page','Login',{path:'/'});
    });
  }

  render() {
    const { page } = this.state;
    if (page === "Login") {
      return (
        <div>
          <LoginPage
            loginSuccess={this.handleLogin}
          />
        </div>
      );
    }
    else if (page === "Log") {
      return (
        <div>
          <LogPage
            onLogOutClick={this.handleLogout}
          />
        </div>
      );
    }
    else if (page === "Admin") {
      return (
        <div>
          <AdminPage 
          onLogOutClick={this.handleLogout}
          />
        </div>
      );
    }
  }
}

export default withCookies(App);
