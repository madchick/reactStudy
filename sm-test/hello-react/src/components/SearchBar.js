import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import '../design/searchBar.scss'

class SearchBar extends Component {
    state = {
        from: null,
        to: null,
        companyName: '',
        closed: 'All'
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    onSearchClick = (e) => {
        e.preventDefault();
        this.props.onSearchClick(this.state)
    }



    render() {
        const { from, to, companyName, closed } = this.state;

        return (
            <form onSubmit={this.onSearchClick}>
                <TextField
                    id="From"
                    label="From"
                    name="from"
                    type="date"
                    defaultValue={from}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={this.handleChange}
                />

                <TextField
                    id="to"
                    label="To"
                    name="to"
                    type="date"
                    defaultValue={to}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={this.handleChange}
                />
                <FormControl style={{width: "150px"}} className='statusControl'>
                    <FormLabel className='formLable'><h1 id='status'>상태</h1></FormLabel>
                    <Select className='select' value={closed} name="closed" onChange={this.handleChange}>
                        <MenuItem value={'All'}>All&nbsp;&nbsp;&nbsp;&nbsp;</MenuItem>
                        <MenuItem value={false}>Open&nbsp;&nbsp;</MenuItem>
                        <MenuItem value={true}>Close</MenuItem>
                    </Select>
                </FormControl>
                <TextField label="고객사명" value={companyName} name="companyName" onChange={this.handleChange} />
                <Button className='search' type="submit" variant="contained" onClick={this.onSearchClick} color="primary">검색</Button>
                <Button className='add' variant="contained" onClick={this.props.onAddClick}>추가</Button>
                <div className='leftly'>
                    <Button className='logout' variant="contained" onClick={this.props.onLogOutClick}>Log Out</Button>
                    <Button className='company' variant="contained" onClick={this.props.onCompanyInfoClick}>고객사 정보</Button>
                </div>
            </form>
        );
    }
}

export default SearchBar;