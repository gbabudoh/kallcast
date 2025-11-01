'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock, Users, Calendar, MessageCircle, Award } from 'lucide-react';
import { CoachProfile as CoachProfileType, TimeSlot } from '@/types';

export default function CoachProfile() {
  const params = useParams();
  const [coach, setCoach] = useState<CoachProfileType | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoachProfile = async () => {
      try {
        const response = await fetch(`/api/coaches/${params.coachId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch coach profile');
        }
        
        const data = await response.json();
        setCoach(data.coach);
        setAvailableSlots(data.availableSlots || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.coachId) {
      fetchCoachProfile();
    }
  }, [params.coachId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error || !coach) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Coach not found
              </h3>
              <p className="text-gray-600">
                {error || 'The coach you are looking for does not exist.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Coach Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={coach.profileImage} alt={`${coach.firstName} ${coach.lastName}`} />
              <AvatarFallback className="text-2xl">
                {coach.firstName[0]}{coach.lastName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {coach.firstName} {coach.lastName}
                </h1>
                {coach.isVerified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{coach.averageRating}</span>
                  <span className="text-gray-500">({coach.totalSessions} sessions)</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-lg font-semibold">${coach.hourlyRate}/hour</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{coach.yearsExperience} years experience</span>
                </div>
              </div>
              
              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2">
                {coach.expertise.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      {coach.bio && (
        <Card>
          <CardHeader>
            <CardTitle>About {coach.firstName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{coach.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Available Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Available Sessions</span>
          </CardTitle>
          <CardDescription>
            Book a session with {coach.firstName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableSlots.map((slot) => (
                <div key={slot.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{slot.startTime.toLocaleDateString()}</h4>
                    <Badge variant={slot.isAvailable ? "default" : "secondary"}>
                      {slot.isAvailable ? "Available" : "Booked"}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {slot.startTime.toLocaleTimeString()} - {slot.endTime.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{slot.currentParticipants}/{slot.maxParticipants} participants</span>
                    </div>
                    <div className="font-semibold text-lg">${slot.price}</div>
                  </div>
                  
                  <Button 
                    className="w-full mt-3" 
                    disabled={!slot.isAvailable}
                    onClick={() => {
                      // Navigate to booking page
                      window.location.href = `/booking/${slot.id}`;
                    }}
                  >
                    {slot.isAvailable ? 'Book Session' : 'Fully Booked'}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No available sessions
              </h3>
              <p className="text-gray-600">
                {coach.firstName} doesn't have any available sessions at the moment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Section */}
      <Card>
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
          <CardDescription>
            Have questions? Send a message to {coach.firstName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>Send Message</span>
            </Button>
            <Button variant="outline">
              View All Reviews
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
