
import './App.css';
import { useState, useEffect, useRef } from 'react';
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
  let [modify, setModify] = useState([]);
  let [newData, setNewdata] = useState([...props.data]);
  const inputRefs = useRef([]);
  let targetIndex = props.data.findIndex(item => item.date === props.tododate);
  let targetcontent=props.data.find(item => item.date === props.tododate)
  useEffect(() => {
    if (targetcontent && targetcontent.content) {
      setModify(new Array(targetcontent.content.length).fill(false));
    }
  }, [targetcontent]); 
  
  if (!targetcontent || !targetcontent.content) {
    return <div>선택한 날짜에 해당하는 데이터가 없습니다.</div>;
  }

  return(
    
      //아직 서버에 있는걸 직접 바꿀 수는 없어서 사본을 만들어 띄우는 방식... data도 사본, newData도 사본 
      //근데 생각해보니 부모에서 data를 받아오는게 아니라 자식(여기)서 data받아오면 되는거잖아?왜 이생각을못햇나


      newData[targetIndex].content.map(function(a,i){return(
      <div className="list"><p>{a}<button onClick={()=> { let newModify=[...modify]; newModify[i]=true; setModify(newModify)}}>수정</button> <button 
      onClick= {()=>{ let newerData=[...newData]; newerData[targetIndex].content = newerData[targetIndex].content.filter((_, l) => l !== i); setNewdata(newerData);}}> 삭제</button> </p>
      {modify[i] ? <p> <input type="text" ref={(el) => inputRefs.current[i] = el} ></input> <button onClick={(event)=>{ let newerData=[...newData];
      newerData[targetIndex].content[i] = inputRefs.current[i].value;  setNewdata(newerData); let newModify=[...modify]; newModify[i]=false; setModify(newModify)}}>완료</button></p> : null} </div>
      )})
        
  )

}


export default Todolist; 


