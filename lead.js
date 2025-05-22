import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import multer from 'multer'
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const port = 3000;
// const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.use(session({
  secret: 'your-super-secret-key-for-session',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 );
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

app.use((req, res, next) => {
    if (!req.session.formData) {
        req.session.formData = {}; // for multi-step form
    }

    if (!req.session.signUpData) {
        req.session.signUpData = {}; // for standalone signup form
    }

    next();
});


app.get('/', (req, res) => {
    const stepData = req.session.signUpData || {}; // load any saved data
    res.render('lead.ejs', { data: stepData });
});

app.post('/submit-lead', (req, res) => {
  req.session.signUpData = req.body; // <-- Save signup data to session
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
  const stepData = req.session.formData[stepNumber] || {}; // load any saved data
  if (stepNumber === 8) {
    return res.render('step8', {
      stepsData: req.session.formData || {},
      signUpData: req.session.signUpData || {}
    });
  }
  res.render(`step${stepNumber}`, { data: stepData });
});

app.post('/submit-step/1', upload.fields([
  { name: 'passport', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]), (req, res) => {
  req.session.formData[1] = {
    ...req.body,
    passport: req.files?.passport?.[0]?.filename,
    signature: req.files?.signature?.[0]?.filename
  };
  res.redirect('/render-step/2');
});

app.post('/submit-step/2', upload.single('license'), (req, res) => {
  req.session.formData[2] = {
    ...req.body,
    license: req.file?.filename
  };
  res.redirect('/render-step/3');
});


app.post('/submit-step/:stepNum', (req, res) => {
  const currentStepNumber = parseInt(req.params.stepNum, 10) + 1;
  req.session.formData[currentStepNumber - 1] = req.body;
  res.redirect(`/render-step/${currentStepNumber}`);

});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});