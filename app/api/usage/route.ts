import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { userUsage, user } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
    try {
        // Get the session using Better Auth
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        // Check if user is authenticated
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized - Please sign in to access usage data' },
                { status: 401 }
            );
        }

        // Query user usage data from the database
        let usageData = await db
            .select({
                id: userUsage.id,
                currentUsage: userUsage.currentUsage,
                usageLimit: userUsage.usageLimit,
                lastUpdated: userUsage.lastUpdated,
                createdAt: userUsage.createdAt,
                updatedAt: userUsage.updatedAt,
            })
            .from(userUsage)
            .where(eq(userUsage.userId, session.user.id))
            .limit(1);

        // If no usage data exists for this user, create a default entry
        if (usageData.length === 0) {
            const defaultUsage = {
                id: nanoid(),
                userId: session.user.id,
                currentUsage: 0,
                usageLimit: 100,
                lastUpdated: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await db.insert(userUsage).values(defaultUsage);
            
            usageData = [defaultUsage];
        }

        // Calculate usage percentage
        const usageWithPercentage = {
            ...usageData[0],
            usagePercentage: Math.round((usageData[0].currentUsage / usageData[0].usageLimit) * 100),
            remainingUsage: usageData[0].usageLimit - usageData[0].currentUsage,
        };

        return NextResponse.json({
            success: true,
            data: usageWithPercentage,
        });

    } catch (error) {
        console.error('Error fetching usage data:', error);
        
        // Handle different types of errors
        if (error instanceof Error) {
            return NextResponse.json(
                { 
                    error: 'Failed to fetch usage data',
                    details: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Get the session using Better Auth
        const session = await auth.api.getSession({
            headers: request.headers,
        });

        // Check if user is authenticated
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized - Please sign in to update usage data' },
                { status: 401 }
            );
        }

        // Parse the request body
        const body = await request.json();
        const { currentUsage, usageLimit } = body;

        // Validate input
        if (typeof currentUsage !== 'number' || currentUsage < 0) {
            return NextResponse.json(
                { error: 'Invalid currentUsage value - must be a non-negative number' },
                { status: 400 }
            );
        }

        if (typeof usageLimit !== 'number' || usageLimit <= 0) {
            return NextResponse.json(
                { error: 'Invalid usageLimit value - must be a positive number' },
                { status: 400 }
            );
        }

        if (currentUsage > usageLimit) {
            return NextResponse.json(
                { error: 'Current usage cannot exceed usage limit' },
                { status: 400 }
            );
        }

        // Check if usage data exists for this user
        const existingUsage = await db
            .select({ id: userUsage.id })
            .from(userUsage)
            .where(eq(userUsage.userId, session.user.id))
            .limit(1);

        const now = new Date();
        let updatedUsage;

        if (existingUsage.length > 0) {
            // Update existing usage data
            await db
                .update(userUsage)
                .set({
                    currentUsage,
                    usageLimit,
                    lastUpdated: now,
                    updatedAt: now,
                })
                .where(eq(userUsage.userId, session.user.id));

            updatedUsage = {
                id: existingUsage[0].id,
                userId: session.user.id,
                currentUsage,
                usageLimit,
                lastUpdated: now,
                createdAt: now,
                updatedAt: now,
            };
        } else {
            // Create new usage data
            const newUsage = {
                id: nanoid(),
                userId: session.user.id,
                currentUsage,
                usageLimit,
                lastUpdated: now,
                createdAt: now,
                updatedAt: now,
            };

            await db.insert(userUsage).values(newUsage);
            updatedUsage = newUsage;
        }

        // Calculate usage percentage
        const usageWithPercentage = {
            ...updatedUsage,
            usagePercentage: Math.round((updatedUsage.currentUsage / updatedUsage.usageLimit) * 100),
            remainingUsage: updatedUsage.usageLimit - updatedUsage.currentUsage,
        };

        return NextResponse.json({
            success: true,
            data: usageWithPercentage,
        });

    } catch (error) {
        console.error('Error updating usage data:', error);
        
        if (error instanceof Error) {
            return NextResponse.json(
                { 
                    error: 'Failed to update usage data',
                    details: error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}