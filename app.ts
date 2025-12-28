import express from 'express';
import cors from 'cors';
import propertyRoutes from './routes/property.routes'
import uploadRoutes from './routes/upload.route'
import newLaunchRouter from './routes/newLaunch.routes';

const app = express();
const PORT = process.env.PORT || 3500;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static('public')); // Serve static files from 'public' directory

app.get('/', (req, res) => {
  res.send("Welcome to my app")
})


app.use('/api/property', propertyRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api', newLaunchRouter)


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})