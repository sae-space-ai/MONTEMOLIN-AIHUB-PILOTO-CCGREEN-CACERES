import { useState, useCallback } from 'react';
import { translations, type Lang } from './i18n';
import {
  criteria, phases, demoOpportunities, aiCases, energyScenarios, economicScenarios,
  defaultDashboard, type QualificationStatus,
} from './data';

function formatEuro(x: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(x);
}

function statusColor(s: QualificationStatus): string {
  switch (s) {
    case 'VERIFICADO': return 'text-[var(--accent)]';
    case 'PENDIENTE_DE_EVIDENCIA': return 'text-[var(--gold)]';
    default: return 'text-[var(--muted)]';
  }
}

function statusBadgeColor(s: QualificationStatus): string {
  switch (s) {
    case 'VERIFICADO': return 'var(--accent)';
    case 'PENDIENTE_DE_EVIDENCIA': return 'var(--gold)';
    default: return 'var(--muted)';
  }
}

function statusLabel(s: QualificationStatus, lang: Lang): string {
  if (lang === 'en') {
    switch (s) { case 'VERIFICADO': return 'VERIFIED'; case 'PENDIENTE_DE_EVIDENCIA': return 'PENDING'; default: return '—'; }
  }
  switch (s) { case 'VERIFICADO': return 'VERIFICADO'; case 'PENDIENTE_DE_EVIDENCIA': return 'PENDIENTE'; default: return '—'; }
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`border border-[var(--line)] rounded-[14px] bg-gradient-to-br from-[#152e31] to-[#102025] p-5 ${className}`}>{children}</div>;
}

function Badge({ children, color = 'var(--muted)' }: { children: React.ReactNode; color?: string }) {
  return <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border" style={{ borderColor: color, color }}>{children}</span>;
}

