import React, { useState } from 'react';
import { X, Code, Copy, Check, FileCode, ShieldCheck, BookOpen } from 'lucide-react';
import { getGoogleAppsScriptCode } from '../services/dataService';

interface AppsScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppsScriptModal: React.FC<AppsScriptModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'Code.gs' | 'Index.html' | 'Styles.html' | 'Scripts.html' | 'Setup'>('Code.gs');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const scripts = getGoogleAppsScriptCode();

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const getTabCode = () => {
    switch (activeTab) {
      case 'Code.gs':
        return scripts.codeGs;
      case 'Index.html':
        return scripts.indexHtml;
      case 'Styles.html':
        return scripts.stylesHtml;
      case 'Scripts.html':
        return scripts.scriptsHtml;
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col relative">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                Código para Google Apps Script
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Archivos necesarios para desplegar la Web App de solo lectura en Google Workspace.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-1 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto">
          {(['Code.gs', 'Index.html', 'Styles.html', 'Scripts.html', 'Setup'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab === 'Setup' ? <BookOpen className="w-3.5 h-3.5" /> : <FileCode className="w-3.5 h-3.5" />}
              <span>{tab === 'Setup' ? 'Guía de Despliegue' : tab}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {activeTab === 'Setup' ? (
            <div className="space-y-5 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                <h3 className="text-sm font-black flex items-center gap-2 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Instrucciones para Conectar con Google Sheets
                </h3>
                <p className="font-medium">
                  Siga estos sencillos pasos para crear su Web App de Apps Script basada en la hoja de cálculo privada del Grupo.
                </p>
              </div>

              <ol className="space-y-4 list-decimal list-inside font-medium text-slate-800">
                <li className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900">Crear las Hojas en Google Sheets:</strong>
                  <p className="text-slate-600 text-[11px] mt-1 font-medium">
                    Cree las hojas con estos nombres exactos: <code className="text-emerald-700 font-mono font-bold">EMPRESAS</code>, <code className="text-emerald-700 font-mono font-bold">AREAS</code>, <code className="text-emerald-700 font-mono font-bold">REGISTROS</code>, <code className="text-emerald-700 font-mono font-bold">TIPOS_DESVIO</code> y <code className="text-emerald-700 font-mono font-bold">CONFIG</code>.
                  </p>
                </li>

                <li className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900">Abrir el Editor de Apps Script:</strong>
                  <p className="text-slate-600 text-[11px] mt-1 font-medium">
                    En su Google Sheet privado, vaya al menú superior: <em>Extensiones &gt; Apps Script</em>.
                  </p>
                </li>

                <li className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900">Copiar los Archivos:</strong>
                  <p className="text-slate-600 text-[11px] mt-1 font-medium">
                    Copie el contenido de la pestaña <code className="text-emerald-700 font-mono font-bold">Code.gs</code> en el archivo por defecto. Luego agregue 3 archivos HTML llamados <code className="text-emerald-700 font-mono font-bold">Index</code>, <code className="text-emerald-700 font-mono font-bold">Styles</code> y <code className="text-emerald-700 font-mono font-bold">Scripts</code> copiando el código respetivo de las pestañas superiores.
                  </p>
                </li>

                <li className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <strong className="text-slate-900">Publicar como Web App:</strong>
                  <p className="text-slate-600 text-[11px] mt-1 font-medium">
                    Haga clic en <em>Implementar &gt; Nueva implementación</em>. Elija tipo <strong>Aplicación web</strong>.
                  </p>
                </li>
              </ol>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Archivo: <strong className="text-slate-900">{activeTab}</strong>
                </span>
                <button
                  onClick={() => handleCopy(getTabCode(), activeTab)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
                >
                  {copiedTab === activeTab ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> ¡Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copiar Código
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-900 text-xs font-mono text-emerald-400 overflow-x-auto max-h-96 leading-relaxed">
                {getTabCode()}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-all cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
