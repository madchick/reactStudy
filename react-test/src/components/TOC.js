import React from 'react';

function TOC(props) {
  console.log('TOC render');
  var lists = [];
  var data = props.data;
  var i = 0;
  while(i<data.length) {
    lists.push(
      <li key={data[i].id}>
        <a 
          href={"/contents/"+data[i].id}
          data-id={data[i].id}
          onClick={function(id, num, e){
            e.preventDefault();
            // props.onChangePage(e.target.dataset.id); - 이것도 동작함
            props.onChangePage(id);
          }.bind(this, data[i].id, 10)}
        >{data[i].title}</a>
      </li>
    );
    i = i + 1;
  }
  return (
    <nav>
      <ul>
        {lists}
      </ul>
    </nav>    
  )
}

export default TOC;



  