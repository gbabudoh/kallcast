'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, Square } from 'lucide-react';

interface SessionTimerProps {
  startTime?: Date;
  duration?: number; // in minutes
  isActive?: boolean;
  onTimeUp?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onEnd?: () => void;
}

export default function SessionTimer({
  startTime,
  duration,
  isActive = true,
  onTimeUp,
  onPause,
  onResume,
  onEnd,
}: SessionTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        
        // Check if time is up
        if (duration && newTime >= duration * 60) {
          setIsTimeUp(true);
          onTimeUp?.();
          return duration * 60;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, duration, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRemainingTime = () => {
    if (!duration) return null;
    const remaining = Math.max(0, duration * 60 - elapsedTime);
    return formatTime(remaining);
  };

  const getProgress = () => {
    if (!duration) return 0;
    return Math.min(100, (elapsedTime / (duration * 60)) * 100);
  };

  const handlePause = () => {
    setIsPaused(true);
    onPause?.();
  };

  const handleResume = () => {
    setIsPaused(false);
    onResume?.();
  };

  const handleEnd = () => {
    onEnd?.();
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-2xl font-mono font-bold">
                {formatTime(elapsedTime)}
              </span>
            </div>
            
            {duration && (
              <div className="text-sm text-muted-foreground">
                {isTimeUp ? (
                  <Badge variant="destructive">Time's up!</Badge>
                ) : (
                  <span>Remaining: {getRemainingTime()}</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {isPaused ? (
              <button
                onClick={handleResume}
                className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors"
                title="Resume session"
              >
                <Play className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="p-2 rounded-full bg-yellow-100 hover:bg-yellow-200 text-yellow-600 transition-colors"
                title="Pause session"
              >
                <Pause className="h-4 w-4" />
              </button>
            )}
            
            <button
              onClick={handleEnd}
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
              title="End session"
            >
              <Square className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        {duration && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>Session Progress</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isTimeUp ? 'bg-red-500' : getProgress() > 80 ? 'bg-yellow-500' : 'bg-primary'
                }`}
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Status indicators */}
        <div className="flex items-center space-x-4 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-muted-foreground">
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          {isPaused && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-muted-foreground">Paused</span>
            </div>
          )}
          
          {isTimeUp && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Time's up</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
