import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Event } from '../interface/event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  httpClient = inject(HttpClient);
  constructor() { }
  baseUrl = 'http://localhost:3000';

  postEvent(event: Event) {
    return this.httpClient.post<Event>(`${this.baseUrl}/events`, event);
  }
  getEvent() {
    return this.httpClient.get<Event[]>(`${this.baseUrl}/events`);
  }
  getEventById(id: number) {
    return this.httpClient.get<Event>(`${this.baseUrl}/events/${id}`);
  }
  deleteEventById(id: number) {
    return this.httpClient.delete<Event>(`${this.baseUrl}/events/${id}`)
  }
}
