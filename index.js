const mysql = require('mysql');
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors')

app.use(cors());
app.options('*', cors());

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        database: 'test'
    });

mysqlConnection.connect((err) =>{
        if (!err)
            console.log('DB Connection Successful');
        else
            console.log('DB Connection Failed :' + JSON.stringify(err,undefined,2));

});

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'kumaraadarsh790@gmail.com',
		pass: 'Aadarshk'
	}
});

app.listen(3000,()=> console.log('Express Server is running at port no : 30000'));
app.get('/user',(req,res)=> {
    mysqlConnection.query('SELECT * from user',(err,rows,fields)=> {
        if (!err)
            //console.log(rows);
            res.send(rows);
        else    
            console.log(err);
    })
});
app.get('/user/:id',(req,res)=> {
    mysqlConnection.query('SELECT * from user where user_id = ?',[req.params.id],(err,rows,fields)=> {
        if (!err)
            //console.log(rows);
            res.send(rows);
        else    
            console.log(err);
    })
});
app.get('/men/service/:gender',(req,res)=> {
    mysqlConnection.query('select * from goal_saloon_men_services where gender = ?',[req.params.gender],(err,rows,fields)=> {
        if (!err)
            //console.log(rows);
            res.send(rows);
        else    
            console.log(err);
    })
});
app.get('/customers/:id',(req,res)=> {
    mysqlConnection.query('select * from goal_customer_info where customer_id REGEXP ?',[req.params.id],(err,rows,fields)=> {
        if (!err)
            //console.log(rows);
            res.send(rows);
        else    
            console.log(err);
    })
});

app.get('/colors/:id',(req,res)=> {
    mysqlConnection.query('select * from goal_meeting_colors where color_id = ?',[req.params.id],(err,rows,fields)=> {
        if (!err)
            //console.log(rows);
            res.send(rows);
        else    
            console.log(err);
    })
});

app.get('/customers',(req,res)=> {
    mysqlConnection.query('select * from goal_customer_info',[req.params.gender],(err,rows,fields)=> {
        if (!err)
            //console.log(rows);
            res.send(rows);
        else    
            console.log(err);
    })
});

app.post('/customer-registration', (req, res)=>{
	
		mysqlConnection.query("INSERT INTO goal_customer_info(customer_id,image,name,email,phone,date_of_birth,gender,wedding_date,child_birth_date) VALUES(?,?,?,?,?,?,?,?,?)", [req.body.customer_id,req.body.image,req.body.name,req.body.email,req.body.phone,req.body.date_of_birth,req.body.gender,req.body.wedding_date,req.body.child_birth_date], function(err, result){
        if(err) throw err;
            console.log("1 record inserted");
        });
});

app.get('/show_bookings', (req, res)=>{
		mysqlConnection.query('SELECT * FROM goal_salon_bookings where status = "booked"',[req.params.gender],(err,rows,fields)=> {
        if (!err)
            //console.log(rows);
            res.send(rows);
        else    
            console.log(err);
    })
});

app.put('/reschedule_booking', (req, res)=>{
		
		console.log(req.body);
		mysqlConnection.query('UPDATE goal_salon_bookings set start_date = ?,end_date =?,service_ids=?,total_cost=? where booking_id = ?',[req.body.start_date,req.body.end_date,req.body.service_ids,req.body.total_cost,req.body.booking_id],function(err, result){
        if(err) console.log(err);
		else {console.log("1 record updated");
		res.send(result);}
        })
});

app.put('/cancel_booking', (req, res)=>{
		
		console.log(req.body);
		mysqlConnection.query('UPDATE goal_salon_bookings set status = "cancelled" where booking_id = ?',[req.body.booking_id],function(err, result){
        if(err) console.log(err);
		else {console.log("1 record updated");
		res.send(result);}
        })
});

app.get('/inventory-product',(req,res)=> {
    mysqlConnection.query('select * from inventory_product',[req.params.gender],(err,rows,fields)=> {
        if (!err)
            //console.log(rows);
            res.send(rows);
        else    
            console.log(err);
    })
});

app.get('/inventory-product-name/:pname',(req,res)=> {
	console.log(req.params.pname);
    mysqlConnection.query('select pname,available_qty from inventory_product where pname = ?',[req.params.pname],(err,rows,fields)=> {
        if (!err)
            res.send(rows);
        else    
            console.log(err);
    })
});


app.post('/add-inventory-product', (req, res)=>{
		mysqlConnection.query("INSERT INTO inventory_product(pid,pname,category,quantity,weight,available_qty,price,dop,image) VALUES(?,?,?,?,?,?,?,?,?)", [req.body.pid,req.body.pname,req.body.category,req.body.quantity,req.body.weight,req.body.available_qty,req.body.price,req.body.dop,req.body.image], function(err, result){
        if(err) throw err;
            console.log("1 record inserted");
        });
});

