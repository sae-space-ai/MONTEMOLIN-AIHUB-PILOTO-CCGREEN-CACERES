// ============================================================
// MONTEMOLIN-AIHUB — Data & Types
// ============================================================

export type QualificationStatus = 'SIN_EVALUAR' | 'PENDIENTE_DE_EVIDENCIA' | 'VERIFICADO';

export interface Criterion {
  id: number;
  label: string;
  description: string;
  status: QualificationStatus;
}

export interface Opportunity {
  id: string;
  sector: string;
  problem: string;
  decisionMaker: string;
  dataAvailable: boolean;
  technicalViability: QualificationStatus;
  economicViability: QualificationStatus;
  ccgreenFit: QualificationStatus;
  nextStep: string;
  overallStatus: QualificationStatus;
}

export interface Phase {
  period: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'pending';
}

export interface AICase {
  id: string;
  name: string;
  type: 'documental' | 'vision';
  metrics: { label: string; value: string; note: string }[];
  status: string;
}

export interface EnergyScenario {
  label: string;
  power: string;
  production: string;
  investment: string;
  note: string;
}

export interface EconomicScenario {
  name: string;
  cost: number;
  price: number;
  description: string;
}

// ---- CRITERIA ----
export const criteria: Criterion[] = [
  { id: 1, label: 'Necesidad documentada', description: 'Problema y beneficiario identificados', status: 'SIN_EVALUAR' },
  { id: 2, label: 'Interlocutor', description: 'Responsable de decisión identificado', status: 'SIN_EVALUAR' },
  { id: 3, label: 'Datos y permisos', description: 'Fuentes disponibles y derechos de uso', status: 'SIN_EVALUAR' },
  { id: 4, label: 'Viabilidad técnica', description: 'Prueba medible y restricciones conocidas', status: 'SIN_EVALUAR' },
  { id: 5, label: 'Viabilidad económica', description: 'Costes y financiación evaluados', status: 'SIN_EVALUAR' },
  { id: 6, label: 'Encaje estratégico', description: 'Alineación con objetivos verificada', status: 'SIN_EVALUAR' },
  { id: 7, label: 'Próxima acción', description: 'Paso concreto definido', status: 'SIN_EVALUAR' },
];

// ---- PHASES ----
export const phases: Phase[] = [
  { period: 'Días 1–15', title: 'Validación inicial', description: 'Definición de alcance, interlocutores y reglas de acceso.', status: 'active' },
  { period: 'Días 16–30', title: 'Mapa territorial', description: 'Identificación de actores, necesidades y línea base.', status: 'pending' },
  { period: 'Días 31–60', title: 'Pruebas de concepto', description: 'Hasta dos casos con datos autorizados y criterios previos.', status: 'pending' },
  { period: 'Días 61–75', title: 'Viabilidad', description: 'Evaluación de costes, requisitos, capacidades y barreras.', status: 'pending' },
  { period: 'Días 76–90', title: 'Dossier de decisión', description: 'Entrega de evidencias y recomendación ejecutiva.', status: 'pending' },
];

// ---- DEMO OPPORTUNITIES ----
export const demoOpportunities: Opportunity[] = [
  {
    id: 'OPP-001',
    sector: 'Agroalimentario',
    problem: 'Clasificación documental de certificados',
    decisionMaker: 'Por definir',
    dataAvailable: false,
    technicalViability: 'PENDIENTE_DE_EVIDENCIA',
    economicViability: 'SIN_EVALUAR',
    ccgreenFit: 'SIN_EVALUAR',
    nextStep: 'Identificar interlocutor',
    overallStatus: 'SIN_EVALUAR',
  },
  {
    id: 'OPP-002',
    sector: 'Manufactura',
    problem: 'Control de calidad por visión artificial',
    decisionMaker: 'Por definir',
    dataAvailable: false,
    technicalViability: 'PENDIENTE_DE_EVIDENCIA',
    economicViability: 'SIN_EVALUAR',
    ccgreenFit: 'SIN_EVALUAR',
    nextStep: 'Evaluar datos disponibles',
    overallStatus: 'SIN_EVALUAR',
  },
  {
    id: 'OPP-003',
    sector: 'Energía',
    problem: 'Optimización de consumo en instalaciones',
    decisionMaker: 'Por definir',
    dataAvailable: false,
    technicalViability: 'SIN_EVALUAR',
    economicViability: 'SIN_EVALUAR',
    ccgreenFit: 'SIN_EVALUAR',
    nextStep: 'Explorar viabilidad',
    overallStatus: 'SIN_EVALUAR',
  },
];

// ---- AI CASES ----
export const aiCases: AICase[] = [
  {
    id: 'CASE-A',
    name: 'Inteligencia documental',
    type: 'documental',
    metrics: [
      { label: 'Extracción de información', value: '—', note: 'Pendiente de validación' },
      { label: 'Clasificación automática', value: '—', note: 'Requiere corpus de prueba' },
      { label: 'Búsqueda semántica', value: '—', note: 'Pendiente de definición' },
      { label: 'Revisión humana', value: '—', note: 'A determinar' },
      { label: 'Tiempo por tarea', value: '—', note: 'Sin datos de referencia' },
      { label: 'Coste estimado', value: '—', note: 'Pendiente de validación' },
    ],
    status: 'EN EVALUACIÓN',
  },
  {
    id: 'CASE-B',
    name: 'Visión artificial industrial',
    type: 'vision',
    metrics: [
      { label: 'Detección de anomalías', value: '—', note: 'Pendiente de imágenes' },
      { label: 'Precisión', value: '—', note: 'Sin pruebas ejecutadas' },
      { label: 'Falsos positivos', value: '—', note: 'Sin datos de validación' },
      { label: 'Falsos negativos', value: '—', note: 'Sin datos de validación' },
      { label: 'Latencia', value: '—', note: 'Depende de infraestructura' },
      { label: 'Integración', value: '—', note: 'Pendiente de evaluación' },
    ],
    status: 'EN EVALUACIÓN',
  },
];

// ---- ENERGY SCENARIOS ----
export const energyScenarios: EnergyScenario[] = [
  { label: 'Escenario base', power: '25 MWp', production: '41.250 MWh/año', investment: '22,24 M€', note: 'Modelización de prefactibilidad' },
  { label: 'Conservador', power: '20 MWp', production: '33.000 MWh/año', investment: '17,80 M€', note: 'Hipótesis reducida' },
  { label: 'Ampliado', power: '30 MWp', production: '49.500 MWh/año', investment: '26,70 M€', note: 'Hipótesis extendida' },
];

// ---- ECONOMIC SCENARIOS ----
export const economicScenarios: EconomicScenario[] = [
  { name: 'Reducido', cost: 35000, price: 43750, description: '1 demostrador · 60 días' },
  { name: 'Base', cost: 45000, price: 56250, description: '2 demostradores · 90 días' },
  { name: 'Ampliado', cost: 65000, price: 81250, description: '3+ demostradores · 120 días' },
];

// ---- DASHBOARD STATE ----
export interface DashboardState {
  pilotStatus: string;
  currentPhase: number;
  opportunitiesAnalyzed: number;
  casesInEvaluation: number;
  criteriaQualified: number;
  pendingRisks: number;
  estimatedCost: number;
  nextDecision: string;
}

export const defaultDashboard: DashboardState = {
  pilotStatus: 'Fase 1 — Validación',
  currentPhase: 1,
  opportunitiesAnalyzed: 3,
  casesInEvaluation: 2,
  criteriaQualified: 0,
  pendingRisks: 4,
  estimatedCost: 45000,
  nextDecision: 'Confirmar alcance',
};
