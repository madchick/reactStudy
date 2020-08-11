import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import axios from 'axios'
class CompanyAdd extends Component {
    state = {
        companyName: '',
        service: ''
    }

    handleSave = () => {
        axios.post(global.url+"addcompany",
        { companyName: this.state.companyName, service: this.state.service },{withCredentials:true}).then(res => {
            this.props.requestRefresh();
            this.props.onClose();
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    componentDidUpdate(preProps, preStates)
    {
        if(preProps.open!==this.props.open)
        {
            this.setState({
                companyName:'',
                service:''
            })
        }
    }

    render() {
        const { open } = this.props;
        return (
            <Dialog open={open}
                onClose={this.props.onClose}
            >
                <DialogTitle>고객사 추가</DialogTitle>
                <DialogContent>
                    <div>
                    <TextField
                    label="고객사명"
                        name="companyName"
                        value={this.state.companyName}
                        onChange={this.handleChange}>
                    </TextField>
                    </div>
                    <div>
                    <TextField
                    label="유무상"
                        name="service"
                        value={this.state.service}
                        onChange={this.handleChange}>
                    </TextField>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={this.handleSave}>저장</Button>
                </DialogActions>

            </Dialog>
        );
    }
}

export default CompanyAdd;