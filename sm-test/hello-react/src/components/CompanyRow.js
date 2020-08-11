import React, { Component } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core';
import axios from 'axios'
import '../Global'

class CompanyRow extends Component {
    state = {
        service: (this.props.data.service == null) ? '' : this.props.data.service,
        companyName: this.props.data.companyName
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleDeleteClick = () => {
        axios.post(global.url+"deletecompany", { companyName: this.state.companyName },{withCredentials:true}).then(res => {
            this.props.requestRefresh();
        }
        )

    }

    onSave = () => {
        axios.put(global.url+"updatecompany",
            { 
                companyName: this.state.companyName,
                 service: this.state.service },{withCredentials:true}).then(res => {
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
                    {this.state.companyName}
                </TableCell>
                <TableCell>
                    <TextField
                        name="service"
                        value={this.state.service}
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

export default CompanyRow