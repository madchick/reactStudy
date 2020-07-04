import React from 'react';

function Content(props) {
  console.log('Contents render');
  return (
    <article>
      <h2>{props.title}</h2>
      {props.desc}
    </article>    
  )
}

export default Content;



  