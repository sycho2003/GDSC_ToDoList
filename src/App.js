import './App.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Todolist() {
  // 로컬스토리지에서 데이터를 불러오거나 기본 데이터를 사용
  let initialData = JSON.parse(localStorage.getItem('todolist')) || [
    {
      date: '2024-07-01',
      content: ['', '', ''],
    },
    {
      date: '2024-07-02',
      content: ['', '', ''],
    },
    {
      date: '2024-07-03',
      content: ['', '', ''],
    }
  ];
  let [data, rewrite] = useState(initialData);

  let navigate = useNavigate();
  let [tododate, changedate] = useState('');
  let [modify, setModify] = useState([]);
  const inputRefs = useRef([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('todolist'));
    if (storedData) {
      rewrite(storedData);
    }
  }, []);

  useEffect(() => {
    if (tododate) {
      navigate(`/detail/${tododate}`);
      let targetIndex = data.findIndex(item => item.date === tododate);
      if (targetIndex === -1) {
        let newData = [...data, { date: tododate, content: ['', '', ''] }];
        rewrite(newData);
      }
    }
  }, [tododate, data, navigate]);

  useEffect(() => {
    if (data) {
      console.log('Saving to localStorage:', data);
      localStorage.setItem('todolist', JSON.stringify(data));
    }
  }, [data]);

  let targetIndex = data.findIndex(item => item.date === tododate);
  let targetcontent = data.find(item => item.date === tododate);

  useEffect(() => {
    if (targetcontent && targetcontent.content) {
      setModify(new Array(targetcontent.content.length).fill(false));
    }
  }, [targetcontent]);

  return (
    <div className="App">
      <div className="black-nav">
        <h4 style={{ color: 'white', fontSize: '16px' }}>
          <input type="date" value={tododate} onChange={(event) => { changedate(event.target.value); }} /> <input type="text" />의 할 일
          {tododate && <button onClick={() => { let newdata = [...data]; newdata[targetIndex].content = [...newdata[targetIndex].content, '']; rewrite(newdata); }}>추가</button>}
        </h4>
      </div>
      {tododate && targetcontent && targetcontent.content ? (
        <div>
          {data[targetIndex].content.map(function (a, i) {
            return (
              <div className="list" key={i}>
                <p>{a}
                  <button onClick={() => {
                    let newModify = [...modify];
                    newModify[i] = true;
                    setModify(newModify);
                  }}>수정</button>
                  <button onClick={() => {
                    let newData = [...data];
                    newData[targetIndex].content = newData[targetIndex].content.filter((_, l) => l !== i);
                    rewrite(newData);
                  }}>삭제</button>
                </p>
                {modify[i] ? (
                  <p>
                    <input type="text" ref={(el) => inputRefs.current[i] = el}></input>
                    <button onClick={() => {
                      let newData = [...data];
                      newData[targetIndex].content[i] = inputRefs.current[i].value;
                      rewrite(newData);
                      let newModify = [...modify];
                      newModify[i] = false;
                      setModify(newModify);
                    }}>완료</button>
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div>날짜를 선택해주세요.</div>
      )}
    </div>
  );
}

export default Todolist;
