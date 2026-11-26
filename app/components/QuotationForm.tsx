'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';

export default function QuotationForm() {
  const [formData, setFormData] = useState({
    prospectName: '',
    prospectEmail: '',
    prospectPhone: '',
    prospectCompany: '',
    serviceType: 'PHYSICAL_SURVEILLANCE',
    propertyType: 'RESIDENTIAL_COMPLEX',
    propertySize: '',
    location: '',
    requiredSchedule: '',
    estimatedGuards: '',
    additionalNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Cotizacion enviada exitosamente. Nos pondremos en contacto pronto.');
        setFormData({
          prospectName: '',
          prospectEmail: '',
          prospectPhone: '',
          prospectCompany: '',
          serviceType: 'PHYSICAL_SURVEILLANCE',
          propertyType: 'RESIDENTIAL_COMPLEX',
          propertySize: '',
          location: '',
          requiredSchedule: '',
          estimatedGuards: '',
          additionalNotes: '',
        });
      } else {
        setMessage('Error al enviar. Intenta de nuevo.');
      }
    } catch (error) {
      setMessage('Error de conexion. Intenta mas tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Solicita tu Cotizacion Gratuita
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            name="prospectName"
            value={formData.prospectName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="prospectEmail"
            value={formData.prospectEmail}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefono
          </label>
          <input
            type="tel"
            name="prospectPhone"
            value={formData.prospectPhone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Empresa (opcional)
          </label>
          <input
            type="text"
            name="prospectCompany"
            value={formData.prospectCompany}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Servicio
          </label>
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="PHYSICAL_SURVEILLANCE">Vigilancia Fisica</option>
            <option value="ESCORTS">Escoltas</option>
            <option value="ELECTRONIC_SECURITY">Seguridad Electronica</option>
            <option value="MONITORING">Monitoreo 24/7</option>
            <option value="CONSULTING">Consultoria</option>
            <option value="MIXED">Servicio Mixto</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Inmueble
          </label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="RESIDENTIAL_COMPLEX">Conjunto Residencial</option>
            <option value="SHOPPING_CENTER">Centro Comercial</option>
            <option value="OFFICE_BUILDING">Edificio de Oficinas</option>
            <option value="WAREHOUSE">Bodega</option>
            <option value="EVENT">Evento Temporal</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ubicacion
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horario Requerido
          </label>
          <input
            type="text"
            name="requiredSchedule"
            value={formData.requiredSchedule}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Ej: 24/7 o Lunes a Viernes 6am-6pm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Informacion Adicional
        </label>
        <textarea
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Solicitar Cotizacion Gratuita'}
        </button>
      </div>

      {message && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-800">{message}</p>
        </div>
      )}
    </form>
  );
}