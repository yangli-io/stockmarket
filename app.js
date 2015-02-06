/* jshint ignore:start */
var express         = require('express'),
    dataReader      = require('./server/database'),
    bodyParser      = require('body-parser');

var data = dataReader.read().toString() || "{}";

data = JSON.parse(data);

var app = express();

function listen(port){
    app.listen(port).on('error', function(err){
        if (err.code === 'EADDRINUSE'){
            listen(port+1);
        }
    }).on('listening', function(){
        console.log('listening to port ' + port);
    });
}

listen(3000);

app.use(express.static(__dirname + '/www'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.post('/signup', function(req, res){
    var profile = (req.body);

    //if profile already exists
    if(data[profile.email]){
        res.status(409);
        res.send('error');
    }

    data[profile.email] = profile;

    var sendBack = {
        name: data[profile.email].name,
        email: profile.email,
        amount: data[profile.email].amount,
        stocks: data[profile.email].stocks
    };
    dataReader.write(data);
    res.json(sendBack);
});

app.post('/login', function(req, res){
    var profile = req.body;

    if (!data[profile.email] || profile.password != data[profile.email].password){
        res.status(404);
        res.send('error');
    } else {
        var sendBack = {
            name: data[profile.email].name,
            email: profile.email,
            amount: data[profile.email].amount,
            stocks: data[profile.email].stocks
        };

        res.json(sendBack);
    }
});

app.put('/stocks', function(req, res){
    var stock = req.body;
    var profile = data[stock.email];
    if (profile.stocks[stock.symbol]){
        profile.stocks[stock.symbol] += stock.amount;
    } else {
        profile.stocks[stock.symbol] = stock.amount;
    }
    profile.amount -= stock.amount * stock.price;
    dataReader.write(data);
    res.send('success');
});

app.put('/funds', function(req, res){
    var funds = req.body;
    if (funds.choice === 'Add'){
        data[funds.email].amount += 1 * funds.amount;
    } else if (funds.choice === 'Withdraw') {
        data[funds.email].amount -= 1 * funds.amount;
    };
    dataReader.write(data);
    res.json({amount: data[funds.email].amount});
});