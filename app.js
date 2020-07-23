var express	 	= require("express"),
	app 		= express(),
	bodyParser	= require("body-parser"),
	flash		= require("connect-flash"),
	passport 	= require("passport"),
	LocalStrategy= require("passport-local"),
	methodOverride = require("method-override"),
	Campground 	= require("./models/campground"),
	Comment		= require("./models/comment"),
	User 		= require("./models/user"),
	seedDB		= require("./seeds");

//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes = require("./routes/campground"),
	indexRoutes = require("./routes/index");

const mongoose	= require("mongoose");
//mongoose.connect('mongodb://localhost:27017/yelp_camp'
mongoose.connect('mongodb+srv://nmai601:password123456@cluster0.xan0n.mongodb.net/<dbname>?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"another secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next){
	res.locals.currentUser=req.user;
	res.locals.error =  req.flash("error");
	res.locals.success =  req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){});

