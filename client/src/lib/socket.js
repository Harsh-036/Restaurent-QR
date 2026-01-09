import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      upgrade: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join user-specific room
  joinUserRoom(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-user-room', userId);
    }
  }

  // Join admin room
  joinAdminRoom() {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-admin-room');
    }
  }

  // Listen for menu events
  onMenuCreated(callback) {
    if (this.socket) {
      this.socket.on('menu:created', callback);
    }
  }

  onMenuUpdated(callback) {
    if (this.socket) {
      this.socket.on('menu:updated', callback);
    }
  }

  onMenuDeleted(callback) {
    if (this.socket) {
      this.socket.on('menu:deleted', callback);
    }
  }

  onMenuAvailabilityChanged(callback) {
    if (this.socket) {
      this.socket.on('menu:availabilityChanged', callback);
    }
  }

  // Listen for coupon events
  onCouponCreated(callback) {
    if (this.socket) {
      this.socket.on('coupon:created', callback);
    }
  }

  onCouponUpdated(callback) {
    if (this.socket) {
      this.socket.on('coupon:updated', callback);
    }
  }

  onCouponDeleted(callback) {
    if (this.socket) {
      this.socket.on('coupon:deleted', callback);
    }
  }

  // Listen for order events
  onOrderCreated(callback) {
    if (this.socket) {
      this.socket.on('order:created', callback);
    }
  }

  onOrderStatusUpdated(callback) {
    if (this.socket) {
      this.socket.on('order:statusUpdated', callback);
    }
  }

  // Listen for table events
  onTableCreated(callback) {
    if (this.socket) {
      this.socket.on('table:created', callback);
    }
  }

  onTableUpdated(callback) {
    if (this.socket) {
      this.socket.on('table:updated', callback);
    }
  }

  onTableDeleted(callback) {
    if (this.socket) {
      this.socket.on('table:deleted', callback);
    }
  }

  onTableStatusChanged(callback) {
    if (this.socket) {
      this.socket.on('table:statusChanged', callback);
    }
  }

  // Remove all listeners for a specific event
  off(event, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
