'use client';

import { useState, useEffect } from 'react';
import { generateInvoicePDF } from '@/lib/utils/pdf';

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    contractId: '',
    dueDate: '',
    value: '',
  });
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    reference: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [invoicesRes, contractsRes] = await Promise.all([
        fetch('/api/admin/invoices'),
        fetch('/api/admin/contracts'),
      ]);
      const invoicesData = await invoicesRes.json();
      const contractsData = await contractsRes.json();
      setInvoices(invoicesData.invoices || []);
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
      const response = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        setMessage('✅ Factura creada exitosamente');
        setShowForm(false);
        setFormData({ contractId: '', dueDate: '', value: '' });
        loadData();
      } else {
        setMessage(' ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Error al crear factura');
    }
  };

  const handlePayment = async (invoiceId: string) => {
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId,
          ...paymentData,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage('✅ Pago registrado exitosamente');
        setShowPaymentForm(null);
        setPaymentData({ amount: '', paymentMethod: 'BANK_TRANSFER', reference: '' });
        loadData();
      } else {
        setMessage('❌ ' + data.message);
      }
    } catch (error) {
      setMessage(' Error al registrar pago');
    }
  };

  const generateMonthlyInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices/generate', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        setMessage(`✅ ${data.invoices.length} facturas generadas automáticamente`);
        loadData();
      } else {
        setMessage(' ' + data.message);
      }
    } catch (error) {
      setMessage('❌ Error al generar facturas');
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando...</div>;
  }

  const totalPending = invoices.filter(i => i.status === 'PENDING').reduce((sum, i) => sum + Number(i.value), 0);
  const totalPaid = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + Number(i.value), 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Facturación</h1>
              <p className="text-sm text-gray-600">Facturas y pagos</p>
            </div>
            <div className="flex gap-3">
              <a href="/admin" className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                ← Volver al Admin
              </a>
              <button
                onClick={generateMonthlyInvoices}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                🔄 Generar Facturas del Mes
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {showForm ? 'Cancelar' : '+ Nueva Factura'}
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

        {/* Resumen financiero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Total Facturas</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">{invoices.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Por Cobrar</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">${totalPending.toLocaleString('es-CO')}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600">Cobrado</p>
            <p className="text-3xl font-bold text-green-600 mt-1">${totalPaid.toLocaleString('es-CO')}</p>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Factura</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        {c.contractNumber} - {c.company?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Vencimiento *</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor (COP) *</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="5000000"
                  />
                </div>
              </div>
              <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                Crear Factura
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Lista de Facturas ({invoices.length})</h2>
          </div>
          <div className="overflow-x-auto">
            {invoices.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No hay facturas registradas
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emisión</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vencimiento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{invoice.invoiceNumber}</td>
                      <td className="px-6 py-4 text-sm">{invoice.contract?.company?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm">{new Date(invoice.issueDate).toLocaleDateString('es-CO')}</td>
                      <td className="px-6 py-4 text-sm">{new Date(invoice.dueDate).toLocaleDateString('es-CO')}</td>
                      <td className="px-6 py-4 text-sm">${Number(invoice.value).toLocaleString('es-CO')}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={() => generateInvoicePDF(invoice)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          📄 PDF
                        </button>
                        {invoice.status === 'PENDING' && (
                          <button
                            onClick={() => {
                              setShowPaymentForm(invoice.id);
                              setPaymentData({ ...paymentData, amount: String(invoice.value) });
                            }}
                            className="text-green-600 hover:text-green-800"
                          >
                            Registrar Pago
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {showPaymentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Registrar Pago</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monto *</label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago *</label>
                  <select
                    value={paymentData.paymentMethod}
                    onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="BANK_TRANSFER">Transferencia Bancaria</option>
                    <option value="CASH">Efectivo</option>
                    <option value="CHECK">Cheque</option>
                    <option value="CREDIT_CARD">Tarjeta de Crédito</option>
                    <option value="DEBIT_CARD">Tarjeta Débito</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Referencia</label>
                  <input
                    type="text"
                    value={paymentData.reference}
                    onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                    placeholder="Número de transferencia o cheque"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePayment(showPaymentForm)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Confirmar Pago
                  </button>
                  <button
                    onClick={() => setShowPaymentForm(null)}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}