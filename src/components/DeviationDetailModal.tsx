import React from 'react';
import { X, Calendar, MapPin, Building2, ZapOff, Image as ImageIcon, AlertCircle, ShieldCheck } from 'lucide-react';
import { RegistroDesvio } from '../types';

interface DeviationDetailModalProps {
  registro: RegistroDesvio | null;
  onClose: () => void;
}

export const DeviationDetailModal: React.FC<DeviationDetailModalProps> = ({
  registro,
  onClose,
}) => {
  if (!registro) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase tracking-wider">
            <ZapOff className="w-4 h-4 text-emerald-600" /> Detalle de Registro de Desvío
          </div>
          <h2 className="text-xl font-black text-slate-900 pr-8">{registro.tipoDesvio}</h2>
        </div>

        {/* Photo Lightbox Preview */}
        {registro.fotoUrl && registro.mostrarFoto === 'Sí' ? (
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
            <img
              src={registro.fotoUrl}
              alt="Auditoría energética"
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-2 right-2 px-3 py-1 rounded-full bg-white/90 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Fotografía Autorizada
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-1 font-medium">
            <ImageIcon className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700">Sin fotografía adjunta</p>
            <p>Este registro fue cargado sin evidencia fotográfica o la foto no está autorizada para visualización pública.</p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-bold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Empresa
            </span>
            <span className="text-sm font-black text-slate-900 block">
              {registro.empresaNombre}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-teal-600" /> Sede & Área
            </span>
            <span className="text-sm font-black text-slate-900 block">
              {registro.sede} • {registro.areaNombre}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" /> Fecha & Hora
            </span>
            <span className="text-sm font-black text-slate-900 font-mono block">
              {registro.fecha} ({registro.timestamp.split(' ')[1] || '08:30'})
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Impacto Energético
            </span>
            <span className="text-sm font-black text-rose-700 font-mono block">
              -{registro.puntosDescontados} Puntos ({registro.cantidadDesvios} ítem/s)
            </span>
          </div>
        </div>

        {/* Audit Observations */}
        {registro.observacion && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Observación de la Auditoría
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed italic font-medium">
              "{registro.observacion}"
            </div>
          </div>
        )}

        {/* Security & Confidentiality Guarantee */}
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>Información de solo lectura. Los datos de evaluadores se mantienen protegidos.</span>
        </div>

        {/* Action button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
