# Cleyverse Creator Dashboard Order API - Store Management Guide

## 🎯 **Overview**
This documentation is specifically for the **Creator Dashboard Frontend Team** building the store management interface. This covers order management, analytics, and store operations.

## 🏪 **Store Management Flow**

### **1. Store Overview Dashboard**
```bash
# Get store orders summary
GET /stores/{storeId}/orders
Authorization: Bearer JWT_TOKEN

# Query parameters
?status=pending&limit=20&offset=0&customerEmail=search@example.com

# Response
{
  "message": "Orders retrieved successfully",
  "orders": [...],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### **2. Order Management**
```bash
# Get specific order details
GET /stores/{storeId}/orders/{orderId}
Authorization: Bearer JWT_TOKEN

# Update order status
PUT /stores/{storeId}/orders/{orderId}/status
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "status": "shipped",
  "trackingNumber": "1Z999AA1234567890",
  "carrier": "UPS",
  "notes": "Package shipped via UPS Ground"
}

# Cancel order
PUT /stores/{storeId}/orders/{orderId}/cancel
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

{
  "reason": "Customer requested cancellation"
}
```

## 📊 **Order Analytics & Reporting**

### **Order Statistics**
```bash
# Get order analytics (you'll need to implement this endpoint)
GET /stores/{storeId}/analytics/orders
Authorization: Bearer JWT_TOKEN

# Expected response structure
{
  "totalOrders": 150,
  "totalRevenue": 12500.00,
  "averageOrderValue": 83.33,
  "ordersByStatus": {
    "pending": 5,
    "confirmed": 25,
    "processing": 15,
    "shipped": 80,
    "delivered": 20,
    "cancelled": 5
  },
  "revenueByMonth": [
    { "month": "2024-01", "revenue": 2500.00, "orders": 30 },
    { "month": "2024-02", "revenue": 3200.00, "orders": 38 }
  ],
  "topProducts": [
    { "productId": "uuid", "title": "Product A", "sales": 45, "revenue": 2250.00 }
  ]
}
```

### **Customer Analytics**
```bash
# Get customer insights
GET /stores/{storeId}/analytics/customers
Authorization: Bearer JWT_TOKEN

