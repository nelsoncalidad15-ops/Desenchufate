import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ConfigSheet,
  FiltrosState,
  RegistroDesvio,
  AreaCalculada,
} from './types';
import { calculateDashboardData } from './services/dataService';
import {
  getDefaultDashboardSourceData,
  loadDashboardSourceData,
  type DashboardSourceData,
  type DataSourceStatus,
} from './services/sourceDataService';

import {
  Building2,
  Layers,
  BarChart3,
  FileSpreadsheet,
  CheckCircle2,
  CircleOff,
  FileText,
  LoaderCircle,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-react';

import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { Top3Podiums } from './components/Top3Podiums';
import { CompanyGrid } from './components/CompanyGrid';
import { AreaSlider } from './components/AreaSlider';
import { CompanyDetailDrawer } from './components/CompanyDetailDrawer';
import { CompanyRanking } from './components/CompanyRanking';
import { AreaRanking } from './components/AreaRanking';
import { AreaHeatmap } from './components/AreaHeatmap';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { RecentDeviationsLog } from './components/RecentDeviationsLog';
import { DeviationDetailModal } from './components/DeviationDetailModal';
import { IntegrationGuideModal } from './components/IntegrationGuideModal';

type MainTab = 'empresas' | 'areas' | 'graficos' | 'bitacora';

const DEFAULT_FILTERS: FiltrosState = {
  mes: 'Julio',
  anio: '2026',
  empresa: 'Todas',
  sede: 'Todas',
  area: 'Todas',
  estado: 'Todos',
  tipoDesvio: 'Todos',
  busqueda: '',
};

const DEFAULT_SOURCE_STATUS: DataSourceStatus = {
  mode: 'mock',
  label: 'Modo local',
  detail: 'Usando datos de ejemplo para trabajar sin depender de Google Sheets.',
};

export default function App() {
  const [sourceData, setSourceData] = useState<DashboardSourceData>(() => getDefaultDashboardSourceData());
  const [sourceStatus, setSourceStatus] = useState<DataSourceStatus>(DEFAULT_SOURCE_STATUS);
  const [loadingData, setLoadingData] = useState(true);

  const [config, setConfig] = useState<ConfigSheet>(sourceData.config);
  const [filtros, setFiltros] = useState<FiltrosState>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<MainTab>('graficos');
  const [companyViewMode, setCompanyViewMode] = useState<'cards' | 'table'>('cards');
  const [areaViewMode, setAreaViewMode] = useState<'slider' | 'heatmap' | 'table'>('slider');
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedRegistro, setSelectedRegistro] = useState<RegistroDesvio | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>(() =>
    new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      const result = await loadDashboardSourceData();
      if (!active) return;

      setSourceData(result.sourceData);
      setConfig(result.sourceData.config);
      setSourceStatus(result.sourceStatus);
      setLastUpdate(
        result.sourceStatus.lastUpdate
          ? new Date(result.sourceStatus.lastUpdate).toLocaleTimeString('es-AR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
          : new Date().toLocaleTimeString('es-AR', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
      );
      setLoadingData(false);
      setIsRefreshing(false);
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  const dashboardData = useMemo(() => {
    return calculateDashboardData(
      config,
      sourceData.empresas,
      sourceData.areas,
      sourceData.tiposDesvio,
      sourceData.registros,
      filtros
    );
  }, [config, sourceData, filtros]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const result = await loadDashboardSourceData();
    setSourceData(result.sourceData);
    setConfig(result.sourceData.config);
    setSourceStatus(result.sourceStatus);
    setLastUpdate(
      result.sourceStatus.lastUpdate
        ? new Date(result.sourceStatus.lastUpdate).toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        : new Date().toLocaleTimeString('es-AR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
    );
    setIsRefreshing(false);
  };

  const handleFilterChange = (key: keyof FiltrosState, value: string) => {
    setFiltros((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFiltros(DEFAULT_FILTERS);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filtros.mes !== DEFAULT_FILTERS.mes) count++;
    if (filtros.anio !== DEFAULT_FILTERS.anio) count++;
    if (filtros.empresa !== DEFAULT_FILTERS.empresa) count++;
    if (filtros.sede !== DEFAULT_FILTERS.sede) count++;
    if (filtros.area !== DEFAULT_FILTERS.area) count++;
    if (filtros.estado !== DEFAULT_FILTERS.estado) count++;
    if (filtros.tipoDesvio !== DEFAULT_FILTERS.tipoDesvio) count++;
    if (filtros.busqueda.trim() !== '') count++;
    return count;
  }, [filtros]);

  const handleSelectArea = (area: AreaCalculada) => {
    setFiltros((prev) => ({
      ...prev,
      empresa: area.empresaNombre || 'Todas',
      sede: area.sede || 'Todas',
      area: area.areaNombre || 'Todas',
    }));
    setActiveTab('bitacora');
    setShowFilterBar(true);
  };

  const selectedCompanyForDrawer = useMemo(() => {
    if (!selectedCompanyId) return null;
    return dashboardData.empresas.find((empresa) => empresa.id === selectedCompanyId) || null;
  }, [selectedCompanyId, dashboardData.empresas]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 pb-20">
      <Header
        config={config}
        periodoSeleccionado={`${filtros.mes} ${filtros.anio}`}
        ultimaActualizacion={lastUpdate}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        activeFilterCount={activeFilterCount}
        onToggleFilterBar={() => setShowFilterBar((prev) => !prev)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                {loadingData ? (
                  <LoaderCircle className="h-4 w-4 animate-spin text-slate-500" />
                ) : sourceStatus.mode === 'live' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <CircleOff className="h-4 w-4 text-amber-600" />
                )}
                <span>{loadingData ? 'Cargando datos...' : sourceStatus.label}</span>
              </div>
              <p className="text-sm text-slate-600">{sourceStatus.detail}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700 border border-slate-200">
                {sourceData.registros.length} auditorías cargadas
              </span>
              <button
                onClick={() => setShowGuideModal(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5" />
                Ver guía de GitHub, Netlify y Sheets
              </button>
            </div>
          </div>
        </section>

        {showFilterBar && (
          <FilterBar
            filtros={filtros}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            filtrosDisponibles={dashboardData.filtrosDisponibles}
            activeFilterCount={activeFilterCount}
          />
        )}

        <Top3Podiums
          empresas={dashboardData.empresas}
          areas={dashboardData.areas}
          onSelectCompany={(id) => setSelectedCompanyId(id)}
          onSelectArea={handleSelectArea}
        />

        <section className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {(
                [
                  { id: 'graficos', label: 'Graficos y Tendencias', icon: BarChart3 },
                  { id: 'empresas', label: 'Empresas y Sedes', icon: Building2, count: dashboardData.empresas.length },
                  { id: 'areas', label: 'Areas y Mapa', icon: Layers, count: dashboardData.areas.length },
                  { id: 'bitacora', label: 'Auditorias Recientes', icon: FileSpreadsheet, count: dashboardData.ultimosRegistros.length },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-colors cursor-pointer ${
                      isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mainTabPill"
                        className="absolute inset-0 rounded-xl bg-emerald-600"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="h-4 w-4" />
                      {tab.label}
                      {'count' in tab && (
                        <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'}`}>
                          {tab.count}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeTab === 'empresas' && (
              <div className="flex items-center gap-1 self-end rounded-xl bg-slate-100 p-1 text-xs font-mono font-bold sm:self-auto">
                <button
                  onClick={() => setCompanyViewMode('cards')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all cursor-pointer ${companyViewMode === 'cards' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'}`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" /> Cards
                </button>
                <button
                  onClick={() => setCompanyViewMode('table')}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 transition-all cursor-pointer ${companyViewMode === 'table' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'}`}
                >
                  <TableIcon className="h-3.5 w-3.5" /> Tabla
                </button>
              </div>
            )}

            {activeTab === 'areas' && (
              <div className="flex items-center gap-1 self-end rounded-xl bg-slate-100 p-1 text-xs font-mono font-bold sm:self-auto">
                <button
                  onClick={() => setAreaViewMode('slider')}
                  className={`rounded-lg px-2.5 py-1 cursor-pointer transition-all ${areaViewMode === 'slider' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'}`}
                >
                  Carrusel
                </button>
                <button
                  onClick={() => setAreaViewMode('heatmap')}
                  className={`rounded-lg px-2.5 py-1 cursor-pointer transition-all ${areaViewMode === 'heatmap' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'}`}
                >
                  Mapa termico
                </button>
                <button
                  onClick={() => setAreaViewMode('table')}
                  className={`rounded-lg px-2.5 py-1 cursor-pointer transition-all ${areaViewMode === 'table' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500'}`}
                >
                  Tabla
                </button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (activeTab === 'empresas' ? companyViewMode : activeTab === 'areas' ? areaViewMode : '')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'empresas' && (
                <div>
                  {companyViewMode === 'cards' ? (
                    <CompanyGrid
                      empresas={dashboardData.empresas}
                      onSelectCompany={(id) => setSelectedCompanyId(id)}
                      onSelectArea={handleSelectArea}
                    />
                  ) : (
                    <CompanyRanking
                      empresas={dashboardData.rankingEmpresas}
                      onSelectCompany={(id) => setSelectedCompanyId(id)}
                    />
                  )}
                </div>
              )}

              {activeTab === 'areas' && (
                <div className="space-y-6">
                  {areaViewMode === 'slider' && (
                    <>
                      <AreaSlider areas={dashboardData.areas} onSelectArea={handleSelectArea} />
                      <AreaHeatmap areas={dashboardData.areas} onSelectArea={handleSelectArea} />
                    </>
                  )}

                  {areaViewMode === 'heatmap' && (
                    <AreaHeatmap areas={dashboardData.areas} onSelectArea={handleSelectArea} />
                  )}

                  {areaViewMode === 'table' && (
                    <AreaRanking
                      areas={dashboardData.rankingAreas}
                      empresasFiltro={dashboardData.filtrosDisponibles.empresas}
                      onSelectArea={handleSelectArea}
                    />
                  )}
                </div>
              )}

              {activeTab === 'graficos' && (
                <AnalyticsCharts
                  empresas={dashboardData.empresas}
                  desviosRecurrentes={dashboardData.desviosRecurrentes}
                  evolucionMensual={dashboardData.evolucionMensual}
                  areasConMasDesvios={dashboardData.areasConMasDesvios}
                />
              )}

              {activeTab === 'bitacora' && (
                <RecentDeviationsLog
                  registros={dashboardData.ultimosRegistros}
                  onSelectRegistro={(registro) => setSelectedRegistro(registro)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <footer className="mt-12 border-t border-slate-200/80 bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs font-medium text-slate-500 sm:flex-row">
          <p>DESENCHUFATE - Control Energetico Grupo Zenova</p>
          <button
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-100 px-3 py-1.5 font-bold text-slate-700 transition-colors cursor-pointer hover:bg-slate-200"
          >
            <FileText className="h-3.5 w-3.5 text-slate-600" />
            <span>Guia de integracion</span>
          </button>
        </div>
      </footer>

      <CompanyDetailDrawer
        empresa={selectedCompanyForDrawer}
        registros={dashboardData.ultimosRegistros}
        onClose={() => setSelectedCompanyId(null)}
        onSelectRegistro={(registro) => setSelectedRegistro(registro)}
      />

      <DeviationDetailModal
        registro={selectedRegistro}
        onClose={() => setSelectedRegistro(null)}
      />

      <IntegrationGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
      />
    </div>
  );
}
