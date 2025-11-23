/**
 * Socket.IO Service
 * Manages real-time WebSocket connections for order updates and kitchen display
 */

import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, fromEvent } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface SocketEvent<T = any> {
  type: string;
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService implements OnDestroy {
  private socket: Socket | null = null;
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  /**
   * Connect to Socket.IO server
   */
  connect(url: string): void {
    if (this.socket?.connected) {
      console.warn('Socket already connected');
      return;
    }

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
    });

    this.setupEventListeners();
  }

  /**
   * Disconnect from Socket.IO server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatusSubject.next(false);
    }
  }

  /**
   * Emit event to server
   */
  emit<T = any>(eventName: string, data: T): void {
    if (!this.socket?.connected) {
      console.warn('Socket not connected. Cannot emit event:', eventName);
      return;
    }

    this.socket.emit(eventName, data);
  }

  /**
   * Listen for events from server
   */
  on<T = any>(eventName: string): Observable<T> {
    if (!this.socket) {
      throw new Error('Socket not initialized. Call connect() first.');
    }

    return fromEvent<T>(this.socket, eventName);
  }

  /**
   * Remove event listener
   */
  off(eventName: string): void {
    if (this.socket) {
      this.socket.off(eventName);
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Setup socket event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket.IO connected');
      this.connectionStatusSubject.next(true);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
      this.connectionStatusSubject.next(false);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      this.connectionStatusSubject.next(false);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket.IO reconnected after', attemptNumber, 'attempts');
      this.connectionStatusSubject.next(true);
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Socket.IO reconnection attempt', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket.IO reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket.IO reconnection failed');
      this.connectionStatusSubject.next(false);
    });
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
