import React, { useState } from 'react';
import { X, Sliders, Save, CheckCircle2 } from 'lucide-react';
import { ConfigSheet } from '../types';

interface ConfigModalProps {
  isOpen: boolean;
  config: ConfigSheet;
  onSaveConfig: (newConfig: ConfigSheet) => void;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  config,
  onSaveConfig,
  onClose,
}) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<ConfigSheet>({ ...config });
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(form);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">Configuración del Sistema</h2>
            <p className="text-xs text-slate-500 font-medium">
              Ajuste de límites de clasificación para los estados energéticos.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              Puntaje Inicial del Área (puntos base)
            </label>
            <input
              type="number"
              value={form.PUNTAJE_INICIAL}
              onChange={(e) => setForm({ ...form, PUNTAJE_INICIAL: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-emerald-800 block">
              Límite Estado Excelente (pts)
            </label>
            <input
              type="number"
              value={form.LIMITE_EXCELENTE}
              onChange={(e) => setForm({ ...form, LIMITE_EXCELENTE: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold outline-none focus:border-emerald-500"
            />
            <span className="text-[10px] text-slate-500">
              Puntajes mayores o iguales a este valor serán clasificados como Excelente.
            </span>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-teal-800 block">
              Límite Estado Bueno (pts)
            </label>
            <input
              type="number"
              value={form.LIMITE_BUENO}
              onChange={(e) => setForm({ ...form, LIMITE_BUENO: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-amber-900 block">
              Límite Estado Alerta (pts)
            </label>
            <input
              type="number"
              value={form.LIMITE_ALERTA}
              onChange={(e) => setForm({ ...form, LIMITE_ALERTA: Number(e.target.value) })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-mono font-bold outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">
              Mostrar Fotografías en la Web
            </label>
            <select
              value={form.MOSTRAR_FOTOS}
              onChange={(e) => setForm({ ...form, MOSTRAR_FOTOS: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="Sí">Sí - Permitir fotos autorizadas</option>
              <option value="No">No - Ocultar fotografías de la web</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer shadow-xs"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> ¡Guardado!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Guardar Parámetros
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
