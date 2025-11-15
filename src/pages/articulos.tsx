import { useState } from "react";

const Articulos = () => {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showModal, setShowModal] = useState(false);

  const products = [
    {
      id: 1,
      name: "Pizza Margarita",
      description: "Pizza clásica con tomate fresco, mozzarella y albahaca",
      price: 12.99,
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop",
      badge: "Popular",
    },
    {
      id: 2,
      name: "Hamburguesa Gourmet",
      description:
        "Carne angus, queso cheddar, bacon crujiente y salsa especial",
      price: 14.99,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop",
      badge: "Nuevo",
    },
    {
      id: 3,
      name: "Ensalada César",
      description:
        "Lechuga romana, pollo a la parrilla, croutones y aderezo césar",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=500&fit=crop",
    },
    {
      id: 4,
      name: "Pasta Carbonara",
      description:
        "Pasta fresca con panceta, huevo, parmesano y pimienta negra",
      price: 13.99,
      image:
        "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=500&h=500&fit=crop",
      badge: "Chef",
    },
    {
      id: 5,
      name: "Tacos al Pastor",
      description: "Tres tacos con carne al pastor, piña, cilantro y cebolla",
      price: 11.99,
      image:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=500&fit=crop",
    },
    {
      id: 6,
      name: "Sushi Variado",
      description: "Selección de 12 piezas de sushi con wasabi y jengibre",
      price: 18.99,
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=500&fit=crop",
      badge: "Premium",
    },
  ];

  const getQuantity = (productId) => {
    const qty = quantities[productId];
    return qty ? qty : 1;
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      const newQuantities = { ...quantities };
      newQuantities[productId] = newQuantity;
      setQuantities(newQuantities);
    }
  };

  const addToCart = (product) => {
    const quantity = getQuantity(product.id);
    const newCart = [...cart];
    const existingIndex = newCart.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + quantity,
      };
      setCart(newCart);
    } else {
      setCart([...newCart, { ...product, quantity: quantity }]);
    }

    const newQuantities = { ...quantities };
    newQuantities[product.id] = 1;
    setQuantities(newQuantities);
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(newCart);
  };

  const getTotalItems = () => {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].quantity;
    }
    return total;
  };

  const getTotalPrice = () => {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total += cart[i].price * cart[i].quantity;
    }
    return total.toFixed(2);
  };

  return (
    <div
      className="min-h-screen p-5"
      style={{
        background: "linear-gradient(135deg, #dbbdb1 0%, #f0e5de 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 flex justify-between items-center flex-wrap gap-5">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Nuestro Menú
            </h1>
            <p className="text-gray-600">Deliciosos platillos para ti</p>
          </div>
          <div
            onClick={() => setShowModal(true)}
            className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 relative"
            style={{
              background: "#d88c6f",
              boxShadow: "0 4px 15px rgba(216, 140, 111, 0.3)",
            }}
          >
            <svg
              className="w-7 h-7 stroke-white fill-none"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 2L7 6H2v15h20V6h-5L15 2H9z" />
              <path d="M9 6v0c0 1.7 1.3 3 3 3s3-1.3 3-3v0" />
            </svg>
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">
                {getTotalItems()}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative overflow-hidden h-56">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {product.badge && (
                  <span
                    className="absolute top-4 right-4 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg"
                    style={{ background: "#d88c6f" }}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                  {product.description}
                </p>

                <div className="flex justify-between items-center mb-5">
                  <span
                    className="text-3xl font-bold"
                    style={{ color: "#d88c6f" }}
                  >
                    Bs. {product.price}
                  </span>
                  <div
                    className="flex items-center gap-3 rounded-full p-1"
                    style={{ background: "#dbbdb1" }}
                  >
                    <button
                      onClick={() =>
                        updateQuantity(product.id, getQuantity(product.id) - 1)
                      }
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-lg transition-all duration-300 hover:scale-105"
                      style={{ color: "#d88c6f" }}
                    >
                      −
                    </button>
                    <span className="font-semibold text-gray-800 w-8 text-center">
                      {getQuantity(product.id)}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(product.id, getQuantity(product.id) + 1)
                      }
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-lg transition-all duration-300 hover:scale-105"
                      style={{ color: "#d88c6f" }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full text-white py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
                  style={{ background: "#d88c6f" }}
                >
                  <svg
                    className="w-5 h-5 stroke-white fill-none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 2L7 6H2v15h20V6h-5L15 2H9z" />
                    <path d="M9 6v0c0 1.7 1.3 3 3 3s3-1.3 3-3v0" />
                  </svg>
                  Agregar al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="p-6 border-b border-gray-200 flex justify-between items-center"
                style={{ background: "#dbbdb1" }}
              >
                <h2 className="text-2xl font-bold text-gray-800">Tu Carrito</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl text-gray-600">×</span>
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[50vh]">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="w-24 h-24 mx-auto mb-4 stroke-gray-300 fill-none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 2L7 6H2v15h20V6h-5L15 2H9z" />
                      <path d="M9 6v0c0 1.7 1.3 3 3 3s3-1.3 3-3v0" />
                    </svg>
                    <p className="text-gray-500 text-lg">
                      Tu carrito está vacío
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 mb-1">
                            {item.name}
                          </h3>
                          <p
                            className="text-sm font-bold mb-2"
                            style={{ color: "#d88c6f" }}
                          >
                            {item.price} Bs
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-bold hover:bg-gray-200"
                              style={{ color: "#d88c6f" }}
                            >
                              −
                            </button>
                            <span className="font-semibold text-gray-800 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity + 1)
                              }
                              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-bold hover:bg-gray-200"
                              style={{ color: "#d88c6f" }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                          >
                            Eliminar
                          </button>
                          <p
                            className="font-bold text-lg"
                            style={{ color: "#d88c6f" }}
                          >
                            Bs {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div
                  className="p-6 border-t border-gray-200"
                  style={{ background: "#f9f9f9" }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-800">
                      Total:
                    </span>
                    <span
                      className="text-3xl font-bold"
                      style={{ color: "#d88c6f" }}
                    >
                      Bs {getTotalPrice()}
                    </span>
                  </div>
                  <button
                    className="w-full text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-lg"
                    style={{ background: "#d88c6f" }}
                  >
                    Proceder al Pago
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articulos;
