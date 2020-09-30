import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CompanyRow from './CompanyRow'
import TablePagination from '@material-ui/core/TablePagination';
import { TextField } from '@material-ui/core';
import CompanyAdd from './CompanyAdd';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import '../Global'

class CompanyTable extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
      };

    constructor(props) {
        super(props)
        const{cookies}=props;
        this.state = {
            searchData: null,
            searchName:'',
            rowsPerPage: cookies.get('companyRowsPerPage')*1||5,
            page: 0,
            addOpen:false
        }
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

    handleChangePage = (event, newPage) => {
        this.setPage(newPage);
    };

    handleChangeRowsPerPage = (event) => {
        this.setRowsPerPage(parseInt(event.target.value, 10));
        this.setPage(0);
    };

    setPage = (newPage) => {
        this.setState({
            page: newPage
        })
    }

    setRowsPerPage = (newRowPerPage) => {
        const {cookies}=this.props;
        this.setState({
            rowsPerPage: newRowPerPage
        })
        cookies.set('companyRowsPerPage',newRowPerPage,{path:'/'});
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSearch=(e)=>{
        e.preventDefault();
        this.setState({
            searchData:this.props.companyData.filter(
                info=>info.companyName.indexOf(this.state.searchName)!==-1),
       page:0
        })
    }

    sortByCompanyName(c1, c2)
    {
        return c1.companyName<c2.companyName? -1:c1.companyName>c2.companyName? 1:0
    }
    
    handleRefresh=()=>{
        this.setState({
            searchData:null,
            page:0,
            searchName:''
        })
        this.props.dataRetrive();
    }

    componentDidUpdate(preProps,preState)
    {
        if(preProps.open===false&&this.props.open===true)
        {
            this.handleRefresh();
        }
    }

    render() {
        const { open, companyData } = this.props;
        const { searchData, page, rowsPerPage,searchName } = this.state;
        let validData = (searchData == null) ? companyData : searchData;
        validData=[].concat(validData).sort(this.sortByCompanyName);
        const showingRows = (rowsPerPage > 0) ?
            validData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : validData;
        return (
            <div>
            <Dialog open={open}
                onClose={this.props.onClose}
            >
                
                
                <DialogTitle>고객사 정보</DialogTitle>
                <DialogContent dividers={true}>
                    <form onSubmit={this.handleSearch}>
                        <TextField
                        label="고객사명"
                        name="searchName"
                        value={searchName}
                        onChange={this.handleChange}
                        ></TextField>
                    </form>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width:'250px'}}>고객사명</TableCell>
                                    <TableCell className="service">계약상황</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {showingRows.map(info => { return (
                                <CompanyRow
                                key={info._id}
                                data={info}
                                requestRefresh={this.handleRefresh}
                                />) })}
                            </TableBody>
                        </Table>
                        {showingRows.length>0?<p></p>:<p>검색 결과가 없습니다.</p>}
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={validData.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage} />
                        <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleAddClick}
                   
                >
                    추가</Button>
                </DialogContent>
            </Dialog>
            <CompanyAdd
            open={this.state.addOpen}
            onClose={this.handleAddClose}
            requestRefresh={this.handleRefresh}
            />
            </div>
        );
    }
}

export default withCookies(CompanyTable);