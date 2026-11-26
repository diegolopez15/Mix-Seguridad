'use client';

import { useState, useEffect } from 'react';
import { generateReportPDF } from '@/lib/utils/pdf';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contractId: '',
    reportType: 'DAILY_NOVELTY',
    title: '',
    description: '',
    location: '',
    status: 'DRAFT',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reportsRes, contractsRes] = await Promise.all([
        fetch('/api/admin/reports'),
        fetch('/api/admin/contracts'),
      ]);
      const reportsData = await reportsRes.json();
      const contractsData = await contractsRes.json();
      setReports(reportsData.reports || []);
      setContracts(contractsData.contracts || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        setMessage('✅ Reporte creado exitosamente');
        setShowForm(false);
        setFormData({
          contractId: '',
          reportType: 'DAILY_NOVELTY',
          title: '',
          description: '',
          location: '',
          status: 'DRAFT',
        });
        loadData();
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Error al crear reporte');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        loadData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteReport = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este reporte?')) return;
    try {
      const response = await fetch(`/api/admin/reports/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        loadData();
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Reportes</h1>
              <p className="text-sm text-gray-600">Administrar reportes operativos</p>
            </div>
            <div className="flex gap-3">
              <a href="/admin" className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                ← Volver al Admin
              </a>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showForm ? 'Cancelar' : '+ Nuevo Reporte'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Reporte</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contrato *</label>
                  <select
                    value={formData.contractId}
                    onChange={(e) => setFormData({ ...formData, contractId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Seleccionar contrato</option>
                    {contracts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.contractNumber} - {c.company?.name || 'Sin empresa'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Reporte *</label>
                  <select
                    value={formData.reportType}
                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="DAILY_NOVELTY">Novedad Diaria</option>
                    <option value="INCIDENT">Incidente</option>
                    <option value="MONTHLY_SUMMARY">Resumen Mensual</option>
                    <option value="MAINTENANCE">Mantenimiento</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ej: Reporte de novedades del turno nocturno"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ej: Conjunto Residencial El Bosque - Torre 3"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Descripción detallada del reporte..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="DRAFT">Borrador</option>
                    <option value="PUBLISHED">Publicado</option>
                    <option value="ARCHIVED">Archivado</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                Crear Reporte
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Lista de Reportes ({reports.length})</h2>
          </div>
          <div className="overflow-x-auto">
            {reports.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay reportes registrados. Crea el primero haciendo clic en "+ Nuevo Reporte"
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contrato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{report.title}</td>
                      <td className="px-6 py-4 text-sm">{formatReportType(report.reportType)}</td>
                      <td className="px-6 py-4 text-sm">{report.contract?.contractNumber || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">{report.location}</td>
                      <td className="px-6 py-4 text-sm">{new Date(report.reportDate).toLocaleDateString('es-CO')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          report.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                          report.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => generateReportPDF(report)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          📄 PDF
                        </button>
                        {report.status === 'DRAFT' && (
                          <button
                            onClick={() => updateStatus(report.id, 'PUBLISHED')}
                            className="text-green-600 hover:text-green-800"
                          >
                            Publicar
                          </button>
                        )}
                        {report.status === 'PUBLISHED' && (
                          <button
                            onClick={() => updateStatus(report.id, 'ARCHIVED')}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            Archivar
                          </button>
                        )}
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function formatReportType(type: string): string {
  const types: Record<string, string> = {
    'DAILY_NOVELTY': 'Novedad Diaria',
    'INCIDENT': 'Incidente',
    'MONTHLY_SUMMARY': 'Resumen Mensual',
    'MAINTENANCE': 'Mantenimiento',
  };
  return types[type] || type;
}