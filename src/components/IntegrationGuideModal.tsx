import React, { useState } from 'react';
import {
  X,
  FileSpreadsheet,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
  Globe,
  Terminal,
  Github,
  Laptop,
} from 'lucide-react';
import { getGoogleAppsScriptCode } from '../services/appsScriptTemplate';

interface IntegrationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationGuideModal: React.FC<IntegrationGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const scriptCode = getGoogleAppsScriptCode().codeGs;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800">
              <FileSpreadsheet className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Guia de integracion</h3>
              <p className="text-xs font-medium text-slate-500">
                Flujo local, GitHub, Netlify y Google Sheets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2">
          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
            <Laptop className="h-4 w-4 text-emerald-700" />
            1. Trabajo local sin gastar creditos
          </h4>
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 text-xs text-slate-700 space-y-1">
            <p><strong>Archivo local:</strong> crea un `.env.local` con `VITE_USE_LIVE_DATA=false`.</p>
            <p><strong>Resultado:</strong> la app usa datos de ejemplo y no consulta Google Sheets.</p>
            <p><strong>Comando:</strong> `npm install` y despues `npm run dev`.</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
            <HelpCircle className="h-4 w-4 text-emerald-700" />
            2. Google Form y Google Sheet
          </h4>
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 text-xs text-slate-700 space-y-1.5">
            <p>Crea un Google Form con este orden exacto de columnas:</p>
            <p>`Timestamp`, `Empresa / Marca`, `Sede / Sucursal`, `Area Auditada`, `Tipo de Desvio Detectado`, `Observaciones / Comentarios`, `Fotografia de Evidencia`.</p>
            <p>Vinculalo a una hoja y deja la pestaña con el nombre `Respuestas de formulario 1`.</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
              <Terminal className="h-4 w-4 text-slate-700" />
              3. Codigo de Google Apps Script
            </h4>
            <button
              onClick={handleCopyCode}
              className="flex cursor-pointer items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 transition-colors hover:text-emerald-900"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedCode ? 'Copiado' : 'Copiar codigo'}</span>
            </button>
          </div>
          <pre className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 text-[11px] leading-relaxed text-slate-200">
            {scriptCode}
          </pre>
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3.5 text-xs text-slate-800 space-y-1">
            <p>En tu Sheet: `Extensiones {'>'} Apps Script`.</p>
            <p>Reemplaza todo el archivo `Code.gs` por este bloque.</p>
            <p>Luego: `Implementar {'>'} Nueva implementacion {'>'} Aplicacion web`.</p>
            <p>Acceso: `Cualquier persona`.</p>
            <p>Copia la URL publicada. Esa es la que va en Netlify.</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
            <Github className="h-4 w-4 text-slate-700" />
            4. Subir a GitHub
          </h4>
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-3.5 text-xs text-slate-700 space-y-1">
            <p>`git init`</p>
            <p>`git add .`</p>
            <p>`git commit -m "Base inicial Desenchufate"`</p>
            <p>`git branch -M main`</p>
            <p>`git remote add origin TU_URL_DEL_REPO`</p>
            <p>`git push -u origin main`</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
            <Globe className="h-4 w-4 text-slate-700" />
            5. Vincular con Netlify
          </h4>
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-3.5 text-xs text-slate-800 space-y-1">
            <p className="flex items-center gap-1 font-bold text-emerald-900">
              <ExternalLink className="h-3.5 w-3.5" /> Configuracion recomendada
            </p>
            <p><strong>Build command:</strong> `npm run build`</p>
            <p><strong>Publish directory:</strong> `dist`</p>
            <p><strong>Environment variable:</strong> `VITE_USE_LIVE_DATA=true`</p>
            <p><strong>Environment variable:</strong> `VITE_GOOGLE_SHEETS_SCRIPT_URL=PEGA_AQUI_TU_URL_DE_APPS_SCRIPT`</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};