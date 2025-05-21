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
  secret: 'your-super-secret-key-for-session',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

const initializeFormData = (req) => {
  if (!req.session.formData) {
    req.session.formData = {};
  }
};

app.get('/', (req, res) => {
    res.render('lead.ejs');
});

app.post('/submit-lead', (req, res) => {
  
  res.redirect('/MakePay');
});

app.get('/MakePay', (req, res) => {
  res.render('MakePay.ejs');
});

app.get('/paysuccess', (req, res) => {
  res.render('PaySuccessful.ejs');
});

const TOTAL_STEPS = 7;

app.get('/multi-form', (req, res) => {

  res.render('MultiForms.ejs', { step: 1});
});

app.get('/render-step/:stepNum', (req, res) => {
  const stepNumber = parseInt(req.params.stepNum, 10);

  res.render(`step${stepNumber}`);
});

app.post('/submit-step/:stepNum', (req, res) => {
  const currentStepNumber = parseInt(req.params.stepNum, 10) + 1;

  res.redirect(`/render-step/${currentStepNumber}`);
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});