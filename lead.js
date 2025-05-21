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
  initializeFormData(req);
  req.session.formData.leadName = req.body.name;
  req.session.formData.leadEmail = req.body.email;
  console.log('Lead submitted:', req.session.formData);
  
  res.redirect('/MakePay');
});

app.get('/MakePay', (req, res) => {
  res.render('MakePay.ejs', { name: req.session.name, email: req.session.email });
});

app.get('/paysuccess', (req, res) => {
  res.render('PaySuccessful.ejs');
});

const TOTAL_STEPS = 7;

app.get('/multi-form', (req, res) => {
  // let currentStep = parseInt(req.query.s, 10) || 1; // Get step from query param 's', default to 1
  // if (currentStep < 1) currentStep = 1;
  // if (currentStep > TOTAL_STEPS + 1) currentStep = TOTAL_STEPS + 1; // e.g. step 8 is final

  initializeFormData(req); // Ensure formData object exists in session

  res.render('MultiForms.ejs', { step: 1, formData: req.session.formData});
});

app.get('/render-step/:stepNum', (req, res) => {
  const stepNumber = parseInt(req.params.stepNum, 10);

  if (stepNumber >= 1 && stepNumber <= TOTAL_STEPS + 1) {
    initializeFormData(req);

    res.render(`step${stepNumber}`, {
        currentStepNumber: stepNumber,
        formData: req.session.formData[`step${stepNumber}`] || {}, // Data specific to this step
        allFormData: req.session.formData // Pass all form data if needed
    });
  } else {
    res.status(404).send('Step not found');
  }
});

app.post('/submit-step/:stepNum', (req, res) => {
  const currentStepNumber = parseInt(req.params.stepNum, 10);
  initializeFormData(req);

  req.session.formData[`step${currentStepNumber}`] = req.body;

  console.log(`Data for step ${currentStepNumber} saved:`, req.body);
  console.log('Current session formData:', req.session.formData);

  if (currentStepNumber < TOTAL_STEPS) {
    // Redirect the PARENT FRAME to the /multi-form route with the NEXT step number
    res.redirect(`/multi-form?s=${currentStepNumber + 1}`);
  } else if (currentStepNumber === TOTAL_STEPS) {
    res.redirect(`/multi-form?s=${TOTAL_STEPS + 1}`); // Go to step 8 (summary/confirmation)
  } else {
    console.log('All form data submitted:', req.session.formData);
    res.redirect('/paysuccess');
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});