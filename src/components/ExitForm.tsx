import React, { useState } from 'react';
import { Clock, FileText, User } from 'lucide-react';
import type { ExitRecord } from '../types';

interface ExitFormProps {
  onSubmit: (record: Omit<ExitRecord, 'id'>) => void;
}

export function ExitForm({ onSubmit }: ExitFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    reason: '',
    exitTime: '',
    returnTime: '',
    observations: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      ...formData,
      name: '',
      reason: '',
      exitTime: '',
      returnTime: '',
      observations: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl">
      <div>
        <label className="block text-sm font-medium text-gray-700 patriaRegular">
          Fecha
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 patriaRegular">
          <div className="flex items-center gap-2">
            <User size={16} />
            Nombre
          </div>
        </label>
        <input
          type="text"
          placeholder='Nombre Completo'
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="placeholder:text-gray-500 placeholder:italic placeholder:text-sm mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 patriaRegular">
          <div className="flex items-center gap-2">
            <FileText size={16} />
            Motivo
          </div>
        </label>
        <input
          type="text"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 patriaRegular">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              Horario Salida
            </div>
          </label>
          <input
            type="time"
            value={formData.exitTime}
            onChange={(e) => setFormData({ ...formData, exitTime: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 patriaRegular">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              Horario Regreso
            </div>
          </label>
          <input
            type="time"
            value={formData.returnTime}
            onChange={(e) => setFormData({ ...formData, returnTime: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 patriaRegular">
          Observaciones
        </label>
        <textarea
          value={formData.observations}
          onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#9b2247] hover:bg-[#611232] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 patriaBold"
      >
        Registrar Salida
      </button>
    </form>
  );
}