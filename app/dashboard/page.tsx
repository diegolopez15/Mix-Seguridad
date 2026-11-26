import { getSession } from '@/lib/utils/auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const [quotations, contracts, reports] = await Promise.all([
    prisma.quotation.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contract.findMany({
      where: { company: { users: { some: { id: session.userId } } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.report.findMany({
      where: { contract: { company: { users: { some: { id: session.userId } } } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mi Portal</h1>
              <p className="text-sm text-gray-600">Bienvenido, {session.email}</p>
            </div>
            <div className="flex gap-3">
              <a href="/" className="px-4 py-2 text-gray-700 hover:text-blue-600">Inicio</a>
              <a href="/api/auth/logout" className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Cerrar Sesión
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mis Cotizaciones</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{quotations.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contratos Activos</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{contracts.filter(c => c.status === 'ACTIVE').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reportes Recientes</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{reports.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Mis Cotizaciones */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Mis Cotizaciones</h2>
          </div>
          <div className="p-6">
            {quotations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No tienes cotizaciones aún</p>
                <a href="/" className="text-blue-600 hover:underline">Solicita una aquí</a>
              </div>
            ) : (
              <div className="space-y-4">
                {quotations.map((q) => (
                  <div key={q.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{q.serviceType.replace(/_/g, ' ')}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            q.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            q.status === 'WON' ? 'bg-green-100 text-green-800' :
                            q.status === 'LOST' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {q.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">📍 {q.location}</p>
                        <p className="text-sm text-gray-600">🕐 {q.requiredSchedule}</p>
                        {q.additionalNotes && (
                          <p className="text-sm text-gray-500 mt-2 italic">"{q.additionalNotes}"</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          Creada: {new Date(q.createdAt).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contratos Activos */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Mis Contratos</h2>
          </div>
          <div className="p-6">
            {contracts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tienes contratos activos</p>
            ) : (
              <div className="space-y-4">
                {contracts.map((c) => (
                  <div key={c.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">Contrato #{c.contractNumber}</h3>
                        <p className="text-sm text-gray-600 mt-1">{c.serviceDescription.substring(0, 100)}...</p>
                        <p className="text-sm text-gray-500 mt-2">
                          Valor mensual: ${Number(c.monthlyValue).toLocaleString('es-CO')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        c.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        c.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reportes Recientes */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Reportes Recientes</h2>
          </div>
          <div className="p-6">
            {reports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay reportes disponibles</p>
            ) : (
              <div className="space-y-4">
                {reports.map((r) => (
                  <div key={r.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{r.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{r.description.substring(0, 150)}...</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(r.reportDate).toLocaleDateString('es-CO')} • {r.location}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        r.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                        r.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}