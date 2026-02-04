// Mock WebSocket for real-time sensor updates
class MockSocket {
  constructor() {
    this.listeners = {};
    this.connected = false;
    this.intervalId = null;
  }

  connect() {
    if (this.connected) return;

    this.connected = true;
    console.log('Mock Socket connected');

    // Simulate real-time sensor updates every 3 seconds
    this.intervalId = setInterval(() => {
      // Machine sensor updates
      const machineUpdates = [
        {
          machine_id: 1,
          asset_id: 'CNC-001',
          sensors: {
            temperature: 70 + Math.random() * 5,
            vibration: 0.18 + Math.random() * 0.1,
            pressure: 95 + Math.random() * 5,
            rpm: 3450 + Math.random() * 100,
          },
          timestamp: new Date().toISOString(),
        },
        {
          machine_id: 2,
          asset_id: 'PUMP-023',
          sensors: {
            temperature: 83 + Math.random() * 5,
            vibration: 0.75 + Math.random() * 0.15,
            pressure: 100 + Math.random() * 5,
            flow_rate: 43 + Math.random() * 5,
          },
          timestamp: new Date().toISOString(),
        },
        {
          machine_id: 3,
          asset_id: 'ENGINE-012',
          sensors: {
            temperature: 90 + Math.random() * 5,
            vibration: 1.1 + Math.random() * 0.2,
            pressure: 108 + Math.random() * 5,
            rpm: 1780 + Math.random() * 50,
          },
          timestamp: new Date().toISOString(),
        },
      ];

      // Emit updates for each machine
      machineUpdates.forEach((update) => {
        this.emit('machine_update', update);
      });

      // Occasionally emit alerts (10% chance)
      if (Math.random() < 0.1) {
        this.emit('new_alert', {
          id: Date.now(),
          type: 'threshold',
          severity: Math.random() > 0.5 ? 'warning' : 'critical',
          machine_id: machineUpdates[Math.floor(Math.random() * machineUpdates.length)].machine_id,
          message: 'Sensor threshold exceeded',
          timestamp: new Date().toISOString(),
        });
      }
    }, 3000);

    this.emit('connected', { status: 'connected' });
  }

  disconnect() {
    if (!this.connected) return;

    this.connected = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('Mock Socket disconnected');
    this.emit('disconnected', { status: 'disconnected' });
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;

    if (callback) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    } else {
      delete this.listeners[event];
    }
  }

  emit(event, data) {
    if (!this.listeners[event]) return;

    this.listeners[event].forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in socket listener for ${event}:`, error);
      }
    });
  }

  isConnected() {
    return this.connected;
  }
}

// Singleton instance
let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = new MockSocket();
  }
  return socketInstance;
};

export const connectSocket = () => {
  const socket = getSocket();
  socket.connect();
  return socket;
};

export const disconnectSocket = () => {
  const socket = getSocket();
  socket.disconnect();
};

export default {
  getSocket,
  connectSocket,
  disconnectSocket,
};
