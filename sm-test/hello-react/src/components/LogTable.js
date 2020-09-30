import React, { Component } from 'react';
import '../table.scss';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import LogRow from './LogRow';
import { Paper } from '@material-ui/core';
import TablePagination from '@material-ui/core/TablePagination';
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import '../Global'
import '../design/table.scss'

class LogTable extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };


  constructor(props) {
    super(props)
    const {cookies}=props;
    this.state={
      rowsPerPage: cookies.get('logRowsPerPage')*1||5,
      page: 0,
      searchData:null,
    }
  }

  componentDidUpdate(preProps, prevState) {
    const c=this.props.searchCondition;
    if (preProps.searchCondition !== this.props.searchCondition||
      (preProps.data !== this.props.data&&this.props.searchCondition!=null)||
      (preProps.companyData!==this.props.companyData&&this.props.searchCondition!=null))
      {
        const searchData=this.props.data.filter(log=>
          (c.from==null||log.addedDate>=c.from)&&
          (c.to==null||log.addedDate<=c.to)&&
          (c.closed==='All'||log.closed===c.closed)&&
          log.companyName.indexOf(c.companyName)!==-1
          );
        this.setState({
          searchData: searchData,
          page:0
        })
      }
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
    let monthLater=new Date();
    monthLater.setMonth(monthLater.getMonth()+1);
    this.setState({
      rowsPerPage: newRowPerPage
    })
    cookies.set('logRowsPerPage',newRowPerPage,{path:'/', expires:monthLater});
  }

  sortByAddedDate(log1, log2)
  {
      return log1.addedDate>log2.addedDate? -1:log1.addedDate<log2.addedDate? 1:0
  }

  findService(companyName)
  {
    for(let com of this.props.companyData)
    {
      if(com.companyName===companyName)
      return com.service;
    }
  }

  render() {
    const {data}=this.props;
    const {searchData, rowsPerPage, page } = this.state;
    let validData=(searchData==null)? data:searchData;
    validData=[].concat(validData).sort(this.sortByAddedDate);//sort
    let showingRows = (rowsPerPage > 0) ? validData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : validData;
    const columns = [
      {
        dataField: 'addedDate',
        text: '접수일',
      }, {
        dataField: 'companyName',
        text: '고객사명',
      }, {
        dataField: 'service',
        text: '계약상황'
      }, {
        dataField: 'resubmissioned',
        text: '접수'
      }, {
        dataField: 'contactor',
        text: '문의자'
      }, {
        dataField: 'rank',
        text: '직급'
      }, {
        dataField: 'type',
        text: '분류'
      }, {
        dataField: 'subtype',
        text: '구분',
        sort: true
      }, {
        dataField: 'body',
        text: '상세내용',
        editor: {
        }
      }, {
        dataField: 'channel',
        text: '채널'
      }, {
        dataField: 'log',
        text: 'LOG'
      }, {
        dataField: 'closed',
        text: '상태'
      }, {
        dataField: 'receptionist',
        text: '접수자'
      }, {
        dataField: 'check',
        text: 'Check 사항',
      }, {
        dataField: 'processed',
        text: '처리내용',
      }, {
        dataField: 'agentNo',
        text: 'Agent No'
      }, {
        dataField: 'remark',
        text: '비고',
      }, {
        dataField: 'maintenanceTeam',
        text: '유지보수팀'
      }, {
        dataField: 'dutyed',
        text: '수행담당'
      }, {
        dataField: 'agentTeam',
        text: 'Agent팀'
      }, {
        dataField: 'plannedDate',
        text: '조치 예정일'
      }, {
        dataField: 'completedDate',
        text: '조치 완료일'
      }, {
        dataField: 'result',
        text: '처리결과'
      }, {
        dataField: 'MM',
        text: 'M/M'
      }];
    let colNum = 0;
    return (
      <div>



        <Paper>
          <TableContainer style={{maxHeight:800}}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  {columns.map(info => <TableCell className={'headerCell ' + info.dataField} key={colNum++}>{info.text}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {showingRows.map(log => {
                  return (<LogRow
                  onAppendClick={this.props.onAppendClick}
                  key={log._id}
                  logData={log}
                  service={this.findService(log.companyName)}
                  />) })}
              </TableBody>
            </Table>
            {showingRows.length>0?<p></p>:<p>검색 결과가 없습니다.</p>}
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 30, 40]}
            component="div"
            count={validData.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage} />
        </Paper>
      </div>
    )
  }
}

export default withCookies(LogTable);