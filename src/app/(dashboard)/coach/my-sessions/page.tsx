'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Loader2,
  Sparkles,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import CreateSlotForm from '@/components/coach/CreateSlotForm';

interface SessionSlot {
  id: string;
  title: string;
  startTime: string;
  status: 'available' | 'booked' | 'completed' | 'cancelled' | 'blueprint';
  price: number;
  currentParticipants: number;
  maxParticipants: number;
  description: string;
  duration: number;
  category: string;
  isRecurring: boolean;
}

interface SlotResponse {
  slots: SessionSlot[];
}

export default function MySessionsPage() {
  const { data: session } = useSession();
  const [slots, setSlots] = useState<SessionSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlot, setEditingSlot] = useState<SessionSlot | Partial<SessionSlot> | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchSlots();
    }
    // Availability sync
  }, [session]);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/slots');
      if (res.ok) {
        const data: SlotResponse = await res.json();
        setSlots(data.slots || []);
      }
    } catch (err) {
      console.error('Fetch slots error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm('Are you sure you want to delete this session slot?')) return;
    try {
      setIsActionLoading(slotId);
      const res = await fetch(`/api/slots/${slotId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Slot deleted successfully');
        setSlots(slots.filter(s => s.id !== slotId));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to delete slot');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while deleting');
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleDuplicateSlot = async (slot: SessionSlot) => {
    try {
      setIsActionLoading(slot.id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, currentParticipants, ...rest } = slot;
      const res = await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ ...rest, status: 'available' }]),
      });

      if (res.ok) {
        toast.success('Slot duplicated successfully');
        fetchSlots();
      } else {
        toast.error('Failed to duplicate slot');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred while duplicating');
    } finally {
      setIsActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="mt-4 text-slate-400 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px] font-black">Loading your programmes...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[85vh] w-full mt-2 pb-24 z-0">
      {/* Deep Atmospheric Glass Background Canvas */}
      <div className="absolute inset-0 -z-10 rounded-[3.5rem] overflow-hidden bg-slate-50/20 shadow-[inset_0_0_100px_rgba(0,0,0,0.02)] border border-slate-100/30">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[50%] bg-sky-400/10 blur-[100px] rounded-full mix-blend-overlay" />
        {/* Frost layer */}
        <div className="absolute inset-0 backdrop-blur-[80px] bg-white/40" />
      </div>

      <div className="px-6 md:px-12 pt-14 space-y-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/50 backdrop-blur-2xl rounded-full border border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] mb-2">
               <div className="p-1.5 bg-white/90 rounded-full shadow-sm">
                 <Zap className="h-4 w-4 text-indigo-600" />
               </div>
               <span className="text-xs font-black uppercase tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">Premium Catalog</span>
            </div>
            <h1 className="text-5xl md:text-[5.5rem] font-black text-slate-900 tracking-tighter leading-[1]">
              Programme<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-400 opacity-90">Store.</span>
            </h1>
            <p className="text-slate-600 font-medium text-lg max-w-xl mt-6 leading-relaxed">
              Design fluid, high-impact coaching sessions with an unparalleled aesthetic. Take control of your time.
            </p>
          </div>

          <Button 
            onClick={() => setEditingSlot({})}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-7 py-4 rounded-full h-auto shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] hover:-translate-y-1 border border-white/20 transition-all duration-500 active:scale-95 group flex items-center gap-3 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500" />
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-500 relative z-10">
              <Plus className="h-4 w-4 text-white transition-transform group-hover:rotate-90 duration-500" />
            </div>
            <span className="text-[15px] font-bold tracking-wide relative z-10 pr-2">Design New Slot</span>
          </Button>
        </div>

        {/* Grid Display */}
        {slots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {slots.map((slot) => (
              <Card key={slot.id} className="group relative overflow-hidden rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border-2 border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-700 hover:border-white">
                
                {/* Internal card glass glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/90 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
              <CardContent className="p-6 md:p-7 relative z-10 flex flex-col h-full">
                {/* Header: Status & Actions */}
                <div className="flex justify-between items-center mb-6">
                    <Badge className={cn(
                      "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm transition-all duration-500 border border-white/60 backdrop-blur-md",
                      slot.status === 'available' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-amber-500/10 text-amber-700'
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full mr-2.5 shadow-[0_0_8px_currentColor]", slot.status === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500')} />
                      {slot.status}
                    </Badge>

                    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-xl px-1.5 py-1 rounded-2xl shadow-sm border border-slate-200">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80 rounded-xl transition-all" onClick={() => setEditingSlot(slot)}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-indigo-600 hover:bg-slate-100/80 rounded-xl transition-all" onClick={() => handleDuplicateSlot(slot)} disabled={!!isActionLoading}>
                         {isActionLoading === slot.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-all" onClick={() => handleDeleteSlot(slot.id)} disabled={!!isActionLoading || slot.currentParticipants > 0}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Body: Title */}
                  <h3 className="text-[22px] font-black text-slate-900 tracking-tight leading-[1.2] mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-500 line-clamp-2">
                    {slot.title}
                  </h3>

                  <div className="mt-auto">
                      {/* Details Rows in Glass */}
                      <div className="space-y-2.5 mb-6">
                          <div className="flex items-center justify-between p-3.5 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/50 group-hover:bg-white/90 transition-colors duration-500 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                              <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white/80 rounded-[0.6rem] shadow-sm border border-slate-100">
                                      <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Date</span>
                              </div>
                              <p className="text-[13px] font-bold text-slate-800">
                                  {new Date(slot.startTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                              </p>
                          </div>

                          <div className="flex items-center justify-between p-3.5 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/50 group-hover:bg-white/90 transition-colors duration-500 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                              <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white/80 rounded-[0.6rem] shadow-sm border border-slate-100">
                                      <Clock className="h-3.5 w-3.5 text-purple-600" />
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">Time</span>
                              </div>
                              <p className="text-[13px] font-bold text-slate-800">
                                  {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                          </div>
                      </div>

                      {/* Footer: Price & Seats */}
                      <div className="flex items-center justify-between pt-5 border-t border-slate-900/5 group-hover:border-slate-900/10 transition-colors duration-500">
                        <div className="flex items-center gap-4">
                            <div className="h-11 w-11 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 relative overflow-hidden">
                              <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                              <Users className="h-5 w-5 relative z-10" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Capacity</p>
                              <p className="text-sm font-black text-slate-800 tracking-tight">{slot.currentParticipants} <span className="opacity-40">/</span> <span className="text-slate-500">{slot.maxParticipants}</span></p>
                            </div>
                        </div>

                        <div className="text-right flex flex-col items-end">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Investment</p>
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-sm font-black text-indigo-400 mb-1">$</span>
                                <p className="text-[32px] font-black text-slate-900 tracking-tighter leading-none">{slot.price}</p>
                            </div>
                        </div>
                      </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 relative z-10 w-full bg-white/30 backdrop-blur-3xl rounded-[4rem] border-2 border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.05)] flex flex-col items-center overflow-hidden">
              {/* Central Glow in Empty State */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-400/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply border" />
              
              <div className="relative h-24 w-24 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 flex items-center justify-center mb-10 border border-white">
                  <Sparkles className="h-10 w-10 text-indigo-600" />
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-purple-400 rounded-full animate-ping opacity-60" />
              </div>
              <h2 className="text-[40px] md:text-[48px] font-black text-slate-900 mb-6 tracking-tight relative z-10 leading-[1.1]">Your Catalog is Empty</h2>
              <p className="text-slate-600 font-medium text-lg mb-12 max-w-md mx-auto leading-relaxed relative z-10">
                Design breathtaking, high-impact coaching sessions and define your digital presence. The world is waiting.
              </p>
              <Button 
                  onClick={() => setEditingSlot({})}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-10 py-5 rounded-[1.5rem] h-auto shadow-[0_10px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.4)] transition-all active:scale-95 group flex items-center gap-3 relative overflow-hidden z-10"
              >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform duration-300 relative z-10">
                    <Plus className="h-3.5 w-3.5 text-white transition-transform group-hover:rotate-90 duration-300" />
                  </div>
                  <span className="relative z-10 tracking-wide text-[16px]">Start Designing Now</span>
              </Button>
          </div>
        )}
      </div>

      {/* Design Modal */}
      <Dialog open={!!editingSlot} onOpenChange={(open) => !open && setEditingSlot(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden border border-white/40 bg-white/70 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.1)] rounded-[2rem]">
          <VisuallyHidden>
            <DialogTitle>{editingSlot?.id ? 'Edit Session' : 'Create New Session'}</DialogTitle>
          </VisuallyHidden>
          <div className="relative z-10 w-full h-full">
            {editingSlot && editingSlot.id ? (
                <CreateSlotForm 
                initialData={{
                    ...editingSlot,
                    startTime: editingSlot.startTime ? new Date(editingSlot.startTime) : undefined,
                }}
                onSuccess={() => { setEditingSlot(null); fetchSlots(); }}
                onClose={() => setEditingSlot(null)}
                />
            ) : editingSlot && (
                <CreateSlotForm 
                onSuccess={() => { setEditingSlot(null); fetchSlots(); }}
                onClose={() => setEditingSlot(null)}
                />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>

  );
}
