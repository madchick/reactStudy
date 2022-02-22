import { render } from '@testing-library/react';
import React, { useRef, useState } from 'react';
import './App.css';
import ImageBox from './components/ImageBox';

function App() {
  const inpRef = useRef<HTMLInputElement>(null)

  const [ImageList, setImageList] = useState<string[]>([])
  console.log(ImageList)

  return (
    <div>
      <div className='container'>
        <div className={'gallery-box ' + (ImageList.length>0 && 'row')}>
          {
            ImageList.length === 0 &&
            <div className='text-center'>
              이미지가 없습니다.<br/>
              이미지츨 추가해주세요.
            </div>
          }
          <input type="file" ref={(inpRef)}
            onChange={(event)=>{
              if(event.currentTarget.files?.[0]) {
                const file = event.currentTarget.files[0];
                console.log(file.name);

                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = (event) => {
                  setImageList(prev => [...prev, event.target?.result as string]);
                  console.log(ImageList);
                }
              }
            }}/>
          {
            ImageList.map((el,idx) => <ImageBox key={el+idx} src={el} />)
          }            
          <div className='plus-box'
            onClick={()=>{inpRef.current?.click()}}>
            +
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;