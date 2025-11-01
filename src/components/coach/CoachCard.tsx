'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock, Users, MapPin } from 'lucide-react';
import { CoachProfile } from '@/types/coach';

interface CoachCardProps {
  coach: CoachProfile;
}

export default function CoachCard({ coach }: CoachCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBookSession = () => {
    setIsLoading(true);
    // This would typically open a booking modal or navigate to booking page
    console.log('Book session for coach:', coach._id);
    setIsLoading(false);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={coach.profileImage} alt={`${coach.firstName} ${coach.lastName}`} />
            <AvatarFallback className="text-lg">
              {coach.firstName[0]}{coach.lastName[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold truncate">
                {coach.firstName} {coach.lastName}
              </CardTitle>
              {coach.isVerified && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Verified
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{coach.averageRating}</span>
                <span className="text-sm text-gray-500">({coach.totalSessions} sessions)</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">${coach.hourlyRate}/hr</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Expertise Tags */}
        <div className="flex flex-wrap gap-1">
          {coach.expertise.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {coach.expertise.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{coach.expertise.length - 3} more
            </Badge>
          )}
        </div>

        {/* Bio Preview */}
        {coach.bio && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {coach.bio}
          </p>
        )}

        {/* Experience */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{coach.yearsExperience} years experience</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Link href={`/coach/${coach._id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Link>
          <Button 
            onClick={handleBookSession}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Loading...' : 'Book Session'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