function Notice({ children }: { children: React.ReactNode }) {
  return <div className="border-l-3 border-[var(--gold)] px-4 py-2.5 bg-[#28302c] rounded-r-lg text-[#ebdcc3] text-[12px] mt-3">{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[clamp(20px,2.5vw,28px)] tracking-[-0.02em] mb-4 font-bold">{children}</h2>;
}

function Btn({ children, onClick, variant = 'secondary', className = '' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary'; className?: string }) {
  const base = 'inline-block rounded-lg font-bold px-3.5 py-2 cursor-pointer transition-all text-xs';
  const styles = variant === 'primary'
    ? 'bg-[var(--accent)] text-[#0b2521] hover:opacity-90'
    : 'bg-transparent border border-[var(--line)] text-[var(--text)] hover:border-[var(--accent)]';
  return <button onClick={onClick} className={`${base} ${styles} ${className}`}>{children}</button>;
}

function DashCard({ label, value, icon, accent }: { label: string; value: string; icon: string; accent?: boolean }) {
  return (
    <Card className={`!p-3.5 ${accent ? 'border-[var(--accent)]/40' : ''}`}>
      <div className="flex items-start gap-2">
        <span className="text-base">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{label}</div>
          <div className="text-sm font-bold mt-0.5 truncate">{value}</div>
        </div>
      </div>
    </Card>
  );
}

export default function App() {
  const [lang, setLang] = useState<Lang>('es');
  const [checks, setChecks] = useState<boolean[]>(new Array(7).fill(false));
  const [price, setPrice] = useState(56250);
  const [cost, setCost] = useState(45000);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [oppStatuses, setOppStatuses] = useState<QualificationStatus[]>(demoOpportunities.map(() => 'SIN_EVALUAR'));

  const t = translations[lang];
  const checkedCount = checks.filter(Boolean).length;

  const handleCheck = useCallback((i: number) => {
    setChecks(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  }, []);
  const handleReset = useCallback(() => setChecks(new Array(7).fill(false)), []);
  const handleDemo = useCallback(() => setChecks(criteria.map((_, i) => i !== 5)), []);
  const handleRestore = useCallback(() => { setPrice(56250); setCost(45000); }, []);
  const handleExport = useCallback(() => {
    const text = 'FICHA DE EVALUACIÓN\n' +
      criteria.map((x, i) => x.label + ';' + (checks[i] ? 'OK' : '—')).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ficha_evaluacion.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [checks]);

  const cycleOppStatus = useCallback((i: number) => {
    setOppStatuses(prev => {
      const n = [...prev];
      const cycle: QualificationStatus[] = ['SIN_EVALUAR', 'PENDIENTE_DE_EVIDENCIA', 'VERIFICADO'];
      n[i] = cycle[(cycle.indexOf(n[i]) + 1) % cycle.length];
      return n;
    });
  }, []);

  const margin = price - cost;
  const percent = ((price - cost) / price * 100).toFixed(1).replace('.', ',') + ' %';

  const energyProd = 41250;
  const aiConsumption = Math.round(energyProd * 0.12);
  const costPerTask = 0.023;
  const flexibilityPct = 18;

  const navItems = [
    { id: 'dashboard', label: t.nav_dashboard },
    { id: 'evaluacion', label: t.nav_evaluation },
    { id: 'ai', label: t.nav_ai },
    { id: 'energia', label: t.nav_energy },
    { id: 'economia', label: t.nav_economics },
    { id: 'consorcio', label: t.nav_consortium },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4">
      {/* ====== HEADER ====== */}
      <header className="flex justify-between gap-4 items-center flex-wrap pb-3 border-b border-[var(--line)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[#4aaa7a] flex items-center justify-center font-black text-[#0b2521] text-xs">M</div>
          <div className="font-extrabold tracking-wider text-sm leading-tight">
            MONTEMOLIN<span className="text-[var(--accent)]">—AIHUB</span>
          </div>
        </div>
        <nav className="flex gap-0.5 flex-wrap">
          {navItems.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className={`text-[11px] px-2.5 py-1.5 rounded-md transition-colors cursor-pointer ${activeSection === item.id ? 'text-[var(--accent)] bg-[var(--accent)]/10 font-bold' : 'text-[var(--muted)] hover:text-[var(--text)]'}`}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="text-[11px] border border-[var(--line)] rounded-md px-2 py-1 text-[var(--muted)] cursor-pointer hover:border-[var(--accent)] transition-colors font-bold">
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <button onClick={() => window.print()}
            className="text-[11px] border border-[var(--line)] rounded-md px-2 py-1 text-[var(--muted)] cursor-pointer hover:border-[var(--accent)] transition-colors">
            🖨
          </button>
        </div>
      </header>

      {/* ====== DASHBOARD ====== */}
      <section id="dashboard" className="mt-5 mb-8">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <SectionTitle>{t.dash_title}</SectionTitle>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse"></span>
            <span className="text-[11px] text-[var(--muted)]">{defaultDashboard.pilotStatus}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <DashCard label={t.dash_phase} value={`${defaultDashboard.currentPhase} / 5`} icon="📅" accent />
          <DashCard label={t.dash_opps} value={String(defaultDashboard.opportunitiesAnalyzed)} icon="🔍" />
          <DashCard label={t.dash_cases} value={String(defaultDashboard.casesInEvaluation)} icon="🧪" />
          <DashCard label={t.dash_criteria} value={`${checkedCount} / 7`} icon="✅" />
          <DashCard label={t.dash_risks} value={String(defaultDashboard.pendingRisks)} icon="⚠️" />
          <DashCard label={t.dash_cost} value={formatEuro(defaultDashboard.estimatedCost)} icon="💶" />
          <DashCard label={t.dash_next} value={defaultDashboard.nextDecision} icon="🎯" />
          <DashCard label={lang === 'es' ? 'Progreso' : 'Progress'} value={`${Math.round((checkedCount / 7) * 100)}%`} icon="📊" accent />
        </div>
      </section>

      {/* ====== EVALUATION ====== */}
      <section id="evaluacion" className="my-6 mb-8">
        <SectionTitle>{t.eval_title}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold">{lang === 'es' ? 'Criterios' : 'Criteria'}</div>
              <Badge color="var(--accent)">{checkedCount}/7</Badge>
            </div>
            <div className="h-1.5 bg-[#29443f] rounded-full overflow-hidden mb-3">
              <div className="h-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${(checkedCount / 7) * 100}%` }} />
            </div>
            {criteria.map((c, i) => (
              <label key={c.id} className="flex gap-2.5 items-start p-2 border border-[var(--line)] rounded-lg my-1 cursor-pointer hover:border-[var(--accent)]/40 transition-colors">
                <input type="checkbox" checked={checks[i]} onChange={() => handleCheck(i)}
                  className="accent-[var(--accent)] w-4 h-4 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <strong className="block text-xs">{c.label}</strong>
                  <span className="text-[10px] text-[var(--muted)]">{c.description}</span>
                </div>
              </label>
            ))}
            <div className="flex gap-1.5 flex-wrap mt-3">
              <Btn onClick={handleReset}>{t.btn_reset}</Btn>
              <Btn onClick={handleDemo}>{t.btn_demo}</Btn>
              <Btn onClick={handleExport}>{t.btn_export}</Btn>
            </div>
          </Card>

          <Card>
            <div className="text-xs font-bold mb-3">{lang === 'es' ? 'Oportunidades' : 'Opportunities'}</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="text-[var(--muted)]">
                    <th className="text-left py-1.5 border-b border-[var(--line)]">ID</th>
                    <th className="text-left py-1.5 border-b border-[var(--line)]">{lang === 'es' ? 'Sector' : 'Sector'}</th>
                    <th className="text-left py-1.5 border-b border-[var(--line)] hidden md:table-cell">{lang === 'es' ? 'Problema' : 'Problem'}</th>
                    <th className="text-left py-1.5 border-b border-[var(--line)]">{lang === 'es' ? 'Estado' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {demoOpportunities.map((opp, i) => (
                    <tr key={opp.id} className="cursor-pointer hover:bg-[var(--accent)]/5" onClick={() => cycleOppStatus(i)}>
                      <td className="py-1.5 border-b border-[var(--line)] font-mono">{opp.id}</td>
                      <td className="py-1.5 border-b border-[var(--line)]">{opp.sector}</td>
                      <td className="py-1.5 border-b border-[var(--line)] text-[var(--muted)] hidden md:table-cell">{opp.problem}</td>
                      <td className="py-1.5 border-b border-[var(--line)]">
                        <Badge color={statusBadgeColor(oppStatuses[i])}>{statusLabel(oppStatuses[i], lang)}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* ====== ROADMAP ====== */}
      <section className="my-6 mb-8">
        <SectionTitle>{t.plan_title}</SectionTitle>
        <Card>
          {phases.map((phase, i) => (
            <div key={i} className={`flex gap-3 py-2.5 ${i < phases.length - 1 ? 'border-b border-[var(--line)]' : ''}`}>
              <div className="min-w-[68px] shrink-0">
                <div className="text-[11px] text-[var(--accent)] font-bold">{phase.period}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-xs font-semibold">{phase.title}</h3>
                  <Badge color={phase.status === 'active' ? 'var(--gold)' : 'var(--muted)'}>
                    {phase.status === 'active' ? (lang === 'es' ? 'ACTIVA' : 'ACTIVE') : (lang === 'es' ? 'PENDIENTE' : 'PENDING')}
                  </Badge>
                </div>
                <p className="text-[var(--muted)] my-0 text-[11px]">{phase.description}</p>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* ====== AI CASES ====== */}
      <section id="ai" className="my-6 mb-8">
        <SectionTitle>{t.ai_title}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiCases.map(c => (
            <Card key={c.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{c.type === 'documental' ? '📄' : '👁'}</span>
                  <div>
                    <div className="text-xs font-bold">{c.id === 'CASE-A' ? t.ai_doc_title : t.ai_vision_title}</div>
                    <div className="text-[10px] text-[var(--muted)] font-mono">{c.id}</div>
                  </div>
                </div>
                <Badge color="var(--gold)">{c.status}</Badge>
              </div>
              <div className="space-y-1">
                {c.metrics.map((m, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-[var(--line)] last:border-0 text-[11px]">
                    <div className="flex-1 min-w-0">
                      <div className="text-[var(--text)] truncate">{m.label}</div>
                      <div className="text-[10px] text-[var(--muted)] truncate">{m.note}</div>
                    </div>
                    <div className="text-xs font-mono text-[var(--muted)] ml-2">{m.value}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ====== ENERGY ====== */}
      <section id="energia" className="my-6 mb-8">
        <SectionTitle>{t.energy_title}</SectionTitle>
        <div className="text-[10px] tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2 uppercase">{t.energy_module}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {energyScenarios.map((s, i) => (
            <Card key={i} className="!p-4">
              <div className="text-[10px] font-bold text-[var(--accent)] mb-1">{s.label}</div>
              <div className="text-2xl font-extrabold tracking-[-0.03em]">{s.power}</div>
              <div className="text-xs text-[var(--text)] mt-0.5">{s.production}</div>
              <div className="text-xs text-[var(--muted)]">{s.investment}</div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-3">
          <Card className="!p-3">
            <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{t.energy_sim_prod}</div>
            <div className="text-lg font-extrabold mt-0.5">{energyProd.toLocaleString('es-ES')} <span className="text-[10px] font-normal text-[var(--muted)]">MWh</span></div>
          </Card>
          <Card className="!p-3">
            <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{t.energy_sim_ai}</div>
            <div className="text-lg font-extrabold mt-0.5">{aiConsumption.toLocaleString('es-ES')} <span className="text-[10px] font-normal text-[var(--muted)]">MWh</span></div>
          </Card>
          <Card className="!p-3">
            <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{t.energy_sim_task}</div>
            <div className="text-lg font-extrabold mt-0.5">€{costPerTask}</div>
          </Card>
          <Card className="!p-3">
            <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{t.energy_sim_flex}</div>
            <div className="text-lg font-extrabold mt-0.5">{flexibilityPct}%</div>
          </Card>
        </div>
        <Notice>{t.energy_warning}</Notice>
      </section>

      {/* ====== ECONOMICS ====== */}
      <section id="economia" className="my-6 mb-8">
        <SectionTitle>{t.econ_title}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card>
            <div className="text-[10px] tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2 uppercase">{t.econ_ref}</div>
            <table className="w-full border-collapse text-xs">
              <tbody>
                <tr><td className="border-b border-[var(--line)] py-1.5">{t.econ_table_cost}</td><td className="border-b border-[var(--line)] py-1.5 text-right font-mono">45.000 €</td></tr>
                <tr><td className="border-b border-[var(--line)] py-1.5">{t.econ_table_price}</td><td className="border-b border-[var(--line)] py-1.5 text-right font-mono">56.250 €</td></tr>
                <tr><td className="border-b border-[var(--line)] py-1.5">{t.econ_table_margin}</td><td className="border-b border-[var(--line)] py-1.5 text-right font-mono">11.250 €</td></tr>
                <tr><td className="border-b border-[var(--line)] py-1.5">{t.econ_table_percent}</td><td className="border-b border-[var(--line)] py-1.5 text-right font-mono">20 %</td></tr>
              </tbody>
            </table>
            <p className="text-[10px] text-[var(--muted)] mt-1.5">{t.econ_table_note}</p>

            <div className="text-xs font-semibold mt-4 mb-2">{t.econ_scenarios}</div>
            <div className="space-y-1.5">
              {economicScenarios.map((s, i) => {
                const m = s.price - s.cost;
                const mp = ((m / s.price) * 100).toFixed(1);
                return (
                  <div key={i} className="flex justify-between items-center py-1.5 px-2.5 border border-[var(--line)] rounded-lg text-xs">
                    <div>
                      <div className="font-bold">{s.name}</div>
                      <div className="text-[10px] text-[var(--muted)]">{s.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono" style={{ color: m >= 0 ? 'var(--accent)' : '#f2a995' }}>{formatEuro(m)}</div>
                      <div className="text-[10px] text-[var(--muted)]">{mp}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <div className="text-[10px] tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2 uppercase">{t.econ_sim}</div>
            <label className="block my-3">
              <div className="flex justify-between mb-1 text-xs">
                <span>{t.econ_price}</span>
                <span className="font-bold font-mono">{formatEuro(price)}</span>
              </div>
              <input type="range" min={30000} max={90000} step={250} value={price}
                onChange={e => setPrice(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
            </label>
            <label className="block my-3">
              <div className="flex justify-between mb-1 text-xs">
                <span>{t.econ_cost}</span>
                <span className="font-bold font-mono">{formatEuro(cost)}</span>
              </div>
              <input type="range" min={25000} max={80000} step={250} value={cost}
                onChange={e => setCost(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
            </label>
            <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{t.econ_margin}</div>
            <div className="text-3xl font-extrabold tracking-[-0.03em] mt-0.5" style={{ color: margin < 0 ? '#f2a995' : 'var(--accent)' }}>
              {formatEuro(margin)}
            </div>
            <p className="text-[var(--muted)] text-xs">{percent}</p>
            <Notice>{t.econ_notice}</Notice>
            <div className="flex gap-1.5 flex-wrap mt-3">
              <Btn onClick={handleRestore}>{t.btn_restore}</Btn>
            </div>
          </Card>
        </div>
      </section>

      {/* ====== CONSORTIUM ====== */}
      <section id="consorcio" className="my-6 mb-8">
        <SectionTitle>{t.cons_title}</SectionTitle>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="flex gap-5 mb-3">
                <div>
                  <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{t.cons_ref}</div>
                  <div className="text-xs font-mono font-bold">SEP-211421662</div>
                </div>
                <div>
                  <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{t.cons_call}</div>
                  <div className="text-xs font-mono font-bold">I3-2026-INV2a</div>
                </div>
              </div>
              <p className="text-[var(--muted)] text-xs">{t.cons_desc}</p>
            </div>
            <div>
              <div className="text-xs font-semibold mb-2">{t.cons_matrix}</div>
              <div className="space-y-1">
                {[
                  lang === 'es' ? 'Socio técnico en IA' : 'Technical AI partner',
                  lang === 'es' ? 'Complementariedad energética' : 'Energy complementarity',
                  lang === 'es' ? 'Mapa territorial' : 'Territorial mapping',
                  lang === 'es' ? 'Co-diseño de entregables' : 'Co-design deliverables',
                  lang === 'es' ? 'Difusión y resultados' : 'Dissemination & results',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-1 px-2.5 border border-[var(--line)] rounded-lg text-[11px]">
                    <span className="text-[var(--accent)] text-[10px]">○</span>
                    <span className="flex-1">{item}</span>
                    <Badge color="var(--gold)">{lang === 'es' ? 'SUJETO' : 'SUBJECT'}</Badge>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-2">{t.cons_matrix_note}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-[var(--line)] pt-4 pb-4 flex justify-between items-center flex-wrap gap-2 text-[var(--muted)] text-[10px]">
        <div>© MONTEMOLIN-AIHUB</div>
        <div className="flex items-center gap-2">
          <a href="https://montemolin-aihub.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] no-underline hover:underline">montemolin-aihub.vercel.app</a>
        </div>
      </footer>
    </div>
  );
}
