const express = require('express')
const app = express.Router()

let db
(async () => {
  db = await require('./db')
})()

//创建投票
app.post('/vote', async (req, res, next) => {
  var voteInfo = req.body
  var userid = req.signedCookies.userid
  console.log(userid)

  if (!userid) {
    res.status(401).json({
      code: -1,
      msg: '未登录用户无法创建投票'
    })
    return
  }

  // console.log(req.body)
  // console.log(req.signedCookies.userid)

  await db.run('INSERT INTO votes (title, desc, userid, singleSelection, deadline, anonymouse) VALUES (?,?,?,?,?,?)', voteInfo.title, voteInfo.desc, userid, voteInfo.singleSelection, new Date(voteInfo.deadline).getTime(), voteInfo.anonymous)

  var vote = await db.get('SELECT * FROM votes ORDER BY id DESC LIMIT 1')

  await Promise.all(voteInfo.options.map(option => {
    return db.run('INSERT INTO options (content, voteid) VALUES (?,?)', option, vote.id)
  }))

  if (req.is('json')) {
    res.json(vote)
  } else {
    res.redirect('/vote/', + vote.id)
  }
})

//用户投票
app.post('/voteup', async (req, res, next) => {
  var userid = req.signedCookies.userid
  var body = req.body
  var voteid = body.voteid

  if (!userid) {
    res.status(401).json({
      code: -1,
      msg: '未登录用户不能参与投票'
    })
    return
  }

  var voteInfo = await db.get('SELECT * FROM votes WHERE id=?', voteid)

  if (Date.now() > voteInfo.deadline) {
    res.status(403).json({
      code: -2,
      msg: '当前投票已截止'
    })
    return
  }

  var voteupInfo = await db.get('SELECT * FROM voteups WHERE userid=? AND voteid=?', userid, body.voteid)

  if(voteupInfo) {//已经投过
    await db.run('UPDATE voteups SET optionid=? WHERE userid=? AND voteid=?', body.optionid, userid, body.voteid)
  } else {
    await db.run('INSERT INTO voteups (userid, optionid, voteid) VALUES (?,?,?)', req.signedCookies.userid, req.body.optionid, req.body.voteid)
  }

  console.log('send info to client')

  ioServer.in(`/vote/${voteid}`).emit('new vote', {
    userid,
    voteid,
    optionid: body.optionid
  })

  var voteups = await db.all('SELECT * FROM voteups WHERE voteid=?', req.body.voteid)

  res.json(voteups)
})

//获取某个投票的基本信息
app.get('/vote/:id', async (req, res, next) => {
  var info = await db.get('SELECT votes.anonymouse,votes.deadline,votes.desc,votes.id,votes.singleSelection,votes.title,votes.userid,users.name,users.avatar FROM votes INNER JOIN users ON votes.userid=users.id WHERE votes.id=?', req.params.id)
  var userid = req.signedCookies.userid
  var userInfo = await db.get('SELECT name,avatar FROM users WHERE id=?', userid)
  var options = await db.all('SELECT * FROM options WHERE voteid=?', req.params.id)
  var voteups = await db.all('SELECT * FROM voteups JOIN users ON voteups.userid=users.id WHERE voteid=?', req.params.id)

  res.json({
    userInfo,
    info,
    options,
    voteups
  })
})

//获取用户创建的投票
app.get('/created-votes', async (req, res, next) => {
  var userid = req.signedCookies.userid
  var votes = await db.all(`SELECT votes.id,votes.title,votes.desc,coalesce(COUNT(voteups.id),0) AS nums FROM votes LEFT JOIN voteups ON votes.id = voteups.voteid WHERE votes.userid=?
  GROUP BY votes.id`, userid)
  res.json(votes)
 
})

module.exports = app