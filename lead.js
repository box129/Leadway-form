import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const port = 3000;
// const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('lead.ejs');
});

app.post('/submit-lead', (req, res) => {
  req.session.name = req.body.name;
  req.session.email = req.body.email;
  
  res.redirect('/MakePay');
});

app.get('/MakePay', (req, res) => {
  // if (!req.session.name || !req.session.email) {
  //   return res.redirect('/');
  // }
  
  res.render('MakePay.ejs', { name: req.session.name, email: req.session.email });
});
// app.post('/MakePay', (req, res) => {


//   res.redirect('/paysuccess');
// });

app.get('/paysuccess', (req, res) => {


  res.render('PaySuccessful.ejs');
});


app.get('/multi-form', (req, res) => {

  res.render('MultiForms.ejs');
});

app.get('/other-forms', (req, res) => {
  res.render('otherForms', { step: 1}); // This will render views/otherForms.ejs
});

app.get('/step1', (req, res) => {
  res.render('step1', { step: 1})
});

app.post('/step1', (req, res) => {
  res.redirect('/step2');
});

app.get('/step2', (req, res) => {
  res.render('step2', { step: 2});
});

app.post('/step2', (req, res) => {
  res.redirect('/step3');
});

app.get('/step3', (req, res) => {
  res.render('step3', { step: 3});
});

app.post('/step3', (req, res) => {
  res.redirect('/step4');
});

app.get('/step4', (req, res) => {
  res.render('step4', { step: 4});
});

app.post('/step4', (req, res) => {
  res.redirect('/step5');

});

app.get('/step5', (req, res) => {
  res.render('step5', { step: 5});
});

app.post('/step5', (req, res) => {
  res.redirect('/step6');
});

app.get('/step6', (req, res) => {
  res.render('step6', { step: 6});
});

app.post('/step6', (req, res) => {
  res.redirect('/step7');
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});