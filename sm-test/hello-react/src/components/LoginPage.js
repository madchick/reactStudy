import React, { Component } from 'react';
import axios from "axios"
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import '../Global'
import '../design/login.scss'
class LogPage extends Component {
    state = {
        id: '',
        pw: '',
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onLogin = (e) => {
        e.preventDefault();
        this.postData();
    }

    postData = () => {
        const { id, pw } = this.state;
        axios.post(global.url+"login",
         { id: id, pwd: pw },{withCredentials:true}).then(res => {
             const msg=res.data.msg;
            if (msg !=="notExist") {
                this.props.loginSuccess(id,msg);
            } else {
                alert("가입하지 않은 아이디이거나, 잘못된 비밀번호입니다.");
                this.setState({
                    pw: ''
                })
            }
        }
        )
    }

    render = () => {
        const { id, pw } = this.state;
        return (
            <center>
            <form onSubmit={this.onLogin} className="loginForm">
                <TextField
                    required
                    id="id"
                    label="ID"
                    name="id"
                    variant="outlined"
                    value={id}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={this.handleChange}
                /><br/><br/>
                <TextField
                    required
                    id="pw"
                    label="PASSWORD"
                    name="pw"
                    variant="outlined"
                    value={pw}
                    type="password"
                    autoComplete="current-password"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={this.handleChange}
                /><br/><br/>
                <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={this.onLogin}
                >
                    Login
                </Button>
            </form>
            </center>
        )
    }
}

export default LogPage;
