# Cleyverse Payment Methods System - Complete Guide

## 🎯 **Overview**
The Cleyverse Payment Methods System provides intelligent payment method selection based on currency, country, and amount. This ensures customers see the most relevant and cost-effective payment options for their location and currency.

## 🚀 **What's Been Implemented**

### ✅ **Smart Payment Method Selection**
- **Currency-based Filtering** - Shows methods that support the selected currency
- **Country-based Filtering** - Shows methods available in the customer's country
- **Regional Recommendations** - Automatically recommends the best method for the region
- **Fee Transparency** - Shows exact fees for each payment method
- **Method Details** - Provides descriptions, features, and supported payment types

### ✅ **Payment Processor Support**
- **Paystack** - Primary for Africa (NG, GH, KE, ZA, etc.)
- **Stripe** - Primary for Global (US, EU, UK, CA, AU)
- **PayPal** - Global alternative with buyer protection
- **Razorpay** - Primary for India
- **Flutterwave** - Alternative for Africa
- **Coinbase Commerce** - Cryptocurrency payments
- **BitPay** - Bitcoin payments

## 📋 **API Endpoints**

### **Get Payment Methods**
```bash
# Get methods by currency and country
GET /payment-methods?currency=NGN&country=NG&amount=1000

# Get methods by currency only
GET /payment-methods?currency=USD

# Get methods by country only
GET /payment-methods?country=US

# Get all available methods
GET /payment-methods
```

### **Response Format**
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

## 🌍 **Regional Payment Method Mapping**

### **Africa (Paystack Primary)**
- **Nigeria (NG)** → Paystack (1.5% fee)
- **Ghana (GH)** → Paystack (2.0% fee)
- **Kenya (KE)** → Paystack (2.0% fee)
- **South Africa (ZA)** → Paystack (2.5% fee)
- **Uganda (UG)** → Paystack (2.0% fee)
- **Tanzania (TZ)** → Paystack (2.0% fee)
- **Zambia (ZM)** → Paystack (2.0% fee)
- **Rwanda (RW)** → Paystack (2.0% fee)

**Supported Methods:** Card, Bank Transfer, Mobile Money, USSD, QR Code

### **North America (Stripe Primary)**
- **United States (US)** → Stripe (2.9% + $0.30)
- **Canada (CA)** → Stripe (2.9% + $0.30)

**Supported Methods:** Card, Bank Transfer, Digital Wallet

### **Europe (Stripe Primary)**
- **European Union (EU)** → Stripe (2.9% + €0.25)
- **United Kingdom (UK)** → Stripe (2.9% + £0.20)

**Supported Methods:** Card, Bank Transfer, Digital Wallet

### **Asia Pacific (Stripe Primary)**
- **Australia (AU)** → Stripe (2.9% + $0.30)
- **India (IN)** → Razorpay (2.0% fee)

**Supported Methods:** Card, Bank Transfer, Digital Wallet, UPI (India)

### **Global Alternatives**
- **PayPal** → 3.49% + fixed fee (Global)
- **Coinbase Commerce** → 1.0% fee (Crypto)
- **BitPay** → 1.0% fee (Bitcoin)

## 💰 **Fee Structure by Currency**

### **Paystack Fees (Africa)**
- **NGN (Nigeria)** → 1.5% + ₦0
- **GHS (Ghana)** → 2.0% + ₵0
- **KES (Kenya)** → 2.0% + KSh0
- **ZAR (South Africa)** → 2.5% + R0
- **Other African currencies** → 2.0% + local currency

### **Stripe Fees (Global)**
- **USD (United States)** → 2.9% + $0.30
- **EUR (Europe)** → 2.9% + €0.25
- **GBP (United Kingdom)** → 2.9% + £0.20
- **CAD (Canada)** → 2.9% + $0.30
- **AUD (Australia)** → 2.9% + $0.30

### **Other Processors**
- **PayPal** → 3.49% + fixed fee (varies by currency)
- **Razorpay (India)** → 2.0% + ₹0
- **Flutterwave (Africa)** → 1.4% + local currency
- **Coinbase Commerce** → 1.0% + $0
- **BitPay** → 1.0% + $0

## 🎨 **Frontend Implementation**

