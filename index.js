const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express()
const mysql = require('mysql');

const db = mysql.createPool({
  host: '163.172.130.142',
  port: 3310,
  user: 'etudiant',
  password: 'CrERP29qwMNvcbnAMgLzW9CwuTC5eJHn',
  database: 'sakila'
})

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.get('/'), (req, res) => {
  res.send('hello');
}

app.get("/api/getMovies/", (req, res) => {
  
  const orderByType = req.query.orderByType[0];
  const orderBy = req.query.orderBy[0];
  const page = req.query.page[0];
  const limit = req.query.limit[0];
  console.log(page);

  const sql = `SELECT title, rental_rate, rating, category.name AS category, COUNT(rental.rental_id) AS rental_number FROM film 
  LEFT JOIN film_category ON film_category.film_id = film.film_id 
  LEFT JOIN category ON category.category_id = film_category.category_id
  LEFT JOIN inventory ON inventory.film_id = film.film_id
  LEFT JOIN rental ON rental.inventory_id = inventory.inventory_id
  GROUP BY film.film_id
  ORDER BY ${orderByType} ${orderBy}
  LIMIT ${(page - 1) * limit}, ${limit}
  `
  db.query(sql, (err, result) => {
    res.send(result);
  })
})

app.listen(process.env.PORT || 3001, () => {
  console.log("running on port 3001");
})