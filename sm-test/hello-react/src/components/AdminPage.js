import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import produce from 'immer'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import UserRow from './UserRow'
import UserAdd from './UserAdd';
import '../Global'

class AdminPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            addOpen: false
        }
        this.dataRetrive = () => {
            axios.get(global.url + "userlist", { withCredentials: true }).then(res => {
                    this.setState(produce(this.state, draft => {
                        draft.data = res.data.users;
                    }))
            })
        }
        this.dataRetrive();
    }

    handleAddClick=()=>{
        this.setState({
            addOpen:true
        })
    }

    handleAddClose=()=>{
        this.setState({
            addOpen:false
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    handleRefresh=()=>{
        this.dataRetrive();
    }
    render() {
        const { data } = this.state;
        return (
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleAddClick}
                >
                    추가</Button>
                <Button
                    variant="contained"
                    onClick={this.props.onLogOutClick}>
                    Log Out
                    </Button>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>PW</TableCell>
                                    <TableCell>New PW</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map(info => { return (
                                <UserRow
                                key={info._id}
                                data={info}
                                requestRefresh={this.handleRefresh}
                                />) })}
                            </TableBody>
                        </Table>
                   </TableContainer>
                
            <UserAdd
            open={this.state.addOpen}
            onClose={this.handleAddClose}
            requestRefresh={this.handleRefresh}
            />
            </div>
        );
    }
}

export default AdminPage;