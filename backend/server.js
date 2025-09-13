//server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './src/config/index.js'; 
import errorHandler from './src/middlewares/error.middleware.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/users.routes.js';
import attendanceRecordRoutes from './src/routes/attendanceRecords.route.js';
import paymentRoutes from './src/routes/payment.route.js';
import purchaseRoutes from './src/routes/purchase.routes.js';
import workoutPlanRoutes from './src/routes/workoutPlan.routes.js';
import dietPlanRoutes from './src/routes/dietPlan.route.js';
import messageRoutes from './src/routes/message.route.js';
import clientProgressRoutes from './src/routes/clientProgress.route.js';
import sessionScheduleRoutes from './src/routes/sessionSchedule.routes.js';
import feedbackRoutes from './src/routes/feedback.route.js';
import loyaltyPointsRoutes from './src/routes/loyaltyPoints.routes.js';
import financialRoutes from './src/routes/financial.routes.js';
import revenueRoutes from './src/routes/revenue.routes.js';
import expenseRoutes from './src/routes/expense.routes.js';
import invoiceRoutes from './src/routes/invoice.routes.js';
import payrollRoutes from './src/routes/payroll.routes.js';
import gymSettingsRoutes from './src/routes/gymSettings.routes.js';



dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middeware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // لدعم البيانات المرسلة عبر النماذج

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRecordRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/diet-plans', dietPlanRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/progress', clientProgressRoutes);
app.use('/api/schedules', sessionScheduleRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/loyalty-points', loyaltyPointsRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/finance/revenues', revenueRoutes);
app.use('/api/finance/expenses', expenseRoutes);
app.use('/api/finance/invoices', invoiceRoutes);
app.use('/api/finance/payrolls', payrollRoutes);
app.use('/api/gym-settings', gymSettingsRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('Welcome to the Gym Management System!');
});

app.listen(port , (req , res) => {
    console.log(`Server is running on http://localhost:${port}`);
})