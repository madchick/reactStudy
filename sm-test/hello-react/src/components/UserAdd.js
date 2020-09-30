import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import axios from 'axios'
import '../Global'
class UserAdd extends Component {
    state = {
        id: '',
        pwd: '',
        pwd2:''
    }

    handleSave = () => {
        const {pwd,pwd2} = this.state;
        if(pwd===pwd2)
        {
            axios.post(global.url+"register",
            { id: this.state.id, pwd: this.state.pwd }
            ,{withCredentials:true}).then(res => {
                this.props.requestRefresh();
                this.props.onClose();
            })
        }
        else{
            alert("비밀번호가 일치하지 않습니다.");
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    componentDidUpdate(prevProps, prevStates)
    {
        if(prevProps.open!==this.props.open)
        {
            this.setState({
                id:'',
                pwd:'',
                pwd2:''
            })
        }
    }

    render() {
        const { open } = this.props;
        return (
            <Dialog open={open}
                onClose={this.props.onClose}
            >
                <DialogTitle>사용자 추가</DialogTitle>
                <DialogContent>
                    <div>
                    <TextField
                    required
                    label="ID"
                        name="id"
                        value={this.state.id}
                        onChange={this.handleChange}>
                    </TextField>
                    </div>
                    <div>
                    <TextField
                    required
                    label="PASSWORD"
                        name="pwd"
                        type="password"
                        value={this.state.pwd}
                        onChange={this.handleChange}>
                    </TextField>
                    <br/>
                    <TextField
                    required
                    label="PASSWORD CHECK"
                        name="pwd2"
                        type="password"
                        value={this.state.pwd2}
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

export default UserAdd