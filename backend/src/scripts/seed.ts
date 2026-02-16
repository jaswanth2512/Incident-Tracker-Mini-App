import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Incident, { Severity, Status } from '../models/Incident';

dotenv.config();

const services = [
  'Auth Service', 'Payment Gateway', 'API Gateway', 'Database Cluster',
  'Frontend CDN', 'Backend API', 'Email Service', 'SMS Service',
  'Analytics Engine', 'Search Service', 'Cache Layer', 'Load Balancer',
  'Notification Service', 'File Storage', 'User Service', 'Order Service',
  'Inventory Service', 'Shipping Service', 'Recommendation Engine', 'Logging Service'
];

const owners = [
  'Alice Johnson', 'Bob Smith', 'Charlie Davis', 'Diana Prince',
  'Ethan Hunt', 'Fiona Green', 'George Wilson', 'Hannah Lee',
  'Ian Malcolm', 'Julia Roberts', '', '', '' // Some empty owners
];

const titleTemplates = [
  'High latency detected in',
  'Service outage for',
  'Database connection pool exhausted in',
  'Memory leak detected in',
  'API timeout errors in',
  'Disk space critical on',
  'SSL certificate expiring for',
  'Rate limit exceeded on',
  'Authentication failures in',
  'Data sync issues with',
  'Performance degradation in',
  'Network connectivity issues with',
  'Cache invalidation problems in',
  'Queue backlog growing in',
  'CPU spike detected on'
];

const summaryTemplates = [
  'Users are experiencing intermittent errors when accessing the service. Investigation ongoing.',
  'The backend service went down due to unexpected traffic spike. Team is working on mitigation.',
  'Database queries are running slower than expected. Analyzing query patterns and indexes.',
  'Memory usage has been steadily increasing over the past 24 hours. Investigating potential leak.',
  'Multiple users reported timeout errors. Load balancer configuration being reviewed.',
  'Disk usage reached 95% capacity. Cleanup and scaling procedures initiated.',
  'Certificate renewal process failed. Manual intervention required.',
  'API rate limits being hit more frequently. Reviewing client usage patterns.',
  'Authentication service returning 500 errors intermittently. Logs being analyzed.',
  'Data synchronization between primary and replica delayed by several minutes.',
  'Response times increased by 300% compared to baseline. Performance profiling in progress.',
  'Network packet loss detected between availability zones. Infrastructure team engaged.',
  'Cache hit rate dropped significantly. Investigating cache warming strategy.',
  'Message queue depth growing faster than processing rate. Scaling workers.',
  'CPU utilization spiked to 100% during peak hours. Optimization needed.'
];

const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateIncidents = (count: number) => {
  const incidents = [];
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

  // Generate historical incidents (last 6 months)
  for (let i = 0; i < count - 10; i++) {
    const createdAt = generateRandomDate(sixMonthsAgo, now);
    const updatedAt = new Date(createdAt.getTime() + Math.random() * (now.getTime() - createdAt.getTime()));

    const service = services[Math.floor(Math.random() * services.length)];
    const titleTemplate = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];

    const severities = Object.values(Severity);
    const statuses = Object.values(Status);

    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const owner = owners[Math.floor(Math.random() * owners.length)];
    const summary = Math.random() > 0.2
      ? summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)]
      : undefined;

    incidents.push({
      title: `${titleTemplate} ${service}`,
      service,
      severity,
      status,
      owner: owner || undefined,
      summary,
      createdAt,
      updatedAt
    });
  }

  // Generate recent incidents (today after 5 PM)
  const today = new Date();
  today.setHours(17, 0, 0, 0); // 5 PM today
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  for (let i = 0; i < 10; i++) {
    const createdAt = generateRandomDate(today, endOfDay);
    const updatedAt = new Date(createdAt.getTime() + Math.random() * (endOfDay.getTime() - createdAt.getTime()));

    const service = services[Math.floor(Math.random() * services.length)];
    const titleTemplate = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];

    const severities = Object.values(Severity);
    const statuses = Object.values(Status);

    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const owner = owners[Math.floor(Math.random() * owners.length)];
    const summary = Math.random() > 0.2
      ? summaryTemplates[Math.floor(Math.random() * summaryTemplates.length)]
      : undefined;

    incidents.push({
      title: `${titleTemplate} ${service}`,
      service,
      severity,
      status,
      owner: owner || undefined,
      summary,
      createdAt,
      updatedAt
    });
  }

  return incidents;
};

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing incidents
    await Incident.deleteMany({});
    console.log('🗑️  Cleared existing incidents');

    // Generate and insert incidents
    const incidents = generateIncidents(200);
    await Incident.insertMany(incidents);
    
    console.log(`✅ Successfully seeded ${incidents.length} incidents`);
    
    // Display some statistics
    const stats = await Incident.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log('\n📊 Incident Statistics:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

