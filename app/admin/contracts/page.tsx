'use client';

import { useState, useEffect } from 'react';
import { generateContractPDF } from '@/lib/utils/pdf';

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    contractNumber: '',
    companyId: '',
    startDate: '',
    endDate: '',
    monthlyValue: '',
    serviceDescription: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contractsRes, companiesRes] = await Promise.all([
        fetch('/api/admin/contracts'),
        fetch('/api/admin/companies'),
      ]);
      const contractsData = await contractsRes.json();
      const companiesData = await companiesRes.json();
      setContracts(contractsData.contracts || []);
      setCompanies(companiesData.companies || []);
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
      const response = await fetch('/api/admin/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        setMessage('✅ Contrato creado exitosamente');
        setShowForm(false);
        setFormData({
          contractNumber: '',
          companyId: '',
          startDate: '',
          endDate: '',
          monthlyValue: '',
          serviceDescription: '',
        });
        loadData();
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Error al crear contrato');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/contracts/${id}`, {
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

  const deleteContract = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este contrato?')) return;
    try {
      const response = await fetch(`/api/admin/contracts/${id}`, {
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Contratos</h1>
              <p className="text-sm text-gray-600">Administrar contratos de clientes</p>
            </div>
            <div className="flex gap-3">
              <a href="/admin" className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                ← Volver al Admin
              </a>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showForm ? 'Cancelar' : '+ Nuevo Contrato'}
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
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Contrato</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Contrato *</label>
                  <input
                    type="text"
                    value={formData.contractNumber}
                    onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ej: CONT-2026-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Empresa *</label>
                  <select
                    value={formData.companyId}
                    onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Seleccionar empresa</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} - {c.nit}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Mensual (COP) *</label>
                  <input
                    type="number"
                    value={formData.monthlyValue}
                    onChange={(e) => setFormData({ ...formData, monthlyValue: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Ej: 5000000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Servicio *</label>
                <textarea
                  value={formData.serviceDescription}
                  onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="Descripción detallada del servicio..."
                />
              </div>
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                Crear Contrato
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Lista de Contratos ({contracts.length})</h2>
          </div>
          <div className="overflow-x-auto">
            {contracts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay contratos registrados. Crea el primero haciendo clic en "+ Nuevo Contrato"
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inicio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fin</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor Mensual</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <td className="px-6 py-4 text-sm space-x-2">
  <button
    onClick={() => generateContractPDF(contract)}
    className="text-blue-600 hover:text-blue-800 font-medium"
  >
    📄 PDF
  </button>
  {contract.status === 'ACTIVE' && (
    <button
      onClick={() => updateStatus(contract.id, 'TERMINATED')}
      className="text-red-600 hover:text-red-800"
    >
      Terminar
    </button>
  )}
  {contract.status === 'DRAFT' && (
    <button
      onClick={() => updateStatus(contract.id, 'ACTIVE')}
      className="text-green-600 hover:text-green-800"
    >
      Activar
    </button>
  )}
  <button
    onClick={() => deleteContract(contract.id)}
    className="text-red-600 hover:text-red-800"
  >
    Eliminar
  </button>
</td>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{contract.contractNumber}</td>
                      <td className="px-6 py-4">{contract.company?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">{new Date(contract.startDate).toLocaleDateString('es-CO')}</td>
                      <td className="px-6 py-4 text-sm">{contract.endDate ? new Date(contract.endDate).toLocaleDateString('es-CO') : 'Indefinido'}</td>
                      <td className="px-6 py-4 text-sm">${Number(contract.monthlyValue).toLocaleString('es-CO')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          contract.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          contract.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                          contract.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        {contract.status === 'ACTIVE' && (
                          <button
                            onClick={() => updateStatus(contract.id, 'TERMINATED')}
                            className="text-red-600 hover:text-red-800"
                          >
                            Terminar
                          </button>
                        )}
                        {contract.status === 'DRAFT' && (
                          <button
                            onClick={() => updateStatus(contract.id, 'ACTIVE')}
                            className="text-green-600 hover:text-green-800"
                          >
                            Activar
                          </button>
                        )}
                        <button
                          onClick={() => deleteContract(contract.id)}
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