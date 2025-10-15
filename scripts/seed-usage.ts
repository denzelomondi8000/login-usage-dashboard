import { nanoid } from 'nanoid';
import { db } from '../db';
import { userUsage } from '../db/schema';

async function seedUsageData() {
    console.log('Seeding user usage data...');
    
    // Sample usage data for testing
    const sampleUsageData = [
        {
            id: nanoid(),
            userId: 'demo-user-id', // This should match a real user ID
            currentUsage: 45,
            usageLimit: 100,
            lastUpdated: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: nanoid(),
            userId: 'another-user-id',
            currentUsage: 78,
            usageLimit: 150,
            lastUpdated: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    try {
        // Insert sample data
        await db.insert(userUsage).values(sampleUsageData);
        console.log('Sample usage data seeded successfully!');
    } catch (error) {
        console.error('Error seeding usage data:', error);
    }
}

// Run the seed function
seedUsageData().catch(console.error);