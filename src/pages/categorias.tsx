import { useState, useEffect } from "react";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Module {
  title: string;
  description: string;
  features: string[];
  color: string;
}

interface Stat {
  value: string;
  label: string;
}

const RestaurantLanding = () => {
  const [activeModule, setActiveModule] = useState(0);
  const features: Feature[] = [
    {
      icon: "📱",
      title: "Multiplataforma",
      description:
        "Sistema Web con React y App Móvil en Flutter para acceso desde cualquier dispositivo.",
    },
    {
      icon: "⚡",
      title: "Tiempo Real",
      description:
        "Comunicación instantánea entre cocina y servicio con WebSockets para máxima eficiencia.",
    },
    {
      icon: "📊",
      title: "Análisis Inteligente",
      description:
        "Reportes y estadísticas de ventas con gráficos interactivos para decisiones informadas.",
    },
    {
      icon: "🔒",
      title: "Seguro y Confiable",
      description:
        "Autenticación JWT, encriptación de datos y respaldos automáticos.",
    },
    {
      icon: "🍽️",
      title: "Gestión de Menú",
      description:
        "Actualización dinámica del menú con imágenes, precios y disponibilidad en tiempo real.",
    },
    {
      icon: "👥",
      title: "Multi-Usuario",
      description:
        "Roles diferenciados para clientes, meseros, cocina y administración.",
    },
  ];

  const modules: Module[] = [
    {
      title: "Módulo de Cliente",
      description: "Interfaz moderna y responsive para visualizar el menú",
      features: [
        "Menú digital con imágenes HD",
        "Categorización intuitiva",
        "Información nutricional",
        "Diseño responsive",
      ],
      color: "from-orange-400 to-orange-600",
    },
    {
      title: "Módulo de Meseros",
      description: "Herramientas optimizadas para toma de pedidos",
      features: [
        "Dashboard de mesas",
        "Toma de pedidos rápida",
        "Cálculo automático de totales",
        "Notificaciones de pedidos listos",
      ],
      color: "from-amber-500 to-orange-700",
    },
    {
      title: "Módulo de Cocina",
      description: "Panel eficiente para gestión de preparación",
      features: [
        "Cola de pedidos ordenada",
        "Notificaciones sonoras",
        "Actualización de estados",
        "Indicador de tiempo",
      ],
      color: "from-orange-600 to-red-800",
    },
    {
      title: "Módulo de Cajero",
      description: "Sistema integral de cobros y facturación",
      features: [
        "Generación de tickets de venta",
        "Registro de pagos",
        "Cálculo automático de totales",
        "Historial de transacciones",
      ],
      color: "from-green-600 to-emerald-800",
    },
    {
      title: "Módulo Administrativo",
      description: "Control total del negocio con datos en tiempo real",
      features: [
        "Dashboard con métricas clave",
        "CRUD de productos",
        "Reportes de ventas",
        "Gestión de usuarios",
      ],
      color: "from-amber-700 to-orange-900",
    },
  ];

  const stats: Stat[] = [
    { value: "85%", label: "Requerimientos Implementados" },
    { value: "60%", label: "Reducción de Errores" },
    { value: "40%", label: "Ahorro de Tiempo" },
    { value: "99.2%", label: "Disponibilidad" },
  ];

  const technologies = [
    { name: "React", icon: "⚛️" },
    { name: "Flutter", icon: "📱" },
    { name: "Node.js", icon: "🟢" },
    { name: "MySQL", icon: "🗄️" },
    { name: "Nest.js", icon: "🐈" },
    { name: "Tailwind", icon: "🎨" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                WebCraft
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Sistema Integral de
                <span className="block text-orange-600">
                  Gestión para Restaurantes
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Automatización completa de procesos de compra-venta con análisis
                estadístico en tiempo real. Desarrollado con tecnologías
                modernas para restaurantes en La Paz, Bolivia.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-2xl">
                      📊
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Dashboard</p>
                      <p className="text-sm text-gray-500">Tiempo Real</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Ventas Hoy</p>
                      <p className="text-2xl font-bold text-orange-600">
                        Bs. 2,450
                      </p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Pedidos Activos</p>
                      <p className="text-2xl font-bold text-amber-600">12</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Eficiencia</p>
                      <p className="text-2xl font-bold text-orange-700">95%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 px-6 bg-white border-t border-orange-100">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Qué hace nuestro sistema?
            </h2>
            <p className="text-xl text-gray-600">
              Solución completa para la gestión operativa de restaurantes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gradient-to-br from-orange-50 to-white rounded-2xl border-2 border-orange-200">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center text-2xl mb-4">
                📋
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Gestión de Pedidos
              </h3>
              <p className="text-gray-600">
                Automatiza el proceso completo desde la toma de pedidos hasta la
                entrega, eliminando errores y reduciendo tiempos de espera
                significativamente.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-300">
              <div className="w-14 h-14 bg-amber-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                💬
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Comunicación en Tiempo Real
              </h3>
              <p className="text-gray-600">
                Conecta instantáneamente las áreas de servicio y cocina mediante
                notificaciones push y actualizaciones en tiempo real con
                WebSockets.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-50 to-white rounded-2xl border-2 border-orange-300">
              <div className="w-14 h-14 bg-orange-600 rounded-xl flex items-center justify-center text-2xl mb-4">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Análisis y Reportes
              </h3>
              <p className="text-gray-600">
                Genera reportes detallados de ventas con gráficos interactivos
                para identificar productos más vendidos, horarios pico y tomar
                decisiones basadas en datos.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-orange-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Solución completa que aborda los desafíos operativos del sector
              gastronómico
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border-2 border-orange-200 hover:border-orange-400 hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="modules"
        className="py-20 px-6 bg-gradient-to-br from-orange-50 to-amber-50"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Módulos del Sistema
            </h2>
            <p className="text-xl text-gray-600">
              Cuatro módulos especializados para diferentes usuarios
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {modules.map((module, index) => (
              <button
                key={index}
                onClick={() => setActiveModule(index)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeModule === index
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-orange-100 border-2 border-orange-200"
                }`}
              >
                {module.title}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <div
              className={`bg-white rounded-3xl p-8 md:p-12 shadow-2xl border-t-4 border-orange-500`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${modules[activeModule].color} flex items-center justify-center text-3xl text-white`}
                >
                  {activeModule === 0
                    ? "👥"
                    : activeModule === 1
                    ? "🍽️"
                    : activeModule === 2
                    ? "👨‍🍳"
                    : activeModule === 3
                    ? "💰"
                    : "⚙️"}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {modules[activeModule].title}
                  </h3>
                  <p className="text-gray-600">
                    {modules[activeModule].description}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {modules[activeModule].features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      ✓
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tech" className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Stack Tecnológico
            </h2>
            <p className="text-xl text-gray-600">
              Desarrollado con las tecnologías más modernas y robustas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl text-center hover:shadow-xl hover:-translate-y-2 transition-all border-2 border-orange-200"
              >
                <div className="text-4xl mb-3">{tech.icon}</div>
                <div className="font-semibold text-gray-800">{tech.name}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-3xl p-8 md:p-12 text-white">
              <h3 className="text-3xl font-bold mb-6">
                Arquitectura del Sistema
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-white/10 backdrop-blur rounded-xl">
                  <div className="text-4xl mb-3">🌐</div>
                  <h4 className="font-bold mb-2">Web Frontend</h4>
                  <p className="text-sm text-orange-100">React + Tailwind</p>
                </div>
                <div className="text-center p-6 bg-white/10 backdrop-blur rounded-xl">
                  <div className="text-4xl mb-3">📱</div>
                  <h4 className="font-bold mb-2">Mobile App</h4>
                  <p className="text-sm text-orange-100">Flutter + Dart</p>
                </div>
                <div className="text-center p-6 bg-white/10 backdrop-blur rounded-xl">
                  <div className="text-4xl mb-3">⚙️</div>
                  <h4 className="font-bold mb-2">Backend API</h4>
                  <p className="text-sm text-orange-100">Node.js + Nest.js</p>
                </div>
                <div className="text-center p-6 bg-white/10 backdrop-blur rounded-xl">
                  <div className="text-4xl mb-3">🗄️</div>
                  <h4 className="font-bold mb-2">Base de Datos</h4>
                  <p className="text-sm text-orange-100">MySQL 8.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        id="results"
        className="py-20 px-6 bg-gradient-to-br from-orange-50 to-amber-50"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Resultados Comprobados
            </h2>
            <p className="text-xl text-gray-600">
              Mejoras significativas en la operación del restaurante
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-orange-500">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Mejoras Cuantitativas
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">📉</span>
                  <span className="text-gray-700">
                    <strong>60%</strong> reducción de errores en pedidos
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <span className="text-gray-700">
                    <strong>40%</strong> ahorro en tiempo de toma de pedidos
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  <span className="text-gray-700">
                    <strong>35%</strong> reducción en tiempo de comunicación
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">📈</span>
                  <span className="text-gray-700">
                    <strong>25%</strong> aumento en eficiencia operativa
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-amber-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Mejoras Cualitativas
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-gray-700">
                    Eliminación de pedidos perdidos
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">🤝</span>
                  <span className="text-gray-700">
                    Mejor coordinación entre áreas
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">⏱️</span>
                  <span className="text-gray-700">
                    Actualización inmediata de disponibilidad
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">😊</span>
                  <span className="text-gray-700">
                    100% satisfacción del personal
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-white">RestWeb</span>
              </div>
              <p className="text-gray-400">
                Sistema integral de gestión desarrollado por estudiantes de
                Ingeniería en Sistemas
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Autores</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Diego Guisbert Huaycho</li>
                <li>Gabriel Leonardo Paredes Gutierrez</li>
                <li>Fernando Favio Nina Quispe</li>
                <li>Joel Bladimir Quispe Tapia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>webcraft.g.b.f.d@gmail.com</li>
                <li>La Paz, Bolivia</li>
                <li> Universidad Salesiana de Bolivia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>
              © 2025 RestWeb - Proyecto Integrador de Ingeniería en Sistemas
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RestaurantLanding;
