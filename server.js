const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs') 
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const methodeOverride = require('method-override');
app.use(methodeOverride('_method'));
app.set('views', path.join(__dirname, 'views'))


const { MongoClient, ObjectId } = require('mongodb');

let db;
const url = 'mongodb+srv://csoob407:fjdiw2ucoding07@forest00.hh345l9.mongodb.net/?retryWrites=true&w=majority&appName=Forest00';
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('gdsctodo');
  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
  })
}).catch((err)=>{
  console.log(err)
})


// 이게 날짜 선택 전 기본 창
app.get('/', (요청, 응답) => {
  응답.send('반갑다')
}) 


////////////////////////////////////////////////////////////////


// 이게 날짜 선택하면 해당 날짜의 todo 보여주는 API
app.get('/detail/:date',async(요청, 응답)=>{
  
  try{
    let result = await db.collection('post').findOne({date : (요청.params.date)})
    console.log(요청.params)
    응답.render('detail.ejs', {result: result})
  }catch(e){
    console.log(e)
    응답.status(404).send('이상한 url 입력')
  }
})


///////////////////////////////////////////////


// 추가 (글 작성 기능)
app.get('/write',(요청,응답)=>{
  응답.render('write.ejs')
})

app.post('/newpost', async(요청,응답)=>{
  console.log(요청.body.todo);

  try{
    if(요청.body.todo=='' || 요청.body.date==''){
      응답.send("error");
    }
    else{
      await db.collection("post").insertOne(
        {date: 요청.body.date, todo: 요청.body.todo},
        function (에러, 결과) {
          console.log("저장 완료");
        }
      );
      응답.redirect('/write')
    }
  } catch(e){
    console.log(e)
    응답.status(500).send('서버 에러')
  }
})


///////////////////////////////////////////////////////////////


// 삭제
app.delete('/delete', async (요청, 응답) => {
  console.log('삭제')
  console.log(요청.query)
  let result = await db.collection('post').deleteOne( { date : (요청.query.docdate) } )
  응답.send('삭제완료')
})

// app.delete('/delete', async(요청, 응답)=>{
//   console.log('안녕')
//   console.log(요청.query)
// })


////////////////////////////////////////////////////////////////////////


// 수정 (고쳐야됨)
app.get('/edit/:date', async (요청, 응답) => {
  let result = await db.collection('post').findOne({ date : (요청.params.date) },
  function(err,result){
    console.log(result)
    응답.render('editer.ejs', {result : result})
  })
})

app.put('/edit', async(요청,응답) => {
  console.log('수정')
  await db.collection('post').updateOne({date: new ObjectId(요청.body.date)},
    {$set : {date : 요청.body.date, todo : 요청.body.todo}}, function(){
      console.log(요청.query)
      응답.redirect('/list')
    })
})


// 수정 
// app.get('/edit/:id', async (요청, 응답) => {
//   let result = await db.collection('post').findOne({ _id : new ObjectId(요청.params.id) })
//   console.log(result)
//   응답.render('edit.ejs', {result : result})
// })

// app.post('/edit',async(요청,응답)=>{
//   await db.collection('post').updateOne({_id: new ObjectId(요청.body.id)},
//     {$set : {date : 요청.body.date, todo : 요청.body.todo}})
//   응답.redirect('/list')
// })
