import React, { useContext, useState } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';

// Updated interfaces to match the actual data structure
interface Order {
  cartData: CartStructure;
  item_id: string;
  date: Date;
  address: string;
  payment_mode: string;
  totalCost: number;
  status: string;
}

interface CartStructure {
  [key: string]: { [key2: string]: number };
}

const Orders = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { ordered, products } = useContext(ShopContext);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-700 bg-green-50 border-green-200';
      case 'shipped': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'processing': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'cancelled': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'shipped':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        );
      case 'processing':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'cancelled':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Helper function to convert cartData to display items
  const getOrderItems = (cartData: CartStructure) => {
    const items = [];
    for (const itemId in cartData) {
      const product = products.find(p => p._id === itemId);
      if (product) {
        for (const size in cartData[itemId]) {
          const quantity = cartData[itemId][size];
          if (quantity > 0) {
            items.push({
              name: product.name,
              size: size,
              quantity: quantity,
              price: product.price * quantity,
              image: product.image[0] // Assuming first image
            });
          }
        }
      }
    }
    return items;
  };

  const filteredOrders = activeTab === 'all'
    ? ordered
    : ordered.filter(order => order.status === activeTab);

  const formatDate = (dateInput: Date) => {
    return dateInput.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='mt-25 border-t-1 border-gray-200'>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-stone-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-sm text-gray-900 mb-2 text-4xl">
              <Title text1={"MY "} text2={"ORDERS"} />
            </h1>
            <p className="text-gray-600 text-lg">Track and manage your clothing orders</p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200 bg-white rounded-t-lg">
              <nav className="flex space-x-8 px-6 py-4">
                {[
                  { key: 'all', label: 'All Orders', count: ordered.length },
                  { key: 'processing', label: 'Processing', count: ordered.filter(o => o.status === 'processing').length },
                  { key: 'shipped', label: 'Shipped', count: ordered.filter(o => o.status === 'shipped').length },
                  { key: 'delivered', label: 'Delivered', count: ordered.filter(o => o.status === 'delivered').length }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`relative pb-2 text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab.key
                        ? 'text-gray-900 border-b-2 border-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.key
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.map(order => {
              const orderItems = getOrderItems(order.cartData);
              return (
                <div
                  key={order.item_id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Order {order.item_id}</h3>
                        <p className="text-gray-600">{formatDate(order.date)}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                        <span className="text-lg font-bold text-gray-900">₹{order.totalCost}</span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                      {orderItems.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">Size: {item.size} • Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                      <div className="flex space-x-4 text-sm text-gray-600">
                        <span>📍 {order.address}</span>
                        <span>💳 {order.payment_mode}</span>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            </div>
          )}

          {/* Order Detail Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                  <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
                      <p className="text-sm text-gray-600">Order ID: {selectedOrder.item_id}</p>
                      <p className="text-sm text-gray-600">Date: {formatDate(selectedOrder.date)}</p>
                      <p className="text-sm text-gray-600">Status: <span className="capitalize">{selectedOrder.status}</span></p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Billing Summary</h3>
                      <p className="text-sm text-gray-600">Subtotal: ₹{selectedOrder.totalCost}</p>
                      <p className="text-sm text-gray-600">Shipping: Free</p>
                      <p className="font-semibold text-gray-900">Total: ₹{selectedOrder.totalCost}</p>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-4">Items Ordered</h3>
                  <div className="space-y-4">
                    {getOrderItems(selectedOrder.cartData).map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Size: {item.size} • Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Delivery Address</h4>
                        <p className="text-gray-600">{selectedOrder.address}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Payment Method</h4>
                        <p className="text-gray-600">{selectedOrder.payment_mode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;