### **Payment Method Selector Component**
```javascript
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

### **CSS Styling Example**
```css
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-method:hover {
  border-color: #3b82f6;
  background-color: #f8fafc;
}

.payment-method.selected {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.payment-method img {
  width: 48px;
  height: 48px;
  margin-right: 1rem;
}

.method-info {
  flex: 1;
}

.method-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.method-info p {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.method-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.method-type {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.fees {
  font-weight: 600;
  color: #059669;
}

.recommended {
  background-color: #10b981;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}
```

## 🧪 **Testing Examples**

### **1. Test Nigerian Payment Methods**
```bash
curl -X GET "http://localhost:3000/payment-methods?currency=NGN&country=NG&amount=1000"
```

**Expected Response:** Paystack as recommended method with 1.5% fee

### **2. Test US Payment Methods**
```bash
curl -X GET "http://localhost:3000/payment-methods?currency=USD&country=US&amount=100"
```

**Expected Response:** Stripe as recommended method with 2.9% + $0.30 fee

### **3. Test Indian Payment Methods**
```bash
curl -X GET "http://localhost:3000/payment-methods?currency=INR&country=IN&amount=1000"
```

**Expected Response:** Razorpay as recommended method with 2.0% fee

### **4. Test Global Currency (No Country)**
```bash
curl -X GET "http://localhost:3000/payment-methods?currency=EUR&amount=100"
```

**Expected Response:** Multiple methods including Stripe and PayPal

## 🔄 **Integration with Order System**

### **Updated Order Creation Flow**
1. **Customer selects currency** → Frontend calls payment methods API
2. **Show payment options** → Display available methods with fees
3. **Customer selects method** → Store selected method in order
4. **Create order** → Include payment method in order creation
5. **Process payment** → Use selected payment processor

### **Order Creation with Payment Method**
```javascript
const createOrder = async (orderData, selectedPaymentMethod) => {
  const response = await fetch(`/api/stores/${storeId}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(userToken && { 'Authorization': `Bearer ${userToken}` })
    },
    body: JSON.stringify({
      ...orderData,
      paymentMethod: selectedPaymentMethod.processor
    })
  });

  return response.json();
};
```

## 🚀 **Key Features**

### ✅ **Smart Recommendations**
- **Regional Optimization** - Best method for each region
- **Fee Optimization** - Lowest fees for the currency
- **Feature Matching** - Methods that support required features
- **Availability Check** - Only show methods available in the region

### ✅ **Transparent Pricing**
- **Real-time Fees** - Exact fees for each method
- **Currency-specific** - Fees in the customer's currency
- **No Hidden Costs** - All fees clearly displayed
- **Comparison Ready** - Easy to compare options

### ✅ **User Experience**
- **Auto-selection** - Recommended method pre-selected
- **Visual Indicators** - Icons and descriptions for each method
- **Feature Highlights** - Key features of each payment method
- **Responsive Design** - Works on all devices

## 📱 **Mobile Considerations**

### **Mobile Payment Methods**
- **Mobile Money** - Popular in Africa (Paystack)
- **Digital Wallets** - Apple Pay, Google Pay (Stripe)
- **QR Codes** - Quick payment scanning
- **USSD** - No internet required (Paystack)

### **Mobile UX**
- **Touch-friendly** - Large tap targets
- **Swipe Selection** - Easy method switching
- **Quick Selection** - One-tap recommended method
- **Offline Support** - Cached payment methods

## 🔮 **Future Enhancements**

### **Planned Features**
1. **Dynamic Fees** - Real-time fee calculation based on amount
2. **A/B Testing** - Test different method presentations
3. **Analytics** - Track method selection and conversion rates
4. **Localization** - Method names and descriptions in local languages
5. **Fraud Scoring** - Recommend methods based on risk assessment
6. **Loyalty Integration** - Preferred methods for returning customers

### **Additional Processors**
- **Square** - For US small businesses
- **Adyen** - For enterprise customers
- **Mollie** - For European markets
- **Paddle** - For software sales
- **Gumroad** - For digital products

---

**The Cleyverse Payment Methods System is now fully operational and provides intelligent payment method selection for customers worldwide! 🌍💳**

**Frontend teams can now show customers the most relevant and cost-effective payment options based on their location and currency! 🚀**
