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
// Initialize structured session data if not exists
app.use((req, res, next) => {
  if (!req.session.forms) {
    req.session.forms = {
      lead: {},
      payment: {},
      step1: {},
      step2: {},
      step3: {},
      step4: {},
      step5: {},
      step6: {}
    };
  }
  // For backward compatibility, maintain the legacy data object
  if (!req.session.data) {
    req.session.data = {};
  }
  next();
});

// Helper function to store form data in appropriate section
function storeFormData(req, formType) {
  // Store in structured format
  req.session.forms[formType] = { ...req.session.forms[formType], ...req.body };
  
  // Also store in legacy format to maintain compatibility
  req.session.data = { ...req.session.data, ...req.body };
}


app.get('/', (req, res) => {
    res.render('lead.ejs', { 
      data : req.session.data || {},
      formData: req.session.forms.lead || {} // New structured format
    });
});

app.post('/submit-lead', (req, res) => {
  storeFormData(req, 'lead');
  res.redirect('/MakePay');
});

app.get('/MakePay', (req, res) => {
  res.render('MakePay.ejs');
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
  res.render('otherForms', { 
    step: 1,
    data: req.session.data || {},
    allForms: req.session.forms || {},
    formData: req.session.forms.step1 || {}
  }); // This will render views/otherForms.ejs
});

app.get('/step:stepNumber', (req, res) => {
  const step = parseInt(req.params.stepNumber); // get the step from the URL

  res.render('otherForms', {
    step,
    data: req.session.data || {},
    allForms: req.session.forms || {},
    formData: req.session.forms?.[`step${step}`] || {}
  });
});

app.post('/step:stepNumber', (req, res) => {
  const step = parseInt(req.params.stepNumber);
  storeFormData(req, `step${step}`);
  res.redirect(`/step${step + 1}`);
});


// app.get('/step1', (req, res) => {
//   res.render('otherForms', { 
//     step: 1, 
//     data: req.session.data || {},
//     formData: req.session.forms.step1 || {}
//   });
// });

// app.post('/step1', (req, res) => {
//   storeFormData(req, 'step1');
//   res.redirect('/step2');
// });

// app.get('/step2', (req, res) => {
//   res.render('otherForms', { 
//     step: 2,
//     data: req.session.data || {},
//     formData: req.session.forms.step2 || {}
//   });
// });

// app.post('/step2', (req, res) => {
//   storeFormData(req, 'step2');
//   res.redirect('/step3');
// });

// app.get('/step3', (req, res) => {
//   res.render('otherForms', { 
//     step: 3,
//     data: req.session.data || {},
//     formData: req.session.forms.step3 || {}
//   });
// });

// app.post('/step3', (req, res) => {
//   storeFormData(req, 'step3');
//   res.redirect('/step4');
// });

// app.get('/step4', (req, res) => {
//   res.render('otherForms', { 
//     step: 4,
//     data: req.session.data || {},
//     formData: req.session.forms.step4 || {}
//   });
// });

// app.post('/step4', (req, res) => {
//   storeFormData(req, 'step4');
//   res.redirect('/step5');

// });

// app.get('/step5', (req, res) => {
//   res.render('otherForms', { 
//     step: 5,
//     data: req.session.data || {},
//     formData: req.session.forms.step5 || {}
//   });
// });

// app.post('/step5', (req, res) => {
//   storeFormData(req, 'step5');
//   res.redirect('/step6');
// });

// app.get('/step6', (req, res) => {
//   res.render('otherForms', { 
//     step: 6,
//     data: req.session.data || {},
//     formData: req.session.forms.step6 || {}
//   });
// });

// app.post('/step6', (req, res) => {
//   storeFormData(req, 'step6');
//   res.redirect('/step7');
// });

app.get('/step7', (req, res) => {
  res.render('step7', { 
    step: 7,
    data: req.session.data || {},
    allForms: req.session.forms || {}
  });
});

// Add a summary endpoint to view all stored data
app.get('/summary', (req, res) => {
  res.render('summary', { 
    data: req.session.data || {},
    allForms: req.session.forms || {}
  });
});

// Clear all stored data (useful for testing)
app.get('/clear-data', (req, res) => {
  req.session.forms = {
    lead: {},
    payment: {},
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
    step6: {}
  };
  req.session.data = {};
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});