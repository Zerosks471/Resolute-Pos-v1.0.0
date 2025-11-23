/**
 * Sync Queue Service
 * Manages offline operations queue and syncs when online
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface QueuedOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: number;
  retries: number;
}

@Injectable({
  providedIn: 'root',
})
export class SyncQueueService {
  private readonly QUEUE_KEY = 'offline_sync_queue';
  private queueSubject = new BehaviorSubject<QueuedOperation[]>([]);
  public queue$ = this.queueSubject.asObservable();

  constructor() {
    this.loadQueue();
  }

  /**
   * Add operation to sync queue
   */
  addToQueue(operation: Omit<QueuedOperation, 'id' | 'timestamp' | 'retries'>): void {
    const queue = this.queueSubject.value;
    const newOperation: QueuedOperation = {
      ...operation,
      id: this.generateId(),
      timestamp: Date.now(),
      retries: 0,
    };

    queue.push(newOperation);
    this.queueSubject.next(queue);
    this.saveQueue();
  }

  /**
   * Remove operation from queue
   */
  removeFromQueue(operationId: string): void {
    const queue = this.queueSubject.value.filter((op) => op.id !== operationId);
    this.queueSubject.next(queue);
    this.saveQueue();
  }

  /**
   * Get current queue
   */
  getQueue(): QueuedOperation[] {
    return this.queueSubject.value;
  }

  /**
   * Clear all queued operations
   */
  clearQueue(): void {
    this.queueSubject.next([]);
    this.saveQueue();
  }

  /**
   * Increment retry count for operation
   */
  incrementRetries(operationId: string): void {
    const queue = this.queueSubject.value.map((op) =>
      op.id === operationId ? { ...op, retries: op.retries + 1 } : op
    );
    this.queueSubject.next(queue);
    this.saveQueue();
  }

  /**
   * Load queue from localStorage
   */
  private loadQueue(): void {
    try {
      const stored = localStorage.getItem(this.QUEUE_KEY);
      if (stored) {
        const queue = JSON.parse(stored);
        this.queueSubject.next(queue);
      }
    } catch (e) {
      console.error('Failed to load sync queue:', e);
    }
  }

  /**
   * Save queue to localStorage
   */
  private saveQueue(): void {
    try {
      localStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.queueSubject.value));
    } catch (e) {
      console.error('Failed to save sync queue:', e);
    }
  }

  /**
   * Generate unique ID for operation
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
