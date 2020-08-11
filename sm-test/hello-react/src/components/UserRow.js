import React, { Component } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import axios from 'axios'
import '../Global'

class UserRow extends Component {
    state = {
        id:this.props.data.id,
        old_pwd:'',
        new_pwd:''

    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleDeleteClick = () => {
        axios.post(global.url+"deleteuser", { id: this.state.id },{withCredentials:true}).then(res => {
            this.props.requestRefresh();
        }
        )

    }

    onSave = () => {
        axios.post(global.url+"pwdchange",
            { id: this.state.id, old_pwd: this.state.old_pwd, new_pwd:this.state.new_pwd }
            ,{withCredentials:true}).then(res => {
                if (res.data.msg === "ok")
                    alert("저장완료!");
                this.props.requestRefresh();
            }
            )
    }

    render() {
        return (
            <TableRow>

                <TableCell>
                    <TextField
                        name="id"
                        disabled
                        value={this.state.id}
                        onChange={this.handleChange}></TextField>
                </TableCell>
                <TableCell>
                    <TextField
                        name="old_pwd"
                        type="password"
                        value={this.state.old_pwd}
                        onChange={this.handleChange}>
                    </TextField>
                </TableCell>
                <TableCell>
                    <TextField
                        name="new_pwd"
                        type="password"
                        value={this.state.new_pwd}
                        onChange={this.handleChange}>
                    </TextField>
                </TableCell>
                <TableCell>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.onSave}
                    >
                        저장</Button>
                    <Button variant="contained"
                        onClick={() => { this.handleDeleteClick() }}>
                        삭제</Button>
                </TableCell>
            </TableRow>
        )// return
    }//render
}//Componet

export default UserRow