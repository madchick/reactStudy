import React, { Component } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';

class DeletePopup extends Component {


  render() {
    const { open } = this.props;
    return (
      <Dialog open={open}
        onClose={this.props.onDeleteCancel}
      >
        <DialogTitle>삭제 알림</DialogTitle>
        <DialogContent>
          <DialogContentText>정말 삭제하시겠습니까?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={this.props.onDeleteCancel}>아니요</Button>
          <Button variant="contained" color="primary" onClick={this.props.onDeleteClick}>예</Button>
        </DialogActions>

      </Dialog>
    );
  }
}

export default DeletePopup;