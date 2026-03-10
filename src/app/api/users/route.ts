import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import type { Role } from '@/generated/client';
import { registerSchema, registerCoachSchema } from '@/validations/auth';

export async function POST(request: NextRequest) {
  try {
    // await prisma.$connect(); // Optional, prisma handles connection
    
    const body = await request.json();
    const { role } = body;

    // Use base register schema first to check common fields
    const baseValidation = registerSchema.safeParse(body);
    if (!baseValidation.success) {
      return NextResponse.json(
        { 
          message: 'Validation failed', 
          errors: baseValidation.error.issues 
        },
        { status: 400 }
      );
    }

    const data = baseValidation.data;

    // If it's a coach registration and has additional fields, validate them
    const hasCoachFields = 'bio' in body || 'expertise' in body || 'hourlyRate' in body;
    if (role === 'coach' && hasCoachFields) {
      const coachValidation = registerCoachSchema.safeParse(body);
      if (!coachValidation.success) {
        return NextResponse.json(
          { 
            message: 'Coach profile validation failed', 
            errors: coachValidation.error.issues 
          },
          { status: 400 }
        );
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ 
      where: { email: data.email } 
    });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role as Role,
        timezone: data.timezone,
        ...(data.role === 'coach' ? {
          bio: 'bio' in body ? body.bio as string : undefined,
          expertise: 'expertise' in body ? (body.expertise as string[]) : [],
          yearsExperience: 'yearsExperience' in body ? body.yearsExperience as number : undefined,
          hourlyRate: 'hourlyRate' in body ? body.hourlyRate as number : undefined,
          isVerified: false,
          stripeOnboardingComplete: false,
        } : {})
      }
    });

    // Return user without password
    const userWithoutPassword = { ...user };
    // @ts-expect-error - password exists on user model but not on ReturnType
    delete userWithoutPassword.password;

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
