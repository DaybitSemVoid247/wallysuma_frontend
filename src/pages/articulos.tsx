import { useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  category: "comidas" | "cafeteria";
}

interface CartItem extends Product {
  quantity: number;
}

type Quantities = Record<number, number>;

const MenuCompleto = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<Quantities>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"comidas" | "cafeteria">(
    "comidas"
  );
  const [animatingItems, setAnimatingItems] = useState<number[]>([]);

  const comidas: Product[] = [
    {
      id: 1,
      name: "Pizza Margarita",
      description: "Pizza clásica con tomate fresco, mozzarella y albahaca",
      price: 12.99,
      image:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop",
      badge: "Popular",
      category: "comidas",
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
      category: "comidas",
    },
    {
      id: 3,
      name: "Ensalada César",
      description:
        "Lechuga romana, pollo a la parrilla, croutones y aderezo césar",
      price: 9.99,
      image:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=500&fit=crop",
      category: "comidas",
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
      category: "comidas",
    },
    {
      id: 5,
      name: "Tacos al Pastor",
      description: "Tres tacos con carne al pastor, piña, cilantro y cebolla",
      price: 11.99,
      image:
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&h=500&fit=crop",
      category: "comidas",
    },
    {
      id: 6,
      name: "Sushi Variado",
      description: "Selección de 12 piezas de sushi con wasabi y jengibre",
      price: 18.99,
      image:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&h=500&fit=crop",
      badge: "Premium",
      category: "comidas",
    },
  ];

  const cafeteria: Product[] = [
    {
      id: 7,
      name: "Café Americano",
      description: "Café espresso suave con agua caliente",
      price: 3.99,
      image:
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop",
      badge: "Clásico",
      category: "cafeteria",
    },
    {
      id: 8,
      name: "Cappuccino",
      description: "Espresso con espuma de leche cremosa y canela",
      price: 4.99,
      image:
        "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&h=500&fit=crop",
      badge: "Popular",
      category: "cafeteria",
    },
    {
      id: 9,
      name: "Latte Vainilla",
      description: "Café con leche vaporizada y sirope de vainilla",
      price: 5.49,
      image:
        "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=500&h=500&fit=crop",
      category: "cafeteria",
    },
    {
      id: 10,
      name: "Mocha Chocolate",
      description: "Espresso, chocolate, leche y crema batida",
      price: 5.99,
      image:
        "https://images.unsplash.com/photo-1607260550778-aa9d29444ce1?w=500&h=500&fit=crop",
      badge: "Dulce",
      category: "cafeteria",
    },
    {
      id: 11,
      name: "Frappé Caramelo",
      description: "Café helado con caramelo, hielo y crema",
      price: 6.49,
      image:
        "https://images.unsplash.com/photo-1562059390-a761a084768e?w=500&h=500&fit=crop",
      badge: "Frío",
      category: "cafeteria",
    },
    {
      id: 12,
      name: "Croissant",
      description: "Croissant francés mantequilloso recién horneado",
      price: 3.49,
      image:
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&h=500&fit=crop",
      category: "cafeteria",
    },
    {
      id: 13,
      name: "Muffin de Arándanos",
      description: "Muffin esponjoso con arándanos frescos",
      price: 3.99,
      image:
        "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500&h=500&fit=crop",
      category: "cafeteria",
    },
    {
      id: 14,
      name: "Cheesecake",
      description: "Pastel de queso cremoso con base de galleta",
      price: 4.99,
      image:
        "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&h=500&fit=crop",
      badge: "Premium",
      category: "cafeteria",
    },
  ];

  const getQuantity = (productId: number): number => {
    return quantities[productId] || 1;
  };

  const updateQuantity = (productId: number, newQuantity: number): void => {
    if (newQuantity >= 1) {
      setQuantities({ ...quantities, [productId]: newQuantity });
    }
  };

  const addToCart = (product: Product): void => {
    const quantity = getQuantity(product.id);
    const existingIndex = cart.findIndex((item) => item.id === product.id);

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex] = {
        ...newCart[existingIndex],
        quantity: newCart[existingIndex].quantity + quantity,
      };
      setCart(newCart);
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    setQuantities({ ...quantities, [product.id]: 1 });

    // Animación
    setAnimatingItems([...animatingItems, product.id]);
    setTimeout(() => {
      setAnimatingItems((prev) => prev.filter((id) => id !== product.id));
    }, 600);
  };

  const removeFromCart = (productId: number): void => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: number, newQuantity: number): void => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): string => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const currentProducts: Product[] =
    activeTab === "comidas" ? comidas : cafeteria;
  const bgGradient: string =
    activeTab === "comidas"
      ? "linear-gradient(135deg, #dbbdb1 0%, #f0e5de 100%)"
      : "linear-gradient(135deg, #d4a574 0%, #e8d5c4 100%)";
  const accentColor: string = activeTab === "comidas" ? "#d88c6f" : "#8b6f47";

  return (
    <div className="min-h-screen p-5" style={{ background: bgGradient }}>
      <div className="max-w-7xl mx-auto pb-24">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {activeTab === "comidas" ? "Menú" : "Cafetería"}
            </h1>
            <p className="text-gray-600"></p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("comidas")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "comidas"
                  ? "text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={activeTab === "comidas" ? { background: "#d88c6f" } : {}}
            >
              Menú
            </button>
            <button
              onClick={() => setActiveTab("cafeteria")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === "cafeteria"
                  ? "text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={activeTab === "cafeteria" ? { background: "#8b6f47" } : {}}
            >
              Cafetería
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProducts.map((product) => (
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
                    style={{ background: accentColor }}
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
                    style={{ color: accentColor }}
                  >
                    Bs. {product.price}
                  </span>
                  <div
                    className="flex items-center gap-3 rounded-full p-1"
                    style={{
                      background:
                        activeTab === "comidas" ? "#dbbdb1" : "#d4a574",
                    }}
                  >
                    <button
                      onClick={() =>
                        updateQuantity(product.id, getQuantity(product.id) - 1)
                      }
                      className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-bold text-lg transition-all duration-300 hover:scale-105"
                      style={{ color: accentColor }}
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
                      style={{ color: accentColor }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="w-full text-white py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
                  style={{ background: accentColor }}
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

        {/* Carrito flotante */}
        <div
          onClick={() => setShowModal(true)}
          className="fixed bottom-8 right-8 w-20 h-20 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 shadow-2xl z-40"
          style={{
            background: "linear-gradient(135deg, #d88c6f 0%, #c17a5e 100%)",
          }}
        >
          <svg
            className="w-9 h-9 stroke-white fill-none"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 2L7 6H2v15h20V6h-5L15 2H9z" />
            <path d="M9 6v0c0 1.7 1.3 3 3 3s3-1.3 3-3v0" />
          </svg>
          {getTotalItems() > 0 && (
            <span
              className={`absolute -top-2 -right-2 bg-red-500 text-white w-9 h-9 rounded-full flex items-center justify-center text-base font-bold shadow-lg ${
                animatingItems.length > 0 ? "animate-bounce" : ""
              }`}
            >
              {getTotalItems()}
            </span>
          )}
          {animatingItems.length > 0 && (
            <div className="absolute inset-0 rounded-full border-4 border-white animate-ping opacity-75"></div>
          )}
        </div>

        {/* Modal del carrito */}
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
                  <span className="text-2xl items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                    ×
                  </span>
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
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-800">
                              {item.name}
                            </h3>
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {item.category === "comidas" ? "🍕" : "☕"}
                            </span>
                          </div>
                          <p
                            className="text-sm font-bold mb-2"
                            style={{
                              color:
                                item.category === "comidas"
                                  ? "#d88c6f"
                                  : "#8b6f47",
                            }}
                          >
                            {item.price} Bs
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity - 1)
                              }
                              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-sm font-bold hover:bg-gray-200"
                              style={{
                                color:
                                  item.category === "comidas"
                                    ? "#d88c6f"
                                    : "#8b6f47",
                              }}
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
                              style={{
                                color:
                                  item.category === "comidas"
                                    ? "#d88c6f"
                                    : "#8b6f47",
                              }}
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
                            style={{
                              color:
                                item.category === "comidas"
                                  ? "#d88c6f"
                                  : "#8b6f47",
                            }}
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

export default MenuCompleto;
