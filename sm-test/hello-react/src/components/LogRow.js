import React, { Component } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';


class LogRow extends Component{

    dateToPretty(date)
    {
        if(date==null) return null;
        return date.substring(0,10);
    }

    cutStr(str) {
        if (str==null)
            return str;
        const cutLen = 250;
        return str.length < cutLen ? str : str.substring(0, cutLen) + "...";
    }

    render(){
        const {logData, service}=this.props;
        return(
            <TableRow hover role="checkbox" tabIndex={-1}>
                <TableCell><Button variant="contained" onClick={()=>{this.props.onAppendClick(logData)}}>수정</Button></TableCell>
                <TableCell>{this.dateToPretty(logData.addedDate)}</TableCell>
                <TableCell>{logData.companyName}</TableCell>
                <TableCell>{service}</TableCell>
                <TableCell>{logData.resubmissioned}</TableCell>
                <TableCell>{logData.contactor}</TableCell>
                <TableCell>{logData.rank}</TableCell>
                <TableCell>{logData.type}</TableCell>
                <TableCell>{logData.subtype}</TableCell>
                <TableCell>{this.cutStr(logData.body)}</TableCell>
                <TableCell>{logData.channel}</TableCell>
                <TableCell>{logData.log}</TableCell>
                <TableCell>{logData.closed? "Close":"Open"}</TableCell>
                <TableCell>{logData.receptionist}</TableCell>
                <TableCell>{this.cutStr(logData.check)}</TableCell>
                <TableCell>{this.cutStr(logData.processed)}</TableCell>
                <TableCell>{logData.agentNo}</TableCell>
                <TableCell>{this.cutStr(logData.remark)}</TableCell>
                <TableCell>{logData.maintenanceTeam}</TableCell>
                <TableCell>{logData.dutyed}</TableCell>
                <TableCell>{logData.agentTeam}</TableCell>
                <TableCell>{this.dateToPretty(logData.plannedDate)}</TableCell>
                <TableCell>{this.dateToPretty(logData.plannedDate)}</TableCell>
                <TableCell>{logData.result}</TableCell>
                <TableCell>{logData.MM}</TableCell>
            </TableRow>
        )// return
    }//render
}//Componet

export default LogRow