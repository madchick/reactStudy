import React, { Component } from 'react';
import LogTable from './LogTable'
import Input from './Input'
import SearchBar from './SearchBar';
import DeletePopup from './DeletePopup';
import CompanyTable from './CompanyTable';
import axios from 'axios'
import produce from 'immer'
import {Beforeunload,useBeforeunload} from 'react-beforeunload';

class LogPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inputOpen: false,
      deleteOpen: false,
      companyOpen: false,
      defaultData: {
        _id: "newLog",
        addedDate: new Date(),
        companyName: null,
        resubmissioned: '',
        contactor: '',
        rank: '',
        type: '',
        subtype: '',
        body: "",
        channel: '',
        log: '',
        closed: true,
        receptionist: '',
        check: '',
        processed: '',
        agentNo: '',
        remark: '',
        maintenanceTeam: '',
        dutyed: '',
        agentTeam: '',
        plannedDate: null,
        completedDate: null,
        result: '',
        MM: '',
      },
      logData:[],
      companyData:[],
      selectedData: null,
      searchCondition: null
    }
    this.logDataRetrive = () => {
      axios.get(global.url+"loglist",{withCredentials:true}).then(res => {
        this.setState(produce(this.state, draft => {
          draft.logData = res.data.logs;
        }))
      })
    }

    this.companyDataRetrive = () => {
      axios.get(global.url+"companylist",{withCredentials:true}).then(res => {
        this.setState(produce(this.state, draft => {
          draft.companyData = res.data.companys;
        }))
      })
    }
    this.logDataRetrive();
    this.companyDataRetrive();
  }

  handleInputClose = () => {
    this.releaseLog();
    this.logDataRetrive();
  };

  releaseLog = () => {
    axios.get(global.url + "log/release", { withCredentials: true }).then(
      res => {
        console.log(res);
        this.setState({
          selectedData: null
        });
        this.setInputOpen(false);
      }
    )
  }

  handleAddClick = () => {
    this.setInputOpen(true);
  }

  handleSearchClick = (data) => {
    this.logDataRetrive();
    this.setState({
      searchCondition: data
    })
  }

  handleAppendClick = (data) => {
    axios.post(global.url+"log/grant",{target:data._id},{withCredentials:true}).then
    (res=>
      {
        const {msg}=res.data;
        console.log(res);
        if(msg==="granted")
        {
          this.setState({
            selectedData: data
          });
          this.setInputOpen(true);
        }
        else if(msg==="locked"){
          alert("다른 사용자가 접근중입니다.");
        }else if(msg==="release first"){
          alert("이미 다른 문서를 수정중입니다.");
        }
      }
    )

  }

  handleDeleteClick = () => {
    this.setState({
      deleteOpen: true
    });
  }

  handleDeleteLog = () => {
    axios.post(global.url+"log/delete",
      { target: this.state.selectedData._id },{withCredentials:true}).then(res => {
        this.handleCloseDelete();
      this.handleInputClose();
      })
    
  }

  handleSaveLog = (data) => {
    const { selectedData } = this.state;
    if (selectedData==null) {
      axios.post(global.url+"log/add",
      {
        log: produce(data, draft=>{new Date(draft.addedDate)})
      },{withCredentials:true}).then(res => {
        if (res.data.msg === "ok")
        {
          alert("추가완료!");
        }
        this.handleInputClose();
      })
    }
    else {
      axios.put(global.url+"log/update",
        {
          target: selectedData._id,
          log: produce(data, draft=>{new Date(draft.addedDate)})
        },{withCredentials:true}).then(res => {
          if (res.data.msg === "ok")
          {
            alert("저장완료!");
          }
          this.handleInputClose();
        })
    }

  }
  
  handleCloseDelete = (data) => {
    this.setState({
      deleteOpen: false
    })
  }

  handleCompanyInfoClick = () => {
    this.setState({
      companyOpen: true
    })
  }

  handleCompanyClose = () => {
    this.setState({
      companyOpen: false
    })
  }

  setInputOpen = (e) => {
    this.setState({
      inputOpen: e
    })
  }

  render() {
    const { selectedData, defaultData, searchCondition,logData,companyData,inputOpen,  } = this.state;
    let initData = (selectedData == null) ? defaultData : selectedData;
    return (
      <div>
        <Beforeunload onBeforeunload={this.releaseLog} />
        <SearchBar
          onAddClick={this.handleAddClick}
          onSearchClick={this.handleSearchClick}
          onLogOutClick={this.props.onLogOutClick}
          onCompanyInfoClick={this.handleCompanyInfoClick}
        />
        <LogTable
          onAppendClick={this.handleAppendClick}
          searchCondition={searchCondition}
          data={logData}
          companyData={companyData}
        />

        <Input
          open={inputOpen}
          onClose={this.handleInputClose}
          onSave={this.handleSaveLog}
          onDeleteClick={this.handleDeleteClick}
          initData={initData}
          companyData={companyData}
          new={selectedData==null}
        />

        <CompanyTable
          open={this.state.companyOpen}
          onClose={this.handleCompanyClose}
          companyData={companyData}
          dataRetrive={this.companyDataRetrive}
        />

        <DeletePopup
          open={this.state.deleteOpen}
          onDeleteClick={this.handleDeleteLog}
          onDeleteCancel={this.handleCloseDelete}
        />

      </div>
    );
  }

}

export default LogPage;
