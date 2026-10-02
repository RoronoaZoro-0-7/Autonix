import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import prisma from './config/db';
import authRoutes from './routes/authRoutes';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes';
import orgRoutes from './routes/orgRoutes';
import workflowRoutes from './routes/workflowRoutes';
import webhookRoutes from './routes/webhookRoutes';

// import redis from './config/redis';
// redis;
import './config/redis';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}))
app.use(express.json());
app.get('/health', async (req, res) => {
    res.send({ status: 'ok' });
});
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/org", orgRoutes);
app.use('/api/orgs/:orgId/workflows', workflowRoutes);
app.use('/api/webhooks', webhookRoutes);

app.listen(process.env.port || 3000, async () => {
    console.log(`Server running on port ${process.env.port || 3000}`);
    // await prisma.$connect();
    console.log(await prisma.user.count());
})