# Response
{
  "totalCustomers": 120,
  "newCustomers": 15,
  "returningCustomers": 105,
  "customerLifetimeValue": 104.17,
  "topCustomers": [
    {
      "email": "customer@example.com",
      "totalOrders": 8,
      "totalSpent": 650.00,
      "lastOrderDate": "2024-02-15"
    }
  ]
}
```

## 🎨 **Dashboard UI Components**

### **Order List Component**
```javascript
// Order management table
const OrderManagementTable = () => {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    customerEmail: '',
    dateRange: ''
  });

  const fetchOrders = async () => {
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.customerEmail) queryParams.append('customerEmail', filters.customerEmail);
    
    const response = await fetch(`/api/stores/${storeId}/orders?${queryParams}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setOrders(data.orders);
  };

  const updateOrderStatus = async (orderId, newStatus, trackingInfo) => {
    await fetch(`/api/stores/${storeId}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: newStatus,
        ...trackingInfo
      })
    });
    fetchOrders(); // Refresh list
  };

  return (
    <div>
      {/* Filters */}
      <OrderFilters filters={filters} onFiltersChange={setFilters} />
      
      {/* Orders Table */}
      <OrdersTable 
        orders={orders} 
        onStatusUpdate={updateOrderStatus}
        onOrderSelect={(order) => setSelectedOrder(order)}
      />
    </div>
  );
};
```

### **Order Details Modal**
```javascript
// Order details component
const OrderDetailsModal = ({ order, onClose }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus, trackingInfo) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(order.id, newStatus, trackingInfo);
      onClose();
    } catch (error) {
      console.error('Failed to update order:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="order-details">
        {/* Order Header */}
        <OrderHeader order={order} />
        
        {/* Customer Info */}
        <CustomerInfo customer={order.customer} />
        
        {/* Order Items */}
        <OrderItems items={order.items} />
        
        {/* Shipping Info */}
        <ShippingInfo order={order} />
        
        {/* Payment Info */}
        <PaymentInfo payment={order.payment} />
        
        {/* Status Management */}
        <StatusManagement 
          order={order} 
          onStatusUpdate={handleStatusUpdate}
          isUpdating={isUpdating}
        />
      </div>
    </Modal>
  );
};
```

### **Analytics Dashboard**
```javascript
// Analytics dashboard component
const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    const response = await fetch(`/api/stores/${storeId}/analytics/orders?range=${timeRange}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setAnalytics(data);
  };

  return (
    <div className="analytics-dashboard">
      {/* Key Metrics */}
      <MetricsCards metrics={analytics} />
      
      {/* Revenue Chart */}
      <RevenueChart data={analytics?.revenueByMonth} />
      
      {/* Order Status Chart */}
      <OrderStatusChart data={analytics?.ordersByStatus} />
      
      {/* Top Products */}
      <TopProductsTable products={analytics?.topProducts} />
    </div>
  );
};
```

## 🔄 **Order Status Management**

### **Status Update Flow**
```javascript
// Status update component
const StatusUpdateForm = ({ order, onUpdate }) => {
  const [status, setStatus] = useState(order.status);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updateData = { status };
    
    if (status === 'shipped') {
      updateData.trackingNumber = trackingNumber;
      updateData.carrier = carrier;
    }
    
    if (notes) {
      updateData.notes = notes;
    }

    await onUpdate(updateData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {status === 'shipped' && (
        <>
          <input
            type="text"
            placeholder="Tracking Number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="Carrier (UPS, FedEx, etc.)"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
          />
        </>
      )}

      <textarea
        placeholder="Internal Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button type="submit">Update Status</button>
    </form>
  );
};
```

## 📱 **Mobile Dashboard Considerations**

### **Responsive Order Management**
- **Mobile Table** → Card-based layout for small screens
- **Quick Actions** → Swipe actions for common operations
- **Status Updates** → Simplified status change interface
- **Notifications** → Push notifications for new orders

## 🔔 **Real-time Updates**

### **WebSocket Integration (Future)**
```javascript
// Real-time order updates
const useOrderUpdates = (storeId) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/stores/${storeId}/orders`);
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      if (update.type === 'new_order') {
        setOrders(prev => [update.order, ...prev]);
        showNotification('New order received!');
      } else if (update.type === 'status_update') {
        setOrders(prev => prev.map(order => 
          order.id === update.orderId 
            ? { ...order, status: update.status }
            : order
        ));
      }
    };

    return () => ws.close();
  }, [storeId]);

  return orders;
};
```

## 🧪 **Testing Examples**

### **1. Get Store Orders**
```bash
curl -X GET "http://localhost:3000/stores/STORE_ID/orders?status=pending&limit=10" \
  -H "Authorization: Bearer JWT_TOKEN"
```

### **2. Update Order Status**
```bash
curl -X PUT http://localhost:3000/stores/STORE_ID/orders/ORDER_ID/status \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped",
    "trackingNumber": "1Z999AA1234567890",
    "carrier": "UPS",
    "notes": "Shipped via UPS Ground"
  }'
```

### **3. Cancel Order**
```bash
curl -X PUT http://localhost:3000/stores/STORE_ID/orders/ORDER_ID/cancel \
  -H "Authorization: Bearer JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Customer requested cancellation"
  }'
```

## 🚀 **Key Features for Creator Dashboard**

### ✅ **Store Management Features**
- **Order Dashboard** - Overview of all orders
- **Order Details** - Complete order information
- **Status Management** - Update order statuses
- **Customer Communication** - Order notes and updates
- **Analytics** - Sales and customer insights
- **Inventory Alerts** - Low stock notifications

### ✅ **Technical Features**
- **Real-time Updates** - Live order notifications
- **Bulk Operations** - Process multiple orders
- **Export Functionality** - Export order data
- **Search & Filter** - Find specific orders
- **Mobile Responsive** - Works on all devices
- **Role-based Access** - Different permissions for team members

---

**This documentation is specifically for the Creator Dashboard Frontend Team building store management interfaces! 🏪**

**Send this to your Creator Dashboard Team for store management implementation! 🚀**
