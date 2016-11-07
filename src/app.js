const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const lessMiddleware = require('less-middleware');

const Addon = require('./models/addon.js');
const AddonReport = require('./models/addonReport.js');

require('source-map-support').install();

const app = express();

app.disable('x-powered-by');

app.set('view engine', 'pug');
app.set('views', './bin/views');

app.use(lessMiddleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const DISABLED = true;

const wrap = fn => (...args) => fn(...args).catch(args[2]);

app.get('/', wrap(async(req, res) => {
    if (!DISABLED) {
        let cookies = req.cookies;
        if (!cookies || !cookies.s) {
            let opts = { maxAge : 2592000000 };
            res.cookie('s', Math.random().toString(36).slice(2), opts);
        }
        try {
            let addonUrl = await Addon.getLeastTestedAddon();
            res.render('index', {
                addon_url: addonUrl
            });
        } catch (err) {
            console.log(err);
        }
    } else {
        res.render('index');
    }
}));

app.post('/', wrap(async(req, res) => {
    try {
        if (!DISABLED) {
            let params = req.body;
            if (params) {
                let addonUrl = params.addon_url;
                if (addonUrl) {
                    let compatible = params.compatible;
                    let comment = params.comment;
                    if (!compatible) {
                        res.render('index', {
                            is_error: true,
                            addon_url: addonUrl,
                            comment: comment
                        });
                        return;
                    } else {
                        let cookies = req.cookies;
                        let session = (cookies && cookies.s) ? cookies.s : 0;
                        await new AddonReport(addonUrl, compatible, comment, session).save();
                    }
                }
            }
        }
        res.redirect('/');
    } catch (err) {
        console.log(err);
    }
}));

app.listen(process.env.PORT || 5000);
