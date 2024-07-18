
import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, Outlet, useParams } from 'react-router-dom'
import database from './database.js';


/*div는 박스, p는 글, img는 이미지*/

/*입력창에서 날짜를 입력-->그 날짜에 해당하는 상세페이지로 이동--> 서버에는 날짜가 YYYY-MM-DD 형식으로 기록되며, 날짜별로 content 항목들이 있음 
--> 서버에서 그 날짜에 대응되는 content를 띄워줌-->수정 --> 서버에 그 내용이 수정됨*/


function Todolist() {
  
  
  
  let navigate = useNavigate();

  let [tododate, changedate]=useState('');

  let [data, rewrite] = useState(database);

  useEffect(() => {
    if (tododate) {
      navigate(`/detail/${tododate}`);
    }
  }, [tododate, navigate]);

  return ( // return 소괄호 안에는 병렬로 태그 2개 이상 기입 금지
    
    <div className="App"> 
      <div className="black-nav">
        <h4 style={ {color : 'white', fontSize: '16px'} }> 
          <input type="date" value={tododate} onChange={ (event)=> {changedate(event.target.value); navigate(`/detail/${event.target.value}`);}}/> <input type="text" />의 할 일  
        </h4>  
      </div> 
        

    <Routes>
      <Route path="/detail/:date" 
      element={
          <List data={data} rewrite={rewrite} tododate={tododate}> </List>}>
          </Route>
      {/*<Route path="*" element={<div>잘못된 입력</div>}></Route>*/}

    </Routes>


    </div>
    
      
    
    
  )
}



function List(props){
  let newdata='';
  let [modify, modifymode] = useState(false);
  let targetcontent=props.data.find(item => item.date === props.tododate);
  return(
    
      targetcontent.content.map(function(a){return(
      <div className="list"><p>{a}<button onClick={()=> {modifymode(true)}}>수정</button> <button>삭제</button> </p>
      {modify ? <p> <input type="text" value={newdata}></input> <button onClick={()=>{props.rewrite(newdata); modifymode(false);}}>완료</button></p> : null} </div>
      )})
        
  )

}


export default Todolist; 


