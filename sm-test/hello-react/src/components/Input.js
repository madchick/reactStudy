import React, { useState } from 'react';
import AutoAsync from './AutoAsync'
import { TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import '../design/input.scss';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';


import produce from 'immer'

function getType(target) {
  return Object.prototype.toString.call(target).slice(8, -1);
}

function getFormatDate(date) {
  if (getType(date) === 'Date') {
    var year = date.getFullYear();              //yyyy
    var month = (1 + date.getMonth());          //M
    month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
    var day = date.getDate();                   //d
    day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
    return year + '-' + month + '-' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
  }
  else {
    return ''

  }
}

function getdiffDate(startDate, endDate) {
  startDate = new Date(startDate)
  endDate = new Date(endDate)
  var time = Math.ceil((endDate.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24);
  if (!isNaN(time) && time>=0) {
    return time
  }
  else{
    return 0
  }
}


export default function Input(props) {

  const [data, setData] = React.useState({
    addedDate: props.initData.addedDate == null ? getFormatDate(new Date()) : getFormatDate(new Date(props.initData.addedDate)),
    companyName: props.initData.companyName == null ? "선택중" : props.initData.companyName,
    resubmissioned: props.initData.resubmissioned == null ? "" : props.initData.resubmissioned,
    contactor: props.initData.contactor == null ? '' : props.initData.contactor,
    rank: props.initData.rank == null ? '' : props.initData.rank,
    type: props.initData.type == null ? '' : props.initData.type,
    subtype: props.initData.subtype == null ? '' : props.initData.subtype,
    body: props.initData.body == null ? '' : props.initData.body,
    channel: props.initData.channel == null ? '메일' : props.initData.channel,
    log: props.initData.log == null ? '' : props.initData.log,
    closed: props.initData.closed == null ? false : props.initData.closed,
    receptionist: props.initData.receptionist == null ? '' : props.initData.receptionist,
    check: props.initData.check == null ? '' : props.initData.check,
    processed: props.initData.processed == null ? '' : props.initData.processed,
    agentNo: props.initData.agentNo == null ? '' : props.initData.agentNo,
    remark: props.initData.remark == null ? '' : props.initData.remark,
    maintenanceTeam: props.initData.maintenanceTeam == null ? '' : props.initData.maintenanceTeam,
    dutyed: props.initData.dutyed == null ? '' : props.initData.dutyed,
    agentTeam: props.initData.agentTeam == null ? '' : props.initData.agentTeam,
    plannedDate: props.initData.plannedDate == null ? getFormatDate(new Date()) : getFormatDate(new Date(props.initData.plannedDate)),
    completedDate: props.initData.completedDate == null ? getFormatDate(new Date()) : getFormatDate(new Date(props.initData.completedDate)),
    result: props.initData.result == null ? '' : props.initData.result,
    MM: props.initData.MM == null ? '' : props.initData.MM,
  })

  React.useEffect(() => {
    setData(produce(data, draft => {
      draft.addedDate = props.initData.addedDate == null ? getFormatDate(new Date()) : getFormatDate(new Date(props.initData.addedDate))
      draft.companyName = props.initData.companyName == null ? "선택중" : props.initData.companyName
      draft.resubmissioned = props.initData.resubmissioned == null ? "" : props.initData.resubmissioned
      draft.contactor = props.initData.contactor == null ? '' : props.initData.contactor
      draft.rank = props.initData.rank == null ? '' : props.initData.rank
      draft.type = props.initData.type == null ? '' : props.initData.type
      draft.subtype = props.initData.subtype == null ? '' : props.initData.subtype
      draft.body = props.initData.body == null ? '' : props.initData.body
      draft.channel = props.initData.channel == null ? '메일' : props.initData.channel
      draft.log = props.initData.log == null ? '' : props.initData.log
      draft.closed = props.initData.closed == null ? false : props.initData.closed
      draft.receptionist = props.initData.receptionist == null ? '' : props.initData.receptionist
      draft.check = props.initData.check == null ? '' : props.initData.check
      draft.processed = props.initData.processed == null ? '' : props.initData.processed
      draft.agentNo = props.initData.agentNo == null ? '' : props.initData.agentNo
      draft.remark = props.initData.remark == null ? '' : props.initData.remark
      draft.maintenanceTeam = props.initData.maintenanceTeam == null ? '' : props.initData.maintenanceTeam
      draft.dutyed = props.initData.dutyed == null ? '' : props.initData.dutyed
      draft.agentTeam = props.initData.agentTeam == null ? '' : props.initData.agentTeam
      draft.plannedDate = props.initData.plannedDate == null ? getFormatDate(new Date()) : getFormatDate(new Date(props.initData.plannedDate))
      draft.completedDate = props.initData.completedDate == null ? getFormatDate(new Date()) : getFormatDate(new Date(props.initData.completedDate))
      draft.result = props.initData.result == null ? '' : props.initData.result
      draft.MM = props.initData.MM == null ? '' : props.initData.MM
    }))
  }, [props.initData,props.open])



  React.useEffect(() => {

    setTimeTaking(getdiffDate(data.addedDate, data.completedDate))
  }, [data.completedDate, data.addedDate])

  const [timeTaking, setTimeTaking] = useState(0)

  const handleChange = (e) => {
    setData(produce(data, draft => {
      draft[e.target.name] = e.target.value;
    }))
  }

  const handleDateChange = (e) => {
    setData(produce(data, draft => {
      draft[e.target.name] = e.target.value;
    }))
  }

  const { onClose, open, onSave } = props;

  return (
    <Dialog open={open}
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      disableBackdropClick={true}>
         
      <div style={{flex: '1 0 0'}} >
        <div id='divinput'>
      </div>
        <IconButton style={{
          float: "right",
          display: 'flex',
          textAlign: 'right'
        }} onClick={onClose} aria-label="close" className='close'>
          <CloseIcon/>
        </IconButton>
      </div>

      <div className="input">
        <br />
        <br />
        <TextField
          className="inputs"
          id="date"
          label="접수일"
          type="date"
          name="addedDate"
          variant="outlined"
          value={data.addedDate}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleDateChange}
        />
        <br />
        <br />
          {
        <AutoAsync
        type="회사 이름"
        defaultCompanyName={data.companyName}
        companyData={props.companyData}
        onSelected={(company) => {
          setData(
            produce(data, draft => {
              draft.companyName = company == null ? "선택중" : company.companyName
              //draft.dutyed = company==null ? "선택중" :company.dutyed
              //draft.maintenanceTeam = company==null ? "선택중" :company.maintenanceTeam
              draft.service = company == null ? "선택중" : company.service
            }))
        }} />
      }
        <p>계약상황 : {data.companyName !== "선택중" ? data.service : '선택중'}</p>
        <br />

        <FormControl className="inputs" variant="outlined">
          <InputLabel >접수</InputLabel>
          <Select value={data.resubmissioned}
          name="resubmissioned"
          onChange={handleChange}
          >
            <MenuItem value="신규접수">신규접수</MenuItem>
            <MenuItem value="재접수">재접수</MenuItem>
            <MenuItem value="추가접수">추가접수</MenuItem>
          </Select>
        </FormControl>
        <br />
        <br />

        <TextField
        className="inputs" name="contactor"
        label="문의자" variant="outlined" value={data.contactor}
        onChange={ handleChange } />
        <br />
        <br />
        <TextField
        className="inputs"
        label="직급" variant="outlined"
        name="rank"
          value={data.rank} onChange={handleChange} />
        <br />
        <br />
        <FormControl style={{width:'160px'}} component="fieldset">
          <InputLabel style={{marginLeft:'10px'}} component="legend">분류</InputLabel>
          <Select
            value={data.type}
            autoWidth={true}
            onChange={handleChange}
            name="type"
            variant="outlined"
          >
            <MenuItem value="오류">오류</MenuItem>
            <MenuItem value="개선">개선</MenuItem>
            <MenuItem value="문의">문의</MenuItem>
            <MenuItem value="지원">지원</MenuItem>
            <MenuItem value="점검">점검</MenuItem>

          </Select>
        </FormControl>
        <span className="tab">&#9;&#9;&#9;&#9;</span>
        <FormControl style={{width:'160px'}}component="fieldset">
          <InputLabel style={{marginLeft:'10px'}} component="legend">구분</InputLabel>
          <Select
            value={data.subtype}
            autoWidth={true}
            onChange={handleChange}
            name="subtype"
            variant="outlined"
          >
            <MenuItem value="SW 오류">SW 오류</MenuItem>
            <MenuItem value="data 오류">data 오류</MenuItem>
            <MenuItem value="연동오류">연동오류</MenuItem>
            <MenuItem value="서버장애">서버장애</MenuItem>
            <MenuItem value="기능개선">기능개선</MenuItem>
            <MenuItem value="기능문의">기능문의</MenuItem>
            <MenuItem value="추가개발">추가개발</MenuItem>
            <MenuItem value="매뉴얼">매뉴얼</MenuItem>
            <MenuItem value="로그분석">로그분석</MenuItem>
            <MenuItem value="기술지원">기술지원</MenuItem>
            <MenuItem value="로그삭제">로그삭제</MenuItem>
            <MenuItem value="이미지">이미지</MenuItem>
            <MenuItem value="정기점검">정기점검</MenuItem>
            <MenuItem value="취약점조치">취약점조치</MenuItem>
          </Select>
        </FormControl>
        <br />
        <br />

        <TextField
          className='multiline'
          label="상세내용"
          multiline
          rows={15}
          name="body"
          value={data.body}
          variant="outlined"
          onChange={handleChange}
        />
        <br />
        <br />
        <FormControl style={{width:'100px'}} component="fieldset">
          <InputLabel style={{marginLeft:'10px'}} component="legend">채널</InputLabel>
          <Select value={data.channel} name="channel" onChange={handleChange} variant="outlined">
            <MenuItem value="메일">메일</MenuItem>
            <MenuItem value="전화">전화</MenuItem>
            <MenuItem value="기타">기타</MenuItem>
          </Select>
        </FormControl>
        
        <span className="tab">&#9;&#9;&#9;&#9;</span>
        <FormControl style={{width:'100px'}} component="fieldset">
          <InputLabel  style={{marginLeft:'10px'}} component="legend">LOG</InputLabel>
          <Select value={data.log} name="log" onChange={handleChange} variant="outlined">
            <MenuItem value="수령">수령</MenuItem>
            <MenuItem value="미수령">미수령</MenuItem>
            <MenuItem value="해당없음">해당없음</MenuItem>
          </Select>
        </FormControl>
        <br />

        <br />
        <FormControl component="fieldset">
          <InputLabel component="legend">상태</InputLabel>
          <Select value={data.closed} name="closed" onChange={handleChange} variant="outlined">
            <MenuItem value={false}>Open</MenuItem>
            <MenuItem value={true}>Closed</MenuItem>
          </Select>
        </FormControl>

        <br />
        <br />
        <TextField
          label="체크사항"
          className='multiline'
          multiline
          rows={15}
          name="check"
          variant="outlined"
          value={data.check}
          onChange={handleChange}
        />
        <br />
        <br />
        <br />
        <TextField
          label="처리내용"
          className='multiline'
          multiline
          value={data.processed}
          name="processed"
          rows={15}
          variant="outlined"
          onChange={handleChange}
        />
        <br />
        <br />
        <TextField
        label="에이전트 번호"
        value={data.agentNo}
        name="agentNo"
        variant="outlined" onChange={handleChange}
        />
        <br />

        <br />
        <TextField
          label="비고"
          className='multiline'
          multiline
          rows={15}
          value={data.remark}
          variant="outlined"
          name="remark"
          onChange={handleChange}
        />
        <br />

        <br />
        <TextField
        style={{width:'242px'}}
        label="유지보수팀"
        name="maintenanceTeam"
        value={data.maintenanceTeam} variant="outlined"
        onChange={handleChange} />
        <span className="tab">&#9;&#9;&#9;&#9;</span>
        <TextField
        style={{width:'242px'}}
        label="수행담당"
        name="dutyed"
        value={data.dutyed}
        variant="outlined"
        onChange={handleChange} />

        <br />
        <br />
        <TextField
        style={{width:'242px'}}
        label="에이전트팀"
        name="agentTeam"
        value={data.agentTeam}
        variant="outlined"
        onChange={handleChange} />
        <br />
        <br />
        <TextField
        style={{width:'242px'}}
         
          type="date"
          name="plannedDate"
          value={data.plannedDate}
          variant="outlined"
          label="조치 예정일"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleDateChange}
          />
          <span className="tab">&#9;&#9;&#9;&#9;</span>
          <TextField
          style={{width:'242px'}}
           
            type="date"
            name="completedDate"
            value={data.completedDate}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            label="조치 완료일"
            onChange={handleDateChange}
          />
        <br />
        <br />
        <p>소요기간 : {timeTaking}</p>

        <FormControl style={{width:'242px'}} component="fieldset">
          <InputLabel  style={{marginLeft:'10px'}} component="legend">처리결과</InputLabel>
          <Select
            name="result"
            value={data.result}
            onChange={handleChange}
            variant="outlined">
            <MenuItem value={'유지보수'}>유지보수</MenuItem>
            <MenuItem value="추가개발">추가개발</MenuItem>
            <MenuItem value=" ">해당없음</MenuItem>
          </Select>
        </FormControl>
        <span className="tab">&#9;&#9;&#9;&#9;</span>
        <TextField
        style={{width:'242px'}}
        label="M/M"
        value={data.MM}
        name="MM"
        variant="outlined"
        onChange={handleChange} />
        <br />
        <br />

        <Button variant="contained" onClick={() => { onSave(data) }}>{props.new?"추가":"저장"}</Button>
        {
          !props.new&&
          <Button variant="contained" onClick={() => { props.onDeleteClick(data) }}>삭제</Button>
        }
        </div>
    </Dialog>
  )

}