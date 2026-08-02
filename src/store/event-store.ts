import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Event, EventMember } from "@/types/database";

interface EventState {
  // Current event
  currentEvent: Event | null;
  members: EventMember[];
  currentMember: EventMember | null;
  
  // Event history (recently viewed)
  recentEvents: Array<{ id: string; name: string; accessCode: string; viewedAt: number }>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setEvent: (event: Event | null) => void;
  setMembers: (members: EventMember[]) => void;
  setCurrentMember: (member: EventMember | null) => void;
  addMember: (member: EventMember) => void;
  removeMember: (memberId: string) => void;
  updateEvent: (updates: Partial<Event>) => void;
  addToRecentEvents: (event: Event) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  currentEvent: null,
  members: [],
  currentMember: null,
  recentEvents: [],
  isLoading: false,
  error: null,
};

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setEvent: (event) => set({ currentEvent: event, error: null }),
      
      setMembers: (members) => set({ members }),
      
      setCurrentMember: (member) => set({ currentMember: member }),
      
      addMember: (member) => set((state) => ({
        members: [...state.members, member],
        currentEvent: state.currentEvent
          ? { ...state.currentEvent, guestCount: (state.currentEvent.guestCount ?? 0) + 1 }
          : null,
      })),
      
      removeMember: (memberId) => set((state) => ({
        members: state.members.filter((m) => m.id !== memberId),
        currentEvent: state.currentEvent
          ? { ...state.currentEvent, guestCount: Math.max(0, (state.currentEvent.guestCount ?? 0) - 1) }
          : null,
      })),
      
      updateEvent: (updates) => set((state) => ({
        currentEvent: state.currentEvent
          ? { ...state.currentEvent, ...updates }
          : null,
      })),
      
      addToRecentEvents: (event) => set((state) => {
        const filtered = state.recentEvents.filter((e) => e.id !== event.id);
        const recent = [
          { id: event.id, name: event.title, accessCode: event.eventCode, viewedAt: Date.now() },
          ...filtered,
        ].slice(0, 10); // Keep last 10
        return { recentEvents: recent };
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error, isLoading: false }),
      
      reset: () => set(initialState),
    }),
    {
      name: "engram-event-store",
      partialize: (state) => ({
        recentEvents: state.recentEvents,
        currentMember: state.currentMember,
      }),
    }
  )
);
