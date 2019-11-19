const express = require('express')


let db
(async function(){
  db = await require('./db')
}())


const app = express.Router()

// 获取桌面信息如餐厅名称，桌面名称
// 将会在landing页面请求并展示
// /desinfo?rid=5&did=8
app.get('/deskinfo', async (req, res, next) => {
  // req.query.rid -> '5'
  // req.query.did -> '8'
  console.log(req.query.did)
  var desk = await db.get(`
  SELECT
    desks.id as did,
    users.id as uid,
    desks.name,
    users.title
  FROM desks JOIN users ON desks.rid = users.id
  WHERE desks.id=?
  `, req.query.did)

  res.json(desk)
})
// 返回某餐厅的菜单
// /menu/restaurant/25

app.get('/menu/restaurant/:rid', async (req, res, next) => {
  var menu = await db.all(`
    SELECT * FROM foods WHERE rid=? AND status = 'on'
  `, req.params.rid)

  res.json(menu)
})

// 用户下单
// {
//   deskName:
//   customCount:1
//   totalPrice:
//   foods: [{id, amount}, {}, {}]
// }
app.post('/restaurant/:rid/desk/:did/order', async (req, res, next) => {
  let rid = req.params.rid
  let did = req.params.did
  let deskName = req.body.deskName
  let totalPrice = req.body.totalPrice
  let customCount = req.body.customCount
  let details = JSON.stringify(req.body.foods)
  let status = 'pending'
  let timestamp = new Date().toISOString()

  await db.run(`
    INSERT INTO orders (rid, did, deskName, totalPrice, customCount, details, status, timestamp) VALUES (?,?,?,?,?,?,?,?)
  `, rid, did, deskName, totalPrice, customCount, details, status, timestamp)

  let order = await db.get('SELECT * FROM orders ORDER BY id DESC LIMIT 1')

  order.details = JSON.parse(order.details)
  res.json(order)
})

// 桌面管理api
app.route('/restaurant/:rid/desk')
  .get(async (req, res, next) => {
    let rid = req.cookies.userid
    console.log(req.cookies)
    let desks = await db.all('SELECT * FROM desks WHERE rid = ?', rid)
    if (desks) {
      res.json(desks)
    } else {
      res.status(401).json({
        code: -1,
        messages: '不存在此桌面或无权限查看'
      })
    }
  })
  .post(async (req, res, next) => {
    // 增加一个桌子
    let rid = req.cookies.userid
    await db.run('INSERT INTO desks (rid, name, capacity) VALUES (?,?,?)', rid, req.body.name, req.body.capacity)

    var desk = await db.get('SELECT * FROM desks ORDER BY id DESC LIMIT 1')

    res.json(desk)

  })

app.route('/restaurant/:rid/desk/:did')
  .delete(async (req, res, next) => {
    var did = req.params.did
    var userid = req.cookies.userid

    var desk = await db.get('SELECT * FROM desks WHERE id = ? AND rid = ?', did, userid)
    console.log(desk)

    if (desk) {
      await db.run('DELETE FROM desks WHERE id = ? AND rid = ?', did, userid)
      delete desk.id
      res.json(desk)
    } else {
      res.status(401).json({
        code: -1,
        msg: '不存在此桌面或您没有权限删除此桌面'
      })
    }
  })
  .put(async (req, res, next) => {
    var did = req.params.did
    var userid = req.cookies.userid

    var desk = await db.get('SELECT * FROM desks WHERE id = ? AND rid = ?', did, userid)

    if (desk) {
      await db.run(
        `
          UPDATE desks SET name = ?, capacity = ? WHERE id = ? AND rid = ?
        `,
        req.body.name, req.body.capacity, did, userid
      )

      var desk = await db.get('SELECT * FROM desks WHERE id = ? AND rid = ?', did, userid)

      res.json(desk)
    } else {
      res.status(401).json({
        code: -1,
        msg: '不存在或无权限修改此桌面'
      })
    }
  })

  // 订单管理
  // orders?page=20&limit=30
app.route('/restaurant/:rid/order')
  .get(async (req, res, next) => {
    var orders = await db.all('SELECT * FROM orders WHERE rid = ?', req.cookies.userid)
    orders.forEach(order => {
      order.details = JSON.parse(order.details)
    })
    res.json(orders)
  })

app.route('/restaurant/:rid/order/:oid')
  .delete(async (req, res, next) => {
    let order =  await db.run('SELECT * FROM orders WHERE rid = ? AND id = ?', req.cookies.userid, req.params.oid)

    if (order) {
      await db.run('DELETE FROM orders WHERE rid = ? AND id = ?', req.cookies.userid, req.params.oid)

      delete order.id
      res.json(order)
    } else {
      res.status(401).json({
        code: -1,
        msg: '没有此订单或无权限进行操作'
      })
    }
  })

// 菜品管理api
app.route('/restaurant/:rid/food')
  .get(async (req, res, next) => {
    // 获取菜品列表
    var foodList = await db.all(`SELECT * FROM foods WHERE rid=?`, req.params.rid)
    console.log(foodList)
    res.json(foodList)
  })
  .post(async (req, res, next) => {
    // 增加菜品
    await db.run(`
      INSERT INTO foods (rid, name, price, status) VALUES (?,?,?,?)
    `, req.cookies.userid, req.body.name, req.body.price, req.body.status)

    var food = await db.get('SELECT * FROM foods ORDER BY id DESC LIMIT 1')

    res.json(food)
  })

// 对单一菜品进行操作
app.route('/restaurant/:rid/food/:fid')
  .delete(async (req, res, next) => {
    var fid = req.params.fid
    var userid = req.cookies.userid


    var food = await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?', fid, userid)
    if (food) {
      await db.run('DELETE FROM foods WHERE id = ? AND rid = ?', fid, userid)
      delete food.id
      res.json(food)
    } else {
      res.status(401).json({
        code: -1,
        message: '不存在菜品或无权限删除'
      })
    }
  })
  .put(async (req, res, next) => {
    var fid = req.params.fid
    var userid = req.cookies.userid

    var food = await db.get('SELECT * FROM foods WHERE id = ? AND rid = ?', fid, userid)
    if (food) {
      await db.run(
        `UPDATE foods SET name = ?, price = ?, status = ? WHERE id = ? AND rid = ?
        `,
        req.body.name, req.body.price, req.body.status, fid, userid
      )
      delete food.id
      res.json(food)
    } else {
      res.status(401).json({
        code: -1,
        message: '不存在菜品或无权限修改'
      })
    }

  })

  module.exports = app
