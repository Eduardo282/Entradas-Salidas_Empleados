import { useState, useEffect } from 'react';
import { FileDown, File as FilePdf } from 'lucide-react';
import { ExitForm } from './components/ExitForm';
import { generateMonthlyReport } from './utils/pdf';
import { getRecords } from './utils/api';
import type { ExitRecord } from './types';
import './index.css';

// Add BASE_URL definition
const BASE_URL = "https://horarios.gestionesculturales.org/";

function App() {
  const [records, setRecords] = useState<ExitRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].substring(0, 7));

  // Fetch records from backend on component mount
  useEffect(() => {
    getRecords()
      .then(data => setRecords(data))
      .catch(error => console.error("Failed to load records:", error));
  }, []);

  const handleSubmit = async (record: Omit<ExitRecord, 'id'>) => {
    try {
      await fetch(`${BASE_URL}/php/insertRecord.php`, { // Updated URL
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          date: record.date,
          name: record.name,
          reason: record.reason,
          exitTime: record.exitTime,
          returnTime: record.returnTime,
          observations: record.observations,
        }),
      });
      // Update the local state
      const newRecord = { ...record, id: records.length + 1 };
      setRecords([...records, newRecord]);
    } catch (error) {
      console.error('Error inserting record:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Consecutivo', 'Fecha', 'Nombre', 'Motivo personal', 'Horario Salida', 'Horario Regreso', 'Observación'];
    const csvContent = [
      headers.join(','),
      ...records.map(record => 
        [
          record.id,
          record.date,
          record.name,
          record.reason,
          record.exitTime,
          record.returnTime,
          `"${record.observations}"`
        ].join(',')
      )
    ].join('\n');

    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'registro-salidas.csv';
    link.click();
  };

  const generatePDF = () => {
    const [year, month] = selectedMonth.split("-");
    const selectedDate = new Date(Number(year), Number(month) - 1, 1);
    generateMonthlyReport(records, selectedDate);
  };

  // Change deleteRecord to accept the full record
  const deleteRecord = (record: ExitRecord) => {
    const params = new URLSearchParams({
      date: record.date,
      name: record.name,
      reason: record.reason,
      exitTime: record.exitTime,
      returnTime: record.returnTime,
      observations: record.observations,
    });
    fetch(`${BASE_URL}/php/deleteRecord.php`, { // Updated URL
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })
      .then((response) => response.text())
      .then((text) => {
        if (text === "OK") {
          setRecords((prev) => prev.filter((r) => r.id !== record.id));
        } else {
          console.error('Error deleting record from database');
        }
      })
      .catch((error) => console.error('Error deleting record:', error));
  };

  return (
    <div className="min-h-screen bg-gray-100 back">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 patriaBold">
            Sistema de Registro de Salidas
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ExitForm onSubmit={handleSubmit} />

            <div className="space-y-6">
              <div className="bg-white bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl">
                <h2 className="text-xl font-semibold mb-4 patriaRegular">Exportar Datos</h2>
                
                <div className="space-y-4">
                  <button
                    onClick={exportToCSV}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#002f2a] hover:bg-[#1e5b4f] patriaBold"
                  >
                    <FileDown size={16} />
                    Generar Excel
                  </button>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 patriaRegular">
                      Seleccionar Mes para Reporte
                    </label>
                    <input
                      type="month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      onClick={generatePDF}
                      className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#611232] hover:bg-[#9b2247] patriaBold"
                    >
                      <FilePdf size={16} />
                      Generar Reporte PDF
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-auto w-auto bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl">
                <h2 className="text-xl font-semibold mb-4 patriaRegular">Registros Recientes</h2>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider patriaRegular">Id</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider patriaRegular">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider patriaRegular">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider patriaRegular">Motivo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider patriaRegular">Salida</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider patriaRegular">Regreso</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider patriaRegular">Observaciones</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider patriaRegular">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records.slice(-5).map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.reason}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.exitTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.returnTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.observations}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => deleteRecord(record)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;