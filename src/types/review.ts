export interface Review {
  _id: string;
  bookingId: string;
  coachId: string;
  learnerId: string;
  
  rating: number; // 1-5
  comment: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReviewRequest {
  bookingId: string;
  rating: number;
  comment: string;
}

export interface ReviewWithDetails extends Review {
  coach: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  learner: {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  booking: {
    _id: string;
    scheduledFor: Date;
    slot: {
      title: string;
      category: string;
    };
  };
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
