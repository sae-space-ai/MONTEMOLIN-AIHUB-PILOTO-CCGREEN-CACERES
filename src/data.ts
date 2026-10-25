// ============================================================
// MONTEMOLIN-AIHUB — CCGreen Cáceres — Datos y tipos
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
  { id: 1, label: 'Necesidad territorial documentada', description: 'Problema real y beneficiario identificados', status: 'SIN_EVALUAR' },
  { id: 2, label: 'Interlocutor autorizado', description: 'Responsable capaz de evaluar la colaboración', status: 'SIN_EVALUAR' },
  { id: 3, label: 'Datos y permisos', description: 'Fuentes disponibles y derechos de uso', status: 'SIN_EVALUAR' },
  { id: 4, label: 'Viabilidad técnica', description: 'Prueba medible y restricciones conocidas', status: 'SIN_EVALUAR' },
  { id: 5, label: 'Viabilidad económica', description: 'Costes, financiación y contratación evaluados', status: 'SIN_EVALUAR' },
  { id: 6, label: 'Encaje confirmado con CCGreen', description: 'Validación expresa del promotor; nunca presupuesta', status: 'SIN_EVALUAR' },
  { id: 7, label: 'Próxima acción aceptada', description: 'Reunión o paso concreto confirmado por ambas partes', status: 'SIN_EVALUAR' },
];

// ---- PHASES ----
export const phases: Phase[] = [
  { period: 'Días 1–15', title: 'Validar interés y alcance', description: 'Interlocutor, problema concreto, reglas de acceso, responsabilidades y contratación. Si no hay encaje, detener.', status: 'active' },
  { period: 'Días 16–30', title: 'Mapa territorial', description: 'Explorar actores, necesidades, permisos y línea base; no se presupone participación empresarial.', status: 'pending' },
  { period: 'Días 31–60', title: 'Pruebas de concepto', description: 'Hasta dos casos en infraestructura independiente, con datos autorizados y criterios de evaluación previos.', status: 'pending' },
  { period: 'Días 61–75', title: 'Viabilidad y valor territorial', description: 'Evaluar costes, requisitos, seguridad, capacidades, barreras y potencial de transferencia.', status: 'pending' },
  { period: 'Días 76–90', title: 'Dossier de decisión', description: 'Entregar evidencias y recomendar continuar, reformular o cerrar.', status: 'pending' },
];

// ---- DEMO OPPORTUNITIES ----
export const demoOpportunities: Opportunity[] = [
  {
    id: 'OPP-001',
    sector: 'Agroalimentario',
    problem: 'Clasificación documental de certificados y trazabilidad',
    decisionMaker: 'Sin confirmar',
    dataAvailable: false,
    technicalViability: 'PENDIENTE_DE_EVIDENCIA',
    economicViability: 'SIN_EVALUAR',
    ccgreenFit: 'SIN_EVALUAR',
    nextStep: 'Identificar interlocutor',
    overallStatus: 'SIN_EVALUAR',
  },
  {
    id: 'OPP-002',
    sector: 'Industria manufacturera',
    problem: 'Control de calidad por visión artificial',
    decisionMaker: 'Sin confirmar',
    dataAvailable: false,
    technicalViability: 'PENDIENTE_DE_EVIDENCIA',
    economicViability: 'SIN_EVALUAR',
    ccgreenFit: 'SIN_EVALUAR',
    nextStep: 'Evaluar disponibilidad de datos',
    overallStatus: 'SIN_EVALUAR',
  },
  {
    id: 'OPP-003',
    sector: 'Energía / Servicios',
    problem: 'Optimización de consumo en instalaciones',
    decisionMaker: 'Sin confirmar',
    dataAvailable: false,
    technicalViability: 'SIN_EVALUAR',
    economicViability: 'SIN_EVALUAR',
    ccgreenFit: 'SIN_EVALUAR',
    nextStep: 'Explorar viabilidad inicial',
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
      { label: 'Extracción de información', value: '—', note: 'Pendiente de datos reales' },
      { label: 'Clasificación automática', value: '—', note: 'Requiere corpus de prueba' },
      { label: 'Búsqueda semántica', value: '—', note: 'Pendiente de definición de alcance' },
      { label: 'Revisión humana necesaria', value: '—', note: 'A determinar según caso' },
      { label: 'Tiempo estimado por tarea', value: '—', note: 'Sin datos de referencia' },
      { label: 'Coste estimado', value: '—', note: 'Hipótesis pendiente de validación' },
    ],
    status: 'SIMULACIÓN — Sin datos reales',
  },
  {
    id: 'CASE-B',
    name: 'Visión artificial industrial',
    type: 'vision',
    metrics: [
      { label: 'Detección de anomalías', value: '—', note: 'Pendiente de imágenes de prueba' },
      { label: 'Precisión estimada', value: '—', note: 'No se han ejecutado pruebas' },
      { label: 'Falsos positivos', value: '—', note: 'Sin datos de validación' },
      { label: 'Falsos negativos', value: '—', note: 'Sin datos de validación' },
      { label: 'Latencia objetivo', value: '—', note: 'Depende de infraestructura' },
      { label: 'Requisitos de integración', value: '—', note: 'Pendiente de evaluación técnica' },
    ],
    status: 'SIMULACIÓN — Sin datos reales',
  },
];

// ---- ENERGY SCENARIOS ----
export const energyScenarios: EnergyScenario[] = [
  { label: 'Escenario base', power: '25 MWp', production: '41.250 MWh/año', investment: '22,24 M€', note: 'Modelización de prefactibilidad RURAL-GOV-ENERGY' },
  { label: 'Escenario conservador', power: '20 MWp', production: '33.000 MWh/año', investment: '17,80 M€', note: 'Hipótesis reducida, no verificada' },
  { label: 'Escenario ampliado', power: '30 MWp', production: '49.500 MWh/año', investment: '26,70 M€', note: 'Hipótesis extendida, no verificada' },
];

// ---- ECONOMIC SCENARIOS ----
export const economicScenarios: EconomicScenario[] = [
  { name: 'Reducido', cost: 35000, price: 43750, description: 'Alcance mínimo: 1 demostrador, 60 días' },
  { name: 'Base', cost: 45000, price: 56250, description: 'Alcance de referencia: 2 demostradores, 90 días' },
  { name: 'Ampliado', cost: 65000, price: 81250, description: 'Alcance extendido: 3+ demostradores, 120 días' },
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
  pilotStatus: 'FASE 1 — Validación inicial',
  currentPhase: 1,
  opportunitiesAnalyzed: 0,
  casesInEvaluation: 0,
  criteriaQualified: 0,
  pendingRisks: 4,
  estimatedCost: 45000,
  nextDecision: 'Confirmar interlocutor y alcance',
};
