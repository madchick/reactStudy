import React, { useState, useEffect } from 'react';
import './App.css';

// import youtubedl from 'youtube-dl';
import fs from 'fs';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();

  const load = async() => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])

  const convertToGif = async() => {
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    await ffmpeg.run('-i','test.mp4','-t','2.5','-ss','2.0','-f','gif','out.gif');
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
          <input type="text" name="url" placeholder="type youtube url"/>
          <button type="button" onclick="">다운로드</button>
      <br/><br/>
      { video && <video
                    controls
                    width="250"
                    src={URL.createObjectURL(video)}>
                  </video>}
      <br/><br/>
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

      <h3>Result</h3>

      <button onClick={convertToGif}>Convert</button>
      <br/><br/>
      { gif && <img alt="" src={gif} width="250"/> }
    
    </div>
  ) : 
  (<p>Loading...</p>);
}

export default App;



