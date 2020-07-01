import React, { Component } from 'react';
import Subject from "./components/Subject"
import TOC from "./components/TOC"
import Content from "./components/Content"
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode:'read',
      whelcome:{title:'Welcome', desc:'Hello, React!!!'},
      subject:{title:'WEB', sub:'world wide web'},
      contents:[
        {id:1, title:'HTML', desc:'HTML is for information'},
        {id:2, title:'CSS', desc:'CSS is for design'},
        {id:3, title:'JavaScript', desc:'JavaScript is for interactive'}
      ]
    }
  }
  render() {
    console.log('App render');
    var _title, _desc = null;
    if(this.state.mode === 'welcome') {
      _title = this.state.whelcome.title;
      _desc = this.state.whelcome.desc; 
    } else if(this.state.mode === 'read') {
      _title = this.state.contents[0].title;
      _desc = this.state.contents[0].desc; 
    }
    return (
      <div className="App">
{/*
        <header>
          <h1><a href="/" onClick={function(e){
            e.preventDefault();
            this.setState({mode:'welcome'});
          }.bind(this)}>{this.state.subject.title}</a></h1>
          {this.state.subject.sub}
        </header>
*/}
        <Subject 
          title={this.state.subject.title} 
          sub={this.state.subject.sub}
          onChangePage={function(){
            this.setState({mode:'welcome'});
          }.bind(this)}
        ></Subject>        
        <TOC data={this.state.contents}></TOC>
        <Content title={_title} desc={_desc}></Content>
      </div>
    );
  }
}

export default App;



