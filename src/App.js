
import './App.css';
import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, Outlet, useParams } from 'react-router-dom'
import database from './database.js';
import axios from 'axios';


/*div는 박스, p는 글, img는 이미지*/

/*입력창에서 날짜를 입력-->그 날짜에 해당하는 상세페이지로 이동--> 서버에는 날짜가 YYYY-MM-DD 형식으로 기록되며, 날짜별로 content 항목들이 있음 
--> 서버에서 그 날짜에 대응되는 content를 띄워줌-->수정 --> 서버에 그 내용이 수정됨*/


function Todolist() {
  
  
  
  let navigate = useNavigate();

  let [tododate, changedate]=useState(''); //현재 선택한 날짜

  let [data, rewrite] = useState([]); //그 날짜에 해당하는 데이터 (날짜, 할일)
/*
  useEffect(() => {
    if (tododate) {
      navigate(`/detail/${tododate}`);
    }
  }, [tododate, navigate]);
*/
  //let targetIndex = data.findIndex(item => item.date === tododate);
  //let targetcontent=data.find(item => item.date === tododate)

  return ( 
    
    <div className="App"> 
      <div className="black-nav">
        <h4 style={ {color : 'white', fontSize: '16px'} }> 

          <input type="date" value={tododate} //날짜입력창, 그 밑은 날짜 선택시 일어나는 일들
          onChange={ (event)=> {changedate(event.target.value); 
          navigate(`/detail/${event.target.value}`);
          axios.get('').then((returnedData)=>rewrite(returnedData)) // 데이터가 존재하면 서버로부터 데이터받음
          .catch(()=>{
            axios.post('URL', {date : event.target.value, content : ['','','']}); // 데이터가 없으면 이걸 보낸다
          })
          }}/> 
          
          <input type="text" />의 할 일 {/*형식상 만들어놓은 이름칸*/}
          <button // 추가버튼
          onClick = {()=>{let newdata=[...data]; 
          newdata[targetIndex].content=[...newdata[targetIndex].content, '']; 
          rewrite(newdata);
          axios.post('URL', newdata); 
          }}>추가</button>  
        </h4>  
      </div> 
        

    <Routes>
      <Route path="/detail/:date" //date에 해당하는 페이지로 이동
      element={ //하위 함수인 List를 불러와서 띄운다
          <List data={data} rewrite={rewrite} tododate={tododate}> </List>}> 
          </Route>
      {/*<Route path="*" element={<div>잘못된 입력</div>}></Route>*/}
    </Routes>
    </div>    
    
  )
}



function List(props){
  let [modify, setModify] = useState([]); //수정모드면 true
  setModify(new Array(targetcontent.content.length).fill(false));
  let [newData, setNewdata] = useState([...props.data]); 
  const inputRefs = useRef([]);
  return(
      newData.content.map(function(a,i){ return(
      <div className="list"><p>{a} <button 
      //수정버튼
      onClick={()=> { let newModify=[...modify]; newModify[i]=true; setModify(newModify)}}>수정</button> <button 
      //삭제버튼
      onClick= {()=>{ let newerData=[...newData]; 
      newerData[targetIndex].content = newerData[targetIndex].content.filter((_, l) => l !== i); 
      setNewdata(newerData);
      axios.post('URL', newData); 
      }}> 삭제</button> </p>
      {/*수정모드가 켜진 항목에서 일어나는 일*/}
      {modify[i] ? <p> <input type="text" ref={(el) => inputRefs.current[i] = el} ></input> <button 
      //수정 완료 버튼
      onClick={(event)=>{ let newerData=[...newData];
      newerData[targetIndex].content[i] = inputRefs.current[i].value;  
      setNewdata(newerData); let newModify=[...modify]; newModify[i]=false; 
      setModify(newModify);
      axios.post('URL', newData); 
      }}>완료</button></p> : null}</div>
      )})
        
  )

}


export default Todolist; 


