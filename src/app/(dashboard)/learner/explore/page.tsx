'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Sparkles,
  Target,
  BookOpen
} from 'lucide-react';

import PackageCard, { Slot } from '@/components/coach/PackageCard';
import { useSlots, useDebounce } from '@/hooks';
import { Loader2, AlertCircle } from 'lucide-react';

const categories = [
  { name: 'All' },
  { name: 'Business' },
  { name: 'Technology' },
  { name: 'Design' },
  { name: 'Marketing' },
  { name: 'Leadership' },
];

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const { data, loading, error } = useSlots({
    search: debouncedSearch,
    category: selectedCategory,
    limit: 20
  });

  const slots = data?.slots || [];
  const totalSlots = data?.pagination?.total || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header Section */}
      <div className="pt-16 pb-10 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3 mr-2" />
            Discover Elite Mentorship
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Find the perfect coach to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">accelerate your career</span>
          </h1>
          {totalSlots > 0 && (
            <p className="text-blue-600 font-black text-sm uppercase tracking-widest">{totalSlots} Training Packages Available</p>
          )}
          <p className="text-base text-slate-500 max-w-2xl mx-auto font-bold">
            Learn from industry leaders at Google, Meta, Airbnb, and more through 1-on-1 personalized sessions.
          </p>
          
          <div className="relative max-w-xl mx-auto pt-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none pt-6">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input 
              type="text"
              placeholder="Search by topic, company, or expertise..."
              className="pl-10 pr-28 h-14 bg-white border-slate-200 shadow-lg rounded-xl text-base focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button size="sm" className="absolute right-1.5 top-1/2 -translate-y-1/2 mt-3 h-10 px-4 bg-slate-900 hover:bg-black text-white rounded-lg font-black text-xs cursor-pointer">
              <Filter className="w-3 h-3 mr-2 cursor-pointer" />
              Filters
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                className={`rounded-lg px-4 py-2 font-black text-[12px] transition-all h-9 ${
                  selectedCategory === category.name 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                  : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Slots Grid */}
      <div className="px-6 mb-12">
        {loading && slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-slate-100 shadow-sm">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-bold animate-pulse">Scanning the globe for top training packages...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-red-50/50 backdrop-blur-sm rounded-[2rem] border border-red-100 shadow-sm text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h3>
            <p className="text-red-600 font-medium">We couldn&apos;t load the training packages right now. Please try again.</p>
            <Button variant="outline" className="mt-6 border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-black" onClick={() => window.location.reload()}>
              Retry Connection
            </Button>
          </div>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {slots.map((slot: Slot) => (
              <PackageCard key={slot.id} slot={slot} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-[2rem] border border-slate-100 shadow-sm text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No packages found</h3>
            <p className="text-slate-500 font-bold mb-8">
              We couldn&apos;t find any training packages matching &quot;{searchQuery}&quot; in the {selectedCategory} category. Try broadening your search or choosing a different category.
            </p>
            <Button 
              variant="outline" 
              className="rounded-xl font-black border-slate-200 hover:bg-slate-50 px-8"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 border-0 shadow-2xl text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of learners who are already growing their skills with expert coaches. 
              Book your first session today and unlock your potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-indigo-600 hover:bg-gray-100 font-medium cursor-pointer">
                <Target className="w-4 h-4 mr-2" />
                Find My Perfect Coach
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 cursor-pointer">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse All Categories
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
