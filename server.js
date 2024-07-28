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
var cors = require('cors');
app.use(cors())

const { MongoClient, ObjectId, TopologyDescription } = require('mongodb');

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
  응답.render('home.ejs')

}) 


////////////////////////////////////////////////////////////////


// 이게 날짜 선택하면 해당 날짜의 todo 보여주는 API
app.get('/detail/:date',async(요청, 응답)=>{
  
  try{
    let result = await db.collection('post').findOne({date : (요청.params.date)})
    
    try{
      console.log('1번', result.date)
      console.log('2번', result)

      console.log(요청.params)
      응답.render('detail.ejs', {result: result})
    }
    catch(e){
      console.log('error임')
      if (!(요청.params.date in db.collection('post').findOne({_id : 요청.params.id}))){
        console.log('들어오긴 함')
        try{
          console.log('들어왔음')
          let result = await db.collection('post').updateOne( { _id : new ObjectId(요청.params.id) }, {$set:{date: 요청.params.date, content: ["a","b"]}}, {upsert:true} )
          console.log(result.date)
          console.log(result.content)
          console.log('추가완료')
        }
        catch(e){
          console.log(error)
          응답.send(error)
        }
        
      }
    }

  }catch(e){
    console.log(e)
    응답.status(404).send('no')
  }
})


// 날짜에 해당하는 todo 없을 경우, 해당 날짜에 todo 생성
app.get('/add', async(요청,응답) =>{
  console.log('추가')
  console.log(요청.query)

  try{
    let result = await db.collection('get').updateOne( { _id : new ObjectId (요청.query.id) }, {$: {content: decodeURIComponent(요청.query.doccontent)}} )
    console.log('추가완료')
  }
  catch(e){
    console.log(error)
    응답.send(error)
  }
})



///////////////////////////////////////////////


// 추가 (글 작성 기능)
// app.get('/write',(요청,응답)=>{
//   응답.render('write.ejs')
// })



// app.post('/newpost', async(요청,응답)=>{
//   console.log(요청.body.todo);

//   try{
//     if(요청.body.todo=='' || 요청.body.date==''){
//       응답.send("error");
//     }
//     else{
//       await db.collection("post").insertOne(
//         {date: 요청.body.date, todo: 요청.body.todo},
//         function (에러, 결과) {
//           console.log("저장 완료");
//         }
//       );
//       응답.redirect('/write')
//     }
//   } catch(e){
//     console.log(e)
//     응답.status(500).send('서버 에러')
//   }
// })

app.get('/add', async(요청,응답) =>{
  console.log('추가')
  console.log(요청.query)

  try{
    let result = await db.collection('get').updateOne( { _id : new ObjectId (요청.query.id) }, {$pull: {content: decodeURIComponent(요청.query.doccontent)}} )
    console.log('추가완료')
  }
  catch(e){
    console.log(error)
    응답.send(error)
  }
})


///////////////////////////////////////////////////////////////


// 삭제
app.delete('/delete', async (요청, 응답) => { 
  console.log('삭제')
  console.log(요청.query)

  try{
    let result = await db.collection('post').updateOne( { _id : new ObjectId (요청.query.id) }, {$pull: {content: decodeURIComponent(요청.query.doccontent)}} )
    응답.send('삭제완료')
  }
  catch(e){
    console.log('error입니다')
    응답.send('error입니다')
  }
})

// app.delete('/delete', async(요청, 응답)=>{
//   console.log('안녕')
//   console.log(요청.query)
// })


////////////////////////////////////////////////////////////////////////


// 수정 (고쳐야됨)
app.patch('/edit', async (요청, 응답) => {
  console.log('수정')
  console.log(요청.body)

  try{
    let result = await db.collection('post').findOne( { _id : new ObjectId (요청.body.id) } )
    
    result.content[parseInt(요청.body.index, 10)] = decodeURIComponent(요청.body.content)
    
    await db.collection('post').updateOne({ _id: new ObjectId(요청.body.id)}, {$set: {content:result.content}}
    )
    응답.send('수정 완료')
    console.log('수정완료')
  }
  catch(e){
    console.log('error입니다')
    응답.send('error입니다')
  }
})

// app.patch('/edit', asyn(요청,응답) =>{
  
// })

// app.put('/edit', async(요청,응답) => {
//   console.log('수정')
//   await db.collection('post').updateOne({date: new ObjectId(요청.body.date)},
//     {$set : {date : 요청.body.date, todo : 요청.body.todo}}, function(){
//       console.log(요청.query)
//       응답.redirect('/list')
//     })
// })


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



// 추가 (새 항목 추가) 지윤 
app.post('/add', async (요청, 응답) => {
  console.log('추가');
  console.log(요청.body);

  if (요청.body.newcontent.trim() == '') {
    return 응답.status(400).json({ message: '내용을 입력해봐라.' }); // 이코드 잘 안됨. 사실 detail.ejs에서 한번 걸러주긴 하는데 찜찜하다. 
  }  

  try {  
    let result = await db.collection('post').updateOne(
      { _id: new ObjectId(요청.body.id) },
      { $push: { content: 요청.body.newcontent } }
    );
    응답.json({ message: '추가 완료' });
  } catch (e) {
    console.log('error입니다');
    응답.status(500).send('error입니다');
  }
});