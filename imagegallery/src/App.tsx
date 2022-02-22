import React from 'react';
import './App.css';
import ImageBox from './components/ImageBox';

function App() {
  return (
    <div>
      <div className='container'>
        <div className='initial-box'>
          <div className='text-center'>
            이미지가 없습니다.<br/>
            이미지츨 추가해주세요.
          </div>
          <div className='plus-box'>
            +
          </div>
        </div>
        <ImageBox src="kkk"/>
      </div>
    </div>
  );
}

export default App;