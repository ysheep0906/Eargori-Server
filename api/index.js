const dotenv = require('dotenv')
const express = require('express');
const app = express();
const port = 4000;
const mongoose = require('mongoose');
const connectDB = require('../config/dbConnect');
// 문장은 내 커스텀으로 저장(장소별 텍스트 대치와 기본 문장)
// 검색할때 문장 유사도 알고리즘 쓰기
// 듣는 것은 일단 대화형식으로 하고 내가 얼마까지 쳤을때 대화 장소를 위에서 설정하여 제일 먼저 뜨는 것을 해당 장소에 맞는 것으로 설정
// 자주 말하는 것은 자동으로 관리?
// 녹음 받을 때 녹음 되는 것이 눈에 보이도록 하기
// 커뮤니티는 내가 사용했던 문장들을 공유할 수 있는 곳(좋아요, 댓글, 공유)
dotenv.config();
connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/users', require('../routes/userRoute'));

app.use('/sentences', require('../routes/sentenceRoute'));

mongoose.connection.once('open', () => {
  app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});

mongoose.connection.on('error', err => {
  console.log(err);
});

module.exports = app;