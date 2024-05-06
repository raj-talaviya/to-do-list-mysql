var express= require('express');
var bodyparser = require('body-parser');
var mysql= require('mysql');

var app = express();

var con = mysql.createConnection({

    host:"localhost",
    user:"root",
    password:"",
    database:"to-do-list"
})

con.connect();

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:false}));

 
var user_name="";
var admin_name="";


// Admin Login
app.get('/',function(req,res){
    res.render('login');
})


app.post('/',function(req,res){
    var email = req.body.email;
    var pass = req.body.password;
    
    if(email && pass){
        
        var select = "select * from admin where email='"+email+"' and password='"+pass+"'";
            
        con.query(select,function(error,result,index){
            if(error) throw error;

            if(result.length>0){
                admin_name=result[0].name;
                res.redirect('/dashboard')
            }else{
                res.send("Invalid name or Password")
            }
        }) 
    }else{
        res.send("Please enter name or Password")
    }
})

app.get('/dashboard',function(req,res){
    res.render('dashboard',{admin_name})
})

// Add User
app.get('/adduser', function(req, res){
    res.render('add_user')
})

app.post('/adduser', function(req, res){
    var uname=req.body.uname;
    var uemail=req.body.uemail;
    var upass=req.body.upass;

    var qr="insert into user(name,email,password) values('"+uname+"','"+uemail+"','"+upass+"')";
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.redirect('/adduser')
    })
})

// View Staff
app.get('/viewuser',function(req,res){
    var select = "select * from user"
    con.query(select,function(error,result,index){
        if(error) throw error
        res.render('view_user',{result})
    })
})

// Mange Staff
app.get('/manageuser',function(req,res){
    var select = "select * from user"
    con.query(select,function(error,result,index){
        if(error) throw error
        res.render('manage_user',{result})
    })
})

// Update staff
app.get('/update/:id',function(req,res){
    var id=req.params.id;
    
    var update="select * from user where id="+id

    con.query(update,function(error,result,index){
        if(error) throw error
        res.render('update_user',{result})
    })
})

app.post('/update/:id',function(req,res){
    var id=req.params.id;
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;

    var qr="update user set name='"+name+"',email='"+email+"',password='"+password+"' where id="+id;
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.redirect('/manageuser')
    })
})

// Delete Staff
app.get('/delete/:id',function(req,res){
    var id=req.params.id

    var qr="delete from user where id="+id

    con.query(qr,function(error,result,index){
        if(error) throw error
        res.redirect("/manageuser")
    })
})

// Add task
app.get('/addtask',function(req,res){
    var qr="select * from user";

    con.query(qr,function(error,result,index){
        if(error) throw error
        res.render("add_task",{result})
    })
})

app.post('/addtask',function(req,res){
    
    var task_name =req.body.task_name;
    var user_id=req.body.user_id;

    var insert="insert into task (task_name,task_user,status) values ('"+task_name+"','"+user_id+"','Pending')";

    con.query(insert,function(error,result,field){
        if(error) throw error;
        res.redirect('/addtask');
    })
})

// View Task
app.get('/viewtask',function(req,res){
    
    var insert="select * from task";

    con.query(insert,function(error,result,index){
        if(error) throw error;
        res.render('view_task',{result});
    })
})

/*==============================================
                User
==============================================*/
app.get('/userlogin',function(req,res){
    res.render('user_login')
})

app.post('/userlogin',function(req,res){
    var email = req.body.uemail;
    var pass = req.body.upass;

    if(email && pass){

        var select = "select * from user where email='"+email+"' and password='"+pass+"'";
            
        con.query(select,function(error,result,index){
            if(error) throw error;
            
            if(result.length>0){
                user_name=result[0].name;
                // console.log(user_name)
                res.redirect('/user_dashboard')
            }else{
                res.send("Invalid username or Password")
            }
            res.end();
        }) 
    }else{
        res.send("Please enter Username or Password")
        res.end();
    }
})

app.get('/user_dashboard',function(req,res){
    var qr = "select * from task where task_user= '"+user_name+"' "
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.render('user_dashboard',{result,user_name})
        console.log(result);
    })
})

// Update Status
app.get('/updatestatus/:role/:id',function(req,res){
    var status = req.params.role;
    var id = req.params.id;
    var query = "update task set status='"+status+"' where id="+id;

    con.query(query,function(error,result,field){
        if(error) throw error;
        res.redirect('/user_dashboard');
    })
})

app.listen(3000)

console.log("Connected!");