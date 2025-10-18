# Cleyverse Public Shop Order API - Frontend Integration Guide

## 🎯 **Overview**
This documentation is specifically for the **Public Frontend Team** building customer-facing shop pages (like `cley.me/username` or `store.cley.me/store-url`). This covers the customer shopping experience.

## 🛒 **Customer Shopping Flow**

### **1. Browse Products**
```bash
# Get store info
GET /stores/public/{storeUrl}
# Response: Store details, owner info

# Get store products
GET /stores/public/{storeUrl}/products
# Response: List of products with variants

# Get specific product
GET /stores/public/{storeUrl}/products/{productHandle}
# Response: Product details, variants, images
```

### **2. Guest Checkout (No Registration Required)**
```bash
POST /stores/{storeId}/orders
Content-Type: application/json

{
  "items": [
    {
      "productId": "uuid",
      "variantId": "uuid", // optional
      "quantity": 2
    }
  ],
  "customer": {
    "email": "customer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  },
  "shippingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "billingAddress": {
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "customerNotes": "Please deliver after 5 PM",
  "useShippingAsBilling": true
}
```

**Response:**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "uuid",
    "orderNumber": "ORD-ABC123",
    "status": "pending",
    "total": 50.00,
    "currency": "USD",
    "customerEmail": "customer@example.com"
  },
  "payment": {
    "authorizationUrl": "https://checkout.paystack.com/...",
    "accessCode": "access_code",
    "reference": "payment_reference"
  }
}
```

### **3. Authenticated Checkout (If User is Logged In)**
```bash
POST /stores/{storeId}/orders/authenticated
Authorization: Bearer JWT_TOKEN
Content-Type: application/json

# Same payload as guest checkout
```

### **4. Order Tracking**
```bash
# Track Order (Guest - No Auth Required)
GET /orders/track?email=customer@example.com&orderNumber=ORD-ABC123

# Get User Orders (Authenticated Users)
GET /orders
Authorization: Bearer JWT_TOKEN

# Get Specific Order (Authenticated Users)
GET /orders/{orderId}
Authorization: Bearer JWT_TOKEN
```

## 💳 **Payment Integration**

### **Get Available Payment Methods**
```bash
# Get payment methods by currency
GET /payment-methods?currency=NGN&country=NG&amount=1000

# Get payment methods by country
GET /payment-methods?country=US&currency=USD

# Get all available methods
GET /payment-methods
```

**Response:**
```json
{
  "message": "Payment methods retrieved successfully",
  "currency": "NGN",
  "country": "NG",
  "amount": 1000,
  "methods": [
    {
      "processor": "paystack",
      "name": "Paystack",
      "priority": 1,
      "methods": ["card", "bank_transfer", "mobile_money", "ussd", "qr_code"],
      "features": ["instant_settlement", "low_fees", "local_banking"],
      "fees": {
        "percentage": 1.5,
        "fixed": 0,
        "currency": "NGN"
      },
      "icon": "https://paystack.com/assets/img/paystack-logo.png",
      "description": "Fast and secure payments for Africa. Supports cards, bank transfers, and mobile money.",
      "supportedCurrencies": ["NGN", "GHS", "KES", "ZAR", "UGX", "TZS", "ZMW", "RWF"],
      "supportedRegions": ["NG", "GH", "KE", "ZA", "UG", "TZ", "ZM", "RW"],
      "isRecommended": true
    }
  ],
  "recommended": {
    "processor": "paystack",
    "name": "Paystack",
    "priority": 1,
    "methods": ["card", "bank_transfer", "mobile_money", "ussd", "qr_code"],
    "features": ["instant_settlement", "low_fees", "local_banking"],
    "fees": {
      "percentage": 1.5,
      "fixed": 0,
      "currency": "NGN"
    },
    "isRecommended": true
  }
}
```

### **Payment Flow**
1. **Get Payment Methods** → Show available options to customer
2. **Create Order** → Get payment URL for selected method
3. **Redirect Customer** → To payment processor checkout
4. **Payment Success** → Redirect back to success page
5. **Payment Failure** → Redirect back to failure page

### **Payment Response Handling**
```javascript
// After order creation
const { payment } = response;

if (payment.authorizationUrl) {
  // Redirect to Paystack
  window.location.href = payment.authorizationUrl;
} else {
  // Handle error
  console.error('Payment initialization failed');
}
```

### **Payment Callback URLs**
- **Success URL**: `https://yourdomain.com/order/success?reference={reference}`
- **Failure URL**: `https://yourdomain.com/order/failed?reference={reference}`

## 📱 **Frontend Implementation Examples**

### **Payment Method Selection Component**
```javascript
// Payment method selection
const PaymentMethodSelector = ({ currency, country, amount }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentMethods();
  }, [currency, country, amount]);

  const fetchPaymentMethods = async () => {
    try {
      const params = new URLSearchParams();
      if (currency) params.append('currency', currency);
      if (country) params.append('country', country);
      if (amount) params.append('amount', amount);

      const response = await fetch(`/api/payment-methods?${params}`);
      const data = await response.json();
      
      setPaymentMethods(data.methods);
      setSelectedMethod(data.recommended);
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading payment methods...</div>;

  return (
    <div className="payment-methods">
      <h3>Choose Payment Method</h3>
      
      {paymentMethods.map((method) => (
        <div 
          key={method.processor}
          className={`payment-method ${selectedMethod?.processor === method.processor ? 'selected' : ''}`}
          onClick={() => setSelectedMethod(method)}
        >
          <img src={method.icon} alt={method.name} />
          <div className="method-info">
            <h4>{method.name}</h4>
            <p>{method.description}</p>
            <div className="method-features">
              {method.methods.map(methodType => (
                <span key={methodType} className="method-type">
                  {methodType.replace('_', ' ')}
                </span>
              ))}
            </div>
            <div className="fees">
              {method.fees.percentage}% + {method.fees.fixed} {method.fees.currency}
            </div>
            {method.isRecommended && (
              <span className="recommended">Recommended</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### **React/Vue/Angular Checkout Component**
```javascript
// Checkout form submission
const handleCheckout = async (formData) => {
  try {
    const response = await fetch(`/api/stores/${storeId}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if user is logged in
        ...(userToken && { 'Authorization': `Bearer ${userToken}` })
      },
      body: JSON.stringify({
        items: cartItems,
        customer: formData.customer,
        shippingAddress: formData.shipping,
        billingAddress: formData.billing,
        customerNotes: formData.notes,
        paymentMethod: selectedPaymentMethod.processor // Include selected payment method
      })
    });

    const result = await response.json();
    
    if (result.payment.authorizationUrl) {
      // Redirect to payment
      window.location.href = result.payment.authorizationUrl;
    }
  } catch (error) {
    console.error('Checkout failed:', error);
  }
};
```

### **Order Tracking Component**
```javascript
// Track order (guest)
const trackOrder = async (email, orderNumber) => {
  try {
    const response = await fetch(
      `/api/orders/track?email=${email}&orderNumber=${orderNumber}`
    );
    const order = await response.json();
    return order;
  } catch (error) {
    console.error('Order tracking failed:', error);
  }
};

// Get user orders (authenticated)
const getUserOrders = async (token) => {
  try {
    const response = await fetch('/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const orders = await response.json();
    return orders;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
};
```

## 🎨 **UI/UX Considerations**

### **Checkout Flow**
1. **Cart Review** → Show items, quantities, prices
2. **Customer Info** → Email, name, phone (required)
3. **Shipping Address** → Full address details
4. **Billing Address** → Can use shipping address
5. **Order Summary** → Final review before payment
6. **Payment** → Redirect to Paystack
7. **Confirmation** → Order success/failure page

### **Order Tracking**
- **Guest Users**: Email + Order Number form
- **Authenticated Users**: Order history page
- **Order Status**: Visual status indicators
- **Tracking Info**: Show tracking number when available

## 🔒 **Security & Validation**

### **Client-Side Validation**
- **Email Format** → Valid email required
- **Required Fields** → Customer info, shipping address
- **Quantity Limits** → Prevent negative quantities
- **Price Validation** → Use server prices, not client prices

### **Error Handling**
```javascript
// Handle API errors
const handleApiError = (error) => {
  if (error.status === 400) {
    // Validation error - show field errors
    setFieldErrors(error.details);
  } else if (error.status === 404) {
    // Product not found
    setError('Product no longer available');
  } else if (error.status === 500) {
    // Server error
    setError('Something went wrong. Please try again.');
  }
};
```

## 📊 **Analytics & Tracking**

### **E-commerce Events**
```javascript
// Track checkout events
gtag('event', 'begin_checkout', {
  currency: 'USD',
  value: orderTotal,
  items: cartItems.map(item => ({
    item_id: item.productId,
    item_name: item.title,
    quantity: item.quantity,
    price: item.price
  }))
});

// Track purchase completion
gtag('event', 'purchase', {
  transaction_id: orderNumber,
  currency: 'USD',
  value: orderTotal,
  items: orderItems
});
```

## 🧪 **Testing Examples**

### **1. Create Guest Order**
```bash
curl -X POST http://localhost:3000/stores/STORE_ID/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "PRODUCT_ID",
        "quantity": 1
      }
    ],
    "customer": {
      "email": "test@example.com",
      "firstName": "Test",
      "lastName": "User"
    },
    "shippingAddress": {
      "address": "123 Test St",
      "city": "Test City",
      "state": "TS",
      "postalCode": "12345",
      "country": "USA"
    }
  }'
```

### **2. Track Order**
```bash
curl -X GET "http://localhost:3000/orders/track?email=test@example.com&orderNumber=ORD-ABC123"
```

## 🚀 **Key Features for Public Frontend**

### ✅ **Customer Features**
- **Guest Checkout** - No registration required
- **Product Browsing** - View products, variants, images
- **Order Tracking** - Track orders via email + order number
- **Payment Processing** - Seamless Paystack integration
- **Order History** - For authenticated users
- **Responsive Design** - Mobile-friendly checkout

### ✅ **Technical Features**
- **SSR Compatible** - Works with Next.js, Nuxt.js, etc.
- **Error Handling** - Comprehensive error responses
- **Loading States** - Proper loading indicators
- **Form Validation** - Client and server-side validation
- **Payment Security** - Secure payment processing

---

**This documentation is specifically for the Public Frontend Team building customer-facing shop pages! 🛒**

**Send this to your Public Frontend Team for customer shopping experience implementation! 🚀**
