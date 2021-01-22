import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const [startSec, setStartSec] = useState('0');
  const [endSec, setEndSec] = useState('0');

  const load = async() => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])

  const convertToGif = async() => {
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    var duration = Number(endSec)-Number(startSec);
    await ffmpeg.run('-i','test.mp4','-t',String(duration),'-ss',startSec,'-f','gif','out.gif');
    const data = ffmpeg.FS('readFile','out.gif');
    const url = URL.createObjectURL(new Blob([data.buffer], {type: 'image/gif'}));
    setGif(url);
  }
/*
  function youtubedownload() {
    const video = youtubedl('http://www.youtube.com/watch?v=90AiXO1pAiA',
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname });

    // Will be called when the download starts.
    video.on('info', function(info) {
    console.log('Download started')
    console.log('filename: ' + info._filename)
    console.log('size: ' + info.size)
    });

    video.pipe(fs.createWriteStream('myvideo.mp4'));
  }
*/
  return ready ? (
    <div className="App">
      <br/><br/>
      버튼을 클릭하여, PC에 저장된 동영상을 선택해주세요<br/><br/>
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
      <br/><br/>
      { video && <video
                    controls
                    width="400"
                    src={URL.createObjectURL(video)}>
                  </video>}

      <br/><br/>
      시작 : <input type="text" onChange={event => setStartSec(event.target.value)}/>초
      <br/><br/>
      종료 : <input type="text" onChange={event => setEndSec(event.target.value)}/>초
      <br/><br/><br/><br/>

      <button onClick={convertToGif}>GIF 파일 만들기</button>
      <br/><br/>
      { gif && <div>마우스 우측버튼으로 저장 가능합니다<br/><br/><img alt="" src={gif} width="400"/></div> }
      <br/><br/><br/>
    </div>
  ) : 
  (<div><br/><br/><center><p>Loading...</p><br/><br/>폰에서는 실행되지 않습니다<br/><br/>PC용 크롬에 엣지 브라우저에서 실행 가능합니다</center><br/><br/></div>);
}

export default App;



