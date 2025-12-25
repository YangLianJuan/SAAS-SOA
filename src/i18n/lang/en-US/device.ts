export default {
  title: 'Devices',
  listTitle: 'Device List',
  columns: {
    name: 'Name',
    status: 'Status',
    actions: 'Details',
  },
  status: {
    online: 'Online',
    offline: 'Offline',
    error: 'Error',
  },
  deviceId: 'ID: {id}',
} as const

