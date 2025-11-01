import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { registerSchema, registerCoachSchema } from '@/validations/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { role } = body;

    // Validate based on role
    const schema = role === 'coach' ? registerCoachSchema : registerSchema;
    const validationResult = schema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const userData: any = {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      timezone: data.timezone,
    };

    // Add coach-specific fields
    if (data.role === 'coach') {
      const coachData = data as any; // Type assertion for coach-specific fields
      userData.bio = coachData.bio;
      userData.expertise = coachData.expertise;
      userData.yearsExperience = coachData.yearsExperience;
      userData.hourlyRate = coachData.hourlyRate;
      userData.isVerified = false;
      userData.stripeOnboardingComplete = false;
    }

    const user = new User(userData);
    await user.save();

    // Return user without password
    const { password, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { 
        message: 'User created successfully', 
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
