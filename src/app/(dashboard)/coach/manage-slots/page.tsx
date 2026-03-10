'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
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

export default function ManageSlotsPage() {
  const { data: session } = useSession();
  const [slots, setSlots] = useState<SessionSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSlot, setEditingSlot] = useState<SessionSlot | Partial<SessionSlot> | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchSlots();
    }
  }, [session]);

  const fetchSlots = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/slots');
      if (res.ok) {
        const data = await res.json();
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-10 w-10 text-slate-200 animate-spin" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Loading Availability</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="space-y-1">
          <Link href="/coach/my-sessions" className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-4 group">
            <ArrowLeft className="w-3 h-3 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Availability Management
          </h1>
          <p className="text-slate-400 font-medium text-sm">
            Control your sessions, pricing, and schedule.
          </p>
        </div>
        
        <Button onClick={() => setEditingSlot({})} className="bg-slate-900 hover:bg-black text-white font-black px-6 py-6 rounded-2xl h-auto flex items-center gap-2 transition-all">
          <Plus className="h-5 w-5" />
          <span>New Session Slot</span>
        </Button>
      </div>

      {/* Slots Table */}
      <div className="space-y-6">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Your Scheduled Availability</h2>
        {slots.length > 0 ? (
          <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Session Title</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Investment</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Capacity</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {slots.map((slot) => (
                  <tr key={slot.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5 text-sm">
                      <div>
                        <p className="font-bold text-slate-900 mb-1">{slot.title}</p>
                        <Badge className={cn(
                          "border-none px-2 py-0.5 font-bold uppercase text-[7px] rounded-sm",
                          slot.status === 'available' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                        )}>
                          {slot.status}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-0.5 text-xs font-bold text-slate-600">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-2 opacity-30" />
                          {new Date(slot.startTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-2 opacity-30" />
                          {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-slate-900">${slot.price}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center text-xs font-bold text-slate-400">
                        <Users className="w-3.5 h-3.5 mr-2 opacity-20" />
                        {slot.currentParticipants} / {slot.maxParticipants}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-all" onClick={() => setEditingSlot(slot)} disabled={!!isActionLoading}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all" onClick={() => handleDuplicateSlot(slot)} disabled={!!isActionLoading}>
                          {isActionLoading === slot.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all" onClick={() => handleDeleteSlot(slot.id)} disabled={!!isActionLoading || slot.currentParticipants > 0}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-100">
            <p className="text-slate-400 font-bold text-sm">No session slots created yet.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editingSlot} onOpenChange={(open) => !open && setEditingSlot(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-transparent shadow-none">
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
