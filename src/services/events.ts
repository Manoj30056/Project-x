/**
 * Event Service
 * 
 * API calls for event management.
 */

import { api } from "./api";
import { API_ROUTES } from "@/constants/routes";
import type {
  CreateEventRequest,
  CreateEventResponse,
  GetEventResponse,
  UpdateEventRequest,
  GenerateQRResponse,
  JoinEventRequest,
  JoinEventResponse,
} from "@/types/api";
import type { Event, EventMember } from "@/types/database";

export const eventService = {
  /**
   * Create a new event
   */
  async create(data: CreateEventRequest) {
    return api.post<CreateEventResponse>(API_ROUTES.events, data);
  },
  
  /**
   * Get event by ID
   */
  async getById(id: string) {
    return api.get<GetEventResponse>(API_ROUTES.event(id));
  },
  
  /**
   * Get event by access code
   */
  async getByCode(code: string) {
    return api.get<{ event: Event }>(`${API_ROUTES.events}?code=${encodeURIComponent(code)}`);
  },
  
  /**
   * Update event
   */
  async update(id: string, data: UpdateEventRequest) {
    return api.patch<{ event: Event }>(API_ROUTES.event(id), data);
  },
  
  /**
   * Delete event
   */
  async delete(id: string) {
    return api.delete<{ success: boolean }>(API_ROUTES.event(id));
  },
  
  /**
   * Join event
   */
  async join(id: string, data: Omit<JoinEventRequest, "accessCode">) {
    return api.post<JoinEventResponse>(API_ROUTES.eventJoin(id), data);
  },
  
  /**
   * Leave event
   */
  async leave(id: string, memberId: string) {
    return api.delete<{ success: boolean }>(`${API_ROUTES.eventMembers(id)}/${memberId}`);
  },
  
  /**
   * Get event members
   */
  async getMembers(id: string) {
    return api.get<{ members: EventMember[] }>(API_ROUTES.eventMembers(id));
  },
  
  /**
   * Generate QR code
   */
  async generateQR(id: string) {
    return api.get<GenerateQRResponse>(API_ROUTES.eventQR(id));
  },
  
  /**
   * End event
   */
  async end(id: string) {
    return api.patch<{ event: Event }>(API_ROUTES.event(id), { isActive: false });
  },
  
  /**
   * Reopen event
   */
  async reopen(id: string) {
    return api.patch<{ event: Event }>(API_ROUTES.event(id), { isActive: true });
  },
};