app.put('/update-inventory-product', (req, res)=>{
	
		mysqlConnection.query("UPDATE inventory_product SET available_qty = ? WHERE pname = ?", [req.body.available_qty, req.body.pname], function(err, result){
        if(err) throw err;
            console.log("1 record updated");
        });
});

app.put('/update-customer-info', (req, res)=>{
	
		mysqlConnection.query("UPDATE goal_customer_info SET name =?,email =?,phone =?,date_of_birth =?,gender =?,wedding_date =?,child_birth_date= ? WHERE customer_id = ?", [req.body.name, req.body.email, req.body.phone, req.body.date_of_birth, req.body.gender, req.body.wedding_date, req.body.child_birth_date, req.body.customer_id], function(err, result){
        if(err) throw err;
            console.log("1 record updated");
        });
});

app.post('/confirm_booking', (req, res)=>{
		mysqlConnection.query("INSERT INTO goal_salon_bookings(booking_id,event_name,start_date,end_date,primary_color,sec_color,customer_id,service_ids,event_id,total_cost,expec_duration,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)", [req.body.booking_id,req.body.event_name,req.body.start_date,req.body.end_date,req.body.primary_color,req.body.sec_color,req.body.customer_id,req.body.service_ids,req.body.event_id,req.body.total_cost,req.body.expec_duration,req.body.status], function(err, result){
        if(err) throw err;
            console.log("1 record inserted");
        });
});

app.post('/confirm_event', (req, res)=>{
		mysqlConnection.query("INSERT INTO goal_salon_events(event_id,professional,start_date,end_date) VALUES(?,?,?,?)", [req.body.event_id,req.body.prof_name,req.body.startDate,req.body.endDate], function(err, result){
        if(err) throw err;
            console.log("1 record inserted");
        });
});

app.get('/total_colors', (req, res)=>{
		mysqlConnection.query('SELECT COUNT(*) total FROM goal_meeting_colors',[req.params.gender],(err,rows,fields)=> {
        if (!err)
            //console.log(rows);
            res.send(rows);
        else    
            console.log(err);
    })
});

app.get('/get_booked_services/:service_ids', (req, res)=>{
		
		var qry = 'select * from goal_saloon_men_services where service_id in ('+req.params.service_ids+')';
		mysqlConnection.query(qry,[req.params.service_ids],(err,rows,fields)=> {
        if (!err){
            //console.log(rows);
			//console.log(req.params.service_ids);
		res.send(rows);}
        else    
            console.log(err);
    })
});


app.get('/get_profs/:prof_ids', (req, res)=>{
		
		var qry = 'select * from goal_professionals where prof_id in ('+req.params.prof_ids+')';
		mysqlConnection.query(qry,[req.params.prof_ids],(err,rows,fields)=> {
        if (!err){
			res.send(rows);
		}
        else
            console.log(err);
    })
});

app.get('/get_avail/:prof_id/:start_date/:end_date', (req, res)=>{
		
		var qry = 'select * from goal_salon_events where professional =? and end_date > ? and start_date < ?'
		mysqlConnection.query(qry,[req.params.prof_id,req.params.start_date,req.params.end_date],(err,rows,fields)=> {
        if (!err){
			console.log(rows);
			res.send(rows);
		}
        else
            console.log(err);
    })
});

app.post('/logIn', (req, res)=>{
		var Password = [req.body.Password];
		mysqlConnection.query("SELECT * FROM goal_login WHERE Username = ?",[req.body.Username], function(error, results, fields){
			if (error) {
					res.json({
						status:false,
						message:'there are some error with query'
					})
			}else{
				if(results.length >0){
					 if(results[0].password== Password){
							res.json({
							status:true,
							message:'successfully authenticated',
							userid: results[0].userid,
							username: results[0].username
						})

					}else {
						res.json({
							status:false,
							message:'Username and Password do not match!'
						})
					}
				}
				else {
					res.json({
							status:false,
							message:'Please enter valid Username!'
						})
				}
			}
        });
});

app.post('/send-email',(req,res)=> {
	toMail = req.body.email;
	service = req.body.service;
	amount = req.body.amount;
	name = req.body.name;
	time = req.body.time;
    var mailOptions = {
		from: 'kumaraadarsh790@gmail',
		to: toMail,
		subject: 'Goal Salon E-Bill',
		html: '<h3>Hi <b>' +name +',</b></h3><br> Your selected services are <b>'+ service +'</b> And the total amount you have paid is <b>'+ amount +'.</b><br> Date: - <b>'+ time +'</b><br> Reagrds,<br>Goal Saloon'
	};
	
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
		console.log(error);
		}
		else {
			console.log('email sent: ' +info.response);
			res.send("Email sent");
		}
	})
});
