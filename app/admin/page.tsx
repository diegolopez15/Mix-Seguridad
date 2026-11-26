import { getSession } from '@/lib/utils/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import QuotationActions from './QuotationActions';

export default async function AdminDashboard() {
  const session = await getSession();

  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  const [totalUsers, totalQuotations, pendingQuotations, activeContracts] = await Promise.all([
    prisma.user.count(),
    prisma.quotation.count(),
    prisma.quotation.count({ where: { status: 'PENDING' } }),
    prisma.contract.count({ where: { status: 'ACTIVE' } }),
  ]);

  const recentQuotations = await prisma.quotation.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-sm text-gray-600">Mix Seguridad - Gestión Integral</p>
            </div>
            <div className="flex gap-3 items-center">
              <a href="/admin/contracts" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Contratos
              </a>
              <a href="/admin/quotations" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Cotizaciones
              </a>
              <a href="/admin/reports" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
  Reportes
</a>
              <a href="/admin/invoices" className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
  Facturas
</a>
              <span className="text-sm text-gray-600">Admin: {session.email}</span>
              <a href="/api/auth/logout" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Cerrar Sesión
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuarios totales</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cotizaciones totales</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{totalQuotations}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingQuotations}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contratos Activos</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{activeContracts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Últimas Cotizaciones</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentQuotations.map((quotation) => (
                  <tr key={quotation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{quotation.prospectName}</p>
                        <p className="text-sm text-gray-500">{quotation.prospectEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {quotation.serviceType.replace(/_/g, ' ')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{quotation.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        quotation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        quotation.status === 'WON' ? 'bg-green-100 text-green-800' :
                        quotation.status === 'LOST' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {quotation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(quotation.createdAt).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <QuotationActions quotation={quotation} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentQuotations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay cotizaciones registradas
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}