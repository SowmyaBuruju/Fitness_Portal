
const blogsController = require('../Controllers/blogsController');
const mainController  = require('../Controllers/mainController');
const dpController = require('../Controllers/dpController');


const constructorMethod = (app) => {

  app.get('/',mainController.Homepage);
  app.use('/Home', mainController.Homepage);
  app.get('/login',mainController.loginRoute);
  app.post('/login', mainController.loginRouteOnPost);
  app.get('/private', mainController.private);
  app.get('/signup',mainController.signupRoutes)
  app.post('/signup', mainController.signupRoutesOnPost);
  app.get('/logout', mainController.logoutRoutes);
  app.get('/Blogs',blogsController.getlatestblogs);
  app.get('/newBlog',blogsController.submitNewBlog);
  app.post('/newBlog',blogsController.submitNewBlogOnPost);
  app.get('/Blogs/:id',blogsController.getBlogbyId);
  app.post('/Blogs/:id/comments',blogsController.saveComment);
  app.post('/Blogs/:id/like', blogsController.updatelikes);
  app.get('/dietplans',dpController.dietPlans);
  app.post('/dietplans',dpController.dietPlansonPost);
  app.post('/savedietplans',dpController.saveDietPlans);
  app.get('/mydietplans', dpController.mydietplans);
  app.get('/myblogs',blogsController.getmyblogs);
  
  app.get('/BMI', (req, res) => {
    res.status(200).render('BMI',{title: 'BMI Calculator'})
  });
  app.get('/CalorieCalculator', (req, res) => {
    res.status(200).render('CalorieCal',{title: 'Calorie Calculator'})
  });
  app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not found' });
  });
};

module.exports = constructorMethod;
