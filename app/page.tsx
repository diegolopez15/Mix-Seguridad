'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    prospectName: '',
    prospectEmail: '',
    prospectPhone: '',
    prospectCompany: '',
    serviceType: 'PHYSICAL_SURVEILLANCE',
    propertyType: 'RESIDENTIAL_COMPLEX',
    location: '',
    requiredSchedule: '',
    additionalNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('Cotizacion enviada exitosamente!');
        setFormData({
          prospectName: '',
          prospectEmail: '',
          prospectPhone: '',
          prospectCompany: '',
          serviceType: 'PHYSICAL_SURVEILLANCE',
          propertyType: 'RESIDENTIAL_COMPLEX',
          location: '',
          requiredSchedule: '',
          additionalNotes: '',
        });
      }
    } catch (error) {
      setMessage('Error al enviar');
    } finally {
      setLoading(false);
    }
  };

  const services = [
    {
      icon: '👮',
      title: 'Vigilancia Física',
      description: 'Personal de seguridad altamente capacitado para proteger sus instalaciones las 24 horas.',
    },
    {
      icon: '🚗',
      title: 'Escoltas',
      description: 'Servicio de protección personal para ejecutivos y personas de alto perfil.',
    },
    {
      icon: '📹',
      title: 'Seguridad Electrónica',
      description: 'Cámaras, alarmas y sistemas de control de acceso de última tecnología.',
    },
    {
      icon: '🖥️',
      title: 'Monitoreo 24/7',
      description: 'Centro de monitoreo permanente con respuesta inmediata ante cualquier eventualidad.',
    },
    {
      icon: '📋',
      title: 'Consultoría',
      description: 'Análisis de riesgos y diseño de estrategias de seguridad personalizadas.',
    },
    {
      icon: '🔒',
      title: 'Servicio Mixto',
      description: 'Combinación de seguridad física y electrónica para una protección integral.',
    },
  ];

  const testimonials = [
    {
      name: 'Carlos Mendoza',
      role: 'Administrador Conjunto Residencial El Bosque',
      text: 'Mix Seguridad transformó la seguridad de nuestro conjunto. El servicio es profesional y confiable.',
      rating: 5,
    },
    {
      name: 'Ana Lucía Gómez',
      role: 'Gerente Centro Comercial Plaza Norte',
      text: 'Excelente respuesta y personal altamente capacitado. Los recomendamos ampliamente.',
      rating: 5,
    },
    {
      name: 'Roberto Sánchez',
      role: 'Director de Operaciones Logística SAS',
      text: 'La seguridad electrónica que instalaron en nuestras bodegas es de primera. Muy satisfechos.',
      rating: 5,
    },
  ];

  const stats = [
    { value: '15+', label: 'Años de Experiencia' },
    { value: '500+', label: 'Clientes Satisfechos' },
    { value: '1200+', label: 'Guardas Activos' },
    { value: '24/7', label: 'Monitoreo Permanente' },
  ];

  return (
    <main className="min-h-screen">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Mix Seguridad</h1>
              <p className="text-xs text-gray-600">Seguridad Integral que Protege su Patrimonio</p>
            </div>
            <div className="hidden md:flex gap-6 items-center">
              <a href="#inicio" className="text-gray-700 hover:text-blue-600 font-medium">Inicio</a>
              <a href="#servicios" className="text-gray-700 hover:text-blue-600 font-medium">Servicios</a>
              <a href="#nosotros" className="text-gray-700 hover:text-blue-600 font-medium">Nosotros</a>
              <a href="#testimonios" className="text-gray-700 hover:text-blue-600 font-medium">Testimonios</a>
              <a href="#contacto" className="text-gray-700 hover:text-blue-600 font-medium">Contacto</a>
              <a href="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 font-medium">
                Iniciar Sesión
              </a>
              <a href="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                Registrarse
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="inicio" className="pt-24 pb-16 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Seguridad Integral que <span className="text-yellow-400">Protege su Patrimonio</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Más de 15 años brindando soluciones de seguridad personalizadas para empresas y residencias en Colombia
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="#contacto" className="px-8 py-4 bg-yellow-400 text-blue-900 font-bold rounded-lg hover:bg-yellow-300 text-lg">
                Solicitar Cotización Gratis
              </a>
              <a href="#servicios" className="px-8 py-4 bg-white text-blue-900 font-bold rounded-lg hover:bg-gray-100 text-lg">
                Conocer Servicios
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6">
                <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
                <p className="text-gray-600 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos soluciones integrales de seguridad adaptadas a sus necesidades
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NOSOTROS */}
      <section id="nosotros" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Quiénes Somos</h2>
              <p className="text-xl text-gray-600">
                Empresa líder en seguridad integral en Colombia
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Más de 15 años protegiendo lo que más importa
                </h3>
                <p className="text-gray-600 mb-4">
                  En Mix Seguridad nos especializamos en brindar soluciones de seguridad integral 
                  para empresas, conjuntos residenciales, centros comerciales e industrias.
                </p>
                <p className="text-gray-600 mb-4">
                  Contamos con personal altamente capacitado, tecnología de punta y procesos 
                  certificados que garantizan la protección de su patrimonio.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Personal certificado y en constante capacitación</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Tecnología de última generación</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Respuesta inmediata 24/7</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">Cobertura nacional</span>
                  </li>
                </ul>
              </div>
              <div className="bg-blue-100 rounded-lg p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🛡️</div>
                  <h4 className="text-2xl font-bold text-blue-900 mb-2">Nuestra Misión</h4>
                  <p className="text-gray-700">
                    Proteger el patrimonio y la integridad de nuestros clientes mediante 
                    soluciones de seguridad innovadoras, confiables y de alta calidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-xl text-gray-600">
              La satisfacción de nuestros clientes es nuestro mayor logro
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULARIO DE CONTACTO */}
      <section id="contacto" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Solicita tu Cotización Gratuita</h2>
              <p className="text-xl text-gray-600">
                Completa el formulario y te contactaremos en menos de 24 horas
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg shadow-lg p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    name="prospectName"
                    value={formData.prospectName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="prospectEmail"
                    value={formData.prospectEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    name="prospectPhone"
                    value={formData.prospectPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                  <input
                    type="text"
                    name="prospectCompany"
                    value={formData.prospectCompany}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio *</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PHYSICAL_SURVEILLANCE">Vigilancia Física</option>
                    <option value="ESCORTS">Escoltas</option>
                    <option value="ELECTRONIC_SECURITY">Seguridad Electrónica</option>
                    <option value="MONITORING">Monitoreo 24/7</option>
                    <option value="CONSULTING">Consultoría</option>
                    <option value="MIXED">Servicio Mixto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Inmueble *</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="RESIDENTIAL_COMPLEX">Conjunto Residencial</option>
                    <option value="SHOPPING_CENTER">Centro Comercial</option>
                    <option value="OFFICE_BUILDING">Edificio de Oficinas</option>
                    <option value="WAREHOUSE">Bodega</option>
                    <option value="EVENT">Evento Temporal</option>
                    <option value="OTHER">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horario *</label>
                  <input
                    type="text"
                    name="requiredSchedule"
                    value={formData.requiredSchedule}
                    onChange={handleChange}
                    required
                    placeholder="Ej: 24/7"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales</label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Solicitar Cotización Gratuita'}
                </button>
              </div>

              {message && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-800">{message}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Mix Seguridad</h3>
              <p className="text-blue-200">
                Seguridad Integral que Protege su Patrimonio
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Servicios</h4>
              <ul className="space-y-2 text-blue-200">
                <li>Vigilancia Física</li>
                <li>Escoltas</li>
                <li>Seguridad Electrónica</li>
                <li>Monitoreo 24/7</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-blue-200">
                <li>📞 +57 300 123 4567</li>
                <li>✉️ info@mixseguridad.com</li>
                <li>📍 Bogotá, Colombia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Horario</h4>
              <ul className="space-y-2 text-blue-200">
                <li>Lunes a Viernes: 8am - 6pm</li>
                <li>Sábados: 8am - 12pm</li>
                <li>Emergencias: 24/7</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>© 2026 Mix Seguridad. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}