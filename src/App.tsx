import { useState, useCallback } from 'react';
import { translations, type Lang } from './i18n';
import {
  criteria, phases, demoOpportunities, aiCases, energyScenarios, economicScenarios,
  defaultDashboard, type QualificationStatus,
} from './data';

// ---- Helpers ----
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

function statusLabel(s: QualificationStatus, lang: Lang): string {
  if (lang === 'en') {
    switch (s) {
      case 'VERIFICADO': return 'VERIFIED';
      case 'PENDIENTE_DE_EVIDENCIA': return 'PENDING EVIDENCE';
      default: return 'NOT EVALUATED';
    }
  }
  switch (s) {
    case 'VERIFICADO': return 'VERIFICADO';
    case 'PENDIENTE_DE_EVIDENCIA': return 'PENDIENTE DE EVIDENCIA';
    default: return 'SIN EVALUAR';
  }
}

// ---- Reusable Card ----
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-[var(--line)] rounded-[17px] bg-gradient-to-br from-[#152e31] to-[#102025] p-5 ${className}`}>
      {children}
    </div>
  );
}

function Badge({ children, color = 'var(--muted)' }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border" style={{ borderColor: color, color }}>
      {children}
    </span>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-3 border-[var(--gold)] px-4 py-3 bg-[#28302c] rounded-r-lg text-[#ebdcc3] text-[13px] mt-4">
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[clamp(24px,3vw,35px)] tracking-[-0.03em] mb-4 font-bold">{children}</h2>;
}

function Btn({ children, onClick, variant = 'secondary', className = '' }: { children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary'; className?: string }) {
  const base = 'inline-block rounded-[10px] font-bold px-4 py-3 cursor-pointer transition-all text-sm';
  const styles = variant === 'primary'
    ? 'bg-[var(--accent)] text-[#0b2521] hover:opacity-90'
    : 'bg-transparent border border-[var(--line)] text-[var(--text)] hover:border-[var(--accent)]';
  return <button onClick={onClick} className={`${base} ${styles} ${className}`}>{children}</button>;
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [lang, setLang] = useState<Lang>('es');
  const [checks, setChecks] = useState<boolean[]>(new Array(7).fill(false));
  const [price, setPrice] = useState(56250);
  const [cost, setCost] = useState(45000);
  const [activeSection, setActiveSection] = useState('dashboard');

  const t = translations[lang];
  const checkedCount = checks.filter(Boolean).length;

  // Handlers
  const handleCheck = useCallback((i: number) => {
    setChecks(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  }, []);
  const handleReset = useCallback(() => setChecks(new Array(7).fill(false)), []);
  const handleDemo = useCallback(() => setChecks(criteria.map((_, i) => i !== 5)), []);
  const handleRestore = useCallback(() => { setPrice(56250); setCost(45000); }, []);
  const handleExport = useCallback(() => {
    const text = 'SIMULACIÓN CCGREEN — NO ES EVIDENCIA REAL\n' +
      criteria.map((x, i) => x.label + ';' + (checks[i] ? 'MARCADO DEMO' : 'PENDIENTE')).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ccgreen_ficha_demo.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [checks]);

  const margin = price - cost;
  const percent = ((price - cost) / price * 100).toFixed(1).replace('.', ',') + ' %';
  const statusText = checkedCount === 7 ? t.status_full : checkedCount > 0 ? t.status_partial : t.status_none;

  // Energy simulation values
  const energyProd = 41250;
  const aiConsumption = Math.round(energyProd * 0.12);
  const costPerTask = 0.023;
  const flexibilityPct = 18;

  // Nav items
  const navItems = [
    { id: 'dashboard', label: t.nav_dashboard },
    { id: 'valor', label: t.nav_proposal },
    { id: 'plan', label: t.nav_plan },
    { id: 'evaluacion', label: t.nav_evaluation },
    { id: 'ai', label: t.nav_ai },
    { id: 'energia', label: t.nav_energy },
    { id: 'economia', label: t.nav_economics },
    { id: 'consorcio', label: t.nav_consortium },
    { id: 'alianza', label: t.nav_alliance },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1180px] mx-auto px-4 md:px-6 py-6">
      {/* ====== HEADER ====== */}
      <header className="flex justify-between gap-4 items-center flex-wrap">
        <div className="font-extrabold tracking-wider text-lg">
          MONTEMOLIN<span className="text-[var(--accent)]">—AIHUB</span>
        </div>
        <nav className="flex gap-2 flex-wrap">
          {navItems.map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)}
              className={`text-[12px] px-2 py-1 rounded-md transition-colors cursor-pointer ${activeSection === item.id ? 'text-[var(--accent)] bg-[var(--accent)]/10' : 'text-[var(--muted)] hover:text-[var(--accent)]'}`}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="text-xs border border-[var(--line)] rounded-full px-2.5 py-0.5 text-[var(--muted)] cursor-pointer hover:border-[var(--accent)] transition-colors">
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <div className="border border-[var(--line)] rounded-full px-3 py-1 text-[var(--muted)] text-xs">{t.tag}</div>
        </div>
      </header>

      {/* ====== HERO ====== */}
      <div className="pt-14 md:pt-20 pb-12">
        <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)]">{t.eyebrow}</div>
        <h1 className="text-[clamp(34px,6vw,64px)] leading-[1.08] tracking-[-0.05em] max-w-[880px] my-3 font-bold">
          {t.title_part1} <span className="text-[var(--accent)]">{t.title_part2}</span>
        </h1>
        <p className="text-xl max-w-[800px] text-[var(--muted)] my-2">{t.lead}</p>
        <div className="flex gap-2.5 flex-wrap mt-6">
          <button onClick={() => scrollTo('evaluacion')} className="inline-block bg-[var(--accent)] rounded-[10px] text-[#0b2521] font-bold px-4 py-3 cursor-pointer hover:opacity-90 transition-opacity text-sm">
            {t.btn_eval}
          </button>
          <button onClick={() => scrollTo('alianza')} className="inline-block bg-transparent border border-[var(--line)] rounded-[10px] text-[var(--text)] font-bold px-4 py-3 cursor-pointer hover:border-[var(--accent)] transition-colors text-sm">
            {t.btn_collab}
          </button>
        </div>
        <p className="text-xs text-[var(--muted)] mt-4">{t.disclaimer_hero}</p>
      </div>

      {/* ====== DASHBOARD ====== */}
      <section id="dashboard" className="my-8 mb-14">
        <SectionTitle>{t.dash_title}</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <DashCard label={t.dash_status} value={defaultDashboard.pilotStatus} icon="📡" />
          <DashCard label={t.dash_phase} value={`${defaultDashboard.currentPhase} / 5`} icon="📅" />
          <DashCard label={t.dash_opps} value={String(demoOpportunities.length)} icon="🔍" />
          <DashCard label={t.dash_cases} value={String(aiCases.length)} icon="🧪" />
          <DashCard label={t.dash_criteria} value={`${checkedCount} / 7`} icon="✅" />
          <DashCard label={t.dash_risks} value={String(defaultDashboard.pendingRisks)} icon="⚠️" />
          <DashCard label={t.dash_cost} value={formatEuro(defaultDashboard.estimatedCost)} icon="💶" />
          <DashCard label={t.dash_next} value={defaultDashboard.nextDecision} icon="🎯" />
        </div>
        <Notice>{t.dash_note}</Notice>
      </section>

      {/* ====== VALUE PROPOSITION ====== */}
      <section id="valor" className="my-8 mb-14">
        <SectionTitle>{t.value_title}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2">A · {lang === 'es' ? 'Empresas' : 'Business'}</div>
            <h3 className="text-lg font-semibold mb-2">{t.val_a_title}</h3>
            <p className="text-[var(--muted)] my-1.5 text-sm">{t.val_a_desc}</p>
          </Card>
          <Card>
            <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2">B · {lang === 'es' ? 'Tecnología' : 'Technology'}</div>
            <h3 className="text-lg font-semibold mb-2">{t.val_b_title}</h3>
            <p className="text-[var(--muted)] my-1.5 text-sm">{t.val_b_desc}</p>
          </Card>
          <Card>
            <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2">C · {lang === 'es' ? 'Energía' : 'Energy'}</div>
            <h3 className="text-lg font-semibold mb-2">{t.val_c_title}</h3>
            <p className="text-[var(--muted)] my-1.5 text-sm">{t.val_c_desc}</p>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card>
            <div className="text-4xl font-extrabold tracking-[-0.04em]">{t.metric_days}</div>
            <div className="text-xs text-[var(--muted)]">{t.metric_days_desc}</div>
          </Card>
          <Card>
            <div className="text-4xl font-extrabold tracking-[-0.04em]">{t.metric_demos}</div>
            <div className="text-xs text-[var(--muted)]">{t.metric_demos_desc}</div>
          </Card>
          <Card>
            <div className="text-4xl font-extrabold tracking-[-0.04em]">{t.metric_zero}</div>
            <div className="text-xs text-[var(--muted)]">{t.metric_zero_desc}</div>
          </Card>
        </div>
      </section>

      {/* ====== ROADMAP ====== */}
      <section id="plan" className="my-8 mb-14">
        <SectionTitle>{t.plan_title}</SectionTitle>
        <Card>
          {phases.map((phase, i) => (
            <div key={i} className={`flex gap-5 py-4 ${i < phases.length - 1 ? 'border-b border-[var(--line)]' : ''}`}>
              <b className="min-w-[78px] text-[var(--accent)] shrink-0 text-sm">{phase.period}</b>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold">{phase.title}</h3>
                  <Badge color={phase.status === 'active' ? 'var(--gold)' : phase.status === 'completed' ? 'var(--accent)' : 'var(--muted)'}>
                    {phase.status === 'active' ? (lang === 'es' ? 'EN CURSO' : 'ACTIVE') : phase.status === 'completed' ? (lang === 'es' ? 'COMPLETADA' : 'DONE') : (lang === 'es' ? 'PENDIENTE' : 'PENDING')}
                  </Badge>
                </div>
                <p className="text-[var(--muted)] my-0 text-sm">{phase.description}</p>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* ====== EVALUATION ====== */}
      <section id="evaluacion" className="my-8 mb-14">
        <SectionTitle>{t.eval_title}</SectionTitle>
        <p className="text-[var(--muted)] my-2 text-sm">{t.eval_desc}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            {criteria.map((c, i) => (
              <label key={c.id} className="flex gap-3 items-start p-3 border border-[var(--line)] rounded-[10px] my-2 cursor-pointer hover:border-[var(--accent)]/40 transition-colors">
                <input type="checkbox" checked={checks[i]} onChange={() => handleCheck(i)}
                  className="accent-[var(--accent)] w-[19px] h-[19px] mt-0.5 shrink-0" />
                <div className="flex-1">
                  <strong className="block text-sm">{c.label}</strong>
                  <span className="text-xs text-[var(--muted)]">{c.description}</span>
                </div>
              </label>
            ))}
            <div className="flex gap-2 flex-wrap mt-5">
              <Btn onClick={handleReset}>{t.btn_reset}</Btn>
              <Btn onClick={handleDemo}>{t.btn_demo}</Btn>
            </div>
          </Card>

          <Card>
            <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2">{t.eval_result}</div>
            <div className="text-4xl font-extrabold tracking-[-0.04em]">{checkedCount} / 7</div>
            <div className="h-2.5 bg-[#29443f] rounded-full overflow-hidden my-4">
              <div className="h-full bg-[var(--accent)] transition-all duration-300" style={{ width: `${(checkedCount / 7) * 100}%` }} />
            </div>
            <div className="text-[var(--gold)] font-bold">{statusText}</div>

            {/* Opportunities table */}
            <h3 className="text-sm font-semibold mt-6 mb-2">{lang === 'es' ? 'Oportunidades en evaluación' : 'Opportunities under review'}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[var(--muted)]">
                    <th className="text-left py-1.5 border-b border-[var(--line)]">ID</th>
                    <th className="text-left py-1.5 border-b border-[var(--line)]">{lang === 'es' ? 'Sector' : 'Sector'}</th>
                    <th className="text-left py-1.5 border-b border-[var(--line)]">{lang === 'es' ? 'Estado' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {demoOpportunities.map(opp => (
                    <tr key={opp.id}>
                      <td className="py-1.5 border-b border-[var(--line)] font-mono">{opp.id}</td>
                      <td className="py-1.5 border-b border-[var(--line)]">{opp.sector}</td>
                      <td className={`py-1.5 border-b border-[var(--line)] ${statusColor(opp.overallStatus)}`}>{statusLabel(opp.overallStatus, lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-sm font-semibold mt-6 mb-2">{t.eval_evidence}</h3>
            <p className="text-[var(--muted)] my-1.5 text-sm">{t.eval_evidence_desc}</p>
            <Notice>{t.eval_notice}</Notice>
            <div className="flex gap-2 flex-wrap mt-5">
              <Btn onClick={handleExport}>{t.btn_export}</Btn>
            </div>
          </Card>
        </div>
      </section>

      {/* ====== AI CASES ====== */}
      <section id="ai" className="my-8 mb-14">
        <SectionTitle>{t.ai_title}</SectionTitle>
        <p className="text-[var(--muted)] my-2 text-sm">{t.ai_desc}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiCases.map(c => (
            <Card key={c.id}>
              <div className="flex items-center justify-between mb-3">
                <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)]">
                  {c.id === 'CASE-A' ? t.ai_doc_title : t.ai_vision_title}
                </div>
                <Badge color="var(--gold)">{c.status}</Badge>
              </div>
              <div className="space-y-2">
                {c.metrics.map((m, i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-[var(--line)] last:border-0">
                    <div>
                      <div className="text-sm">{m.label}</div>
                      <div className="text-[10px] text-[var(--muted)]">{m.note}</div>
                    </div>
                    <div className="text-sm font-mono text-[var(--muted)]">{m.value}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ====== ENERGY ====== */}
      <section id="energia" className="my-8 mb-14">
        <SectionTitle>{t.energy_title}</SectionTitle>
        <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)] mb-4">{t.energy_module}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {energyScenarios.map((s, i) => (
            <Card key={i}>
              <div className="text-sm font-bold text-[var(--accent)] mb-2">{s.label}</div>
              <div className="text-3xl font-extrabold tracking-[-0.04em]">{s.power}</div>
              <div className="text-sm text-[var(--text)] mt-1">{s.production}</div>
              <div className="text-sm text-[var(--muted)] mt-1">{s.investment}</div>
              <p className="text-xs text-[var(--muted)] mt-2">{s.note}</p>
            </Card>
          ))}
        </div>

        {/* Energy simulations */}
        <h3 className="text-lg font-semibold mt-8 mb-4">{t.energy_sim_title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <div className="text-xs text-[var(--muted)] mb-1">{t.energy_sim_prod}</div>
            <div className="text-2xl font-extrabold">{energyProd.toLocaleString('es-ES')} MWh</div>
            <div className="text-[10px] text-[var(--muted)] mt-1">{lang === 'es' ? 'Hipótesis de prefactibilidad' : 'Pre-feasibility hypothesis'}</div>
          </Card>
          <Card>
            <div className="text-xs text-[var(--muted)] mb-1">{t.energy_sim_ai}</div>
            <div className="text-2xl font-extrabold">{aiConsumption.toLocaleString('es-ES')} MWh</div>
            <div className="text-[10px] text-[var(--muted)] mt-1">~12% {lang === 'es' ? 'de producción estimada' : 'of estimated production'}</div>
          </Card>
          <Card>
            <div className="text-xs text-[var(--muted)] mb-1">{t.energy_sim_task}</div>
            <div className="text-2xl font-extrabold">€{costPerTask}</div>
            <div className="text-[10px] text-[var(--muted)] mt-1">{lang === 'es' ? 'Estimación orientativa' : 'Indicative estimate'}</div>
          </Card>
          <Card>
            <div className="text-xs text-[var(--muted)] mb-1">{t.energy_sim_flex}</div>
            <div className="text-2xl font-extrabold">{flexibilityPct}%</div>
            <div className="text-[10px] text-[var(--muted)] mt-1">{lang === 'es' ? 'Flexibilidad modelizada' : 'Modeled flexibility'}</div>
          </Card>
        </div>
        <Notice>{t.energy_warning}</Notice>
      </section>

      {/* ====== ECONOMICS ====== */}
      <section id="economia" className="my-8 mb-14">
        <SectionTitle>{t.econ_title}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reference model */}
          <Card>
            <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2">{t.econ_ref}</div>
            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr><td className="border-b border-[var(--line)] py-2">{t.econ_table_cost}</td><td className="border-b border-[var(--line)] py-2 text-right font-mono">45.000 €</td></tr>
                <tr><td className="border-b border-[var(--line)] py-2">{t.econ_table_price}</td><td className="border-b border-[var(--line)] py-2 text-right font-mono">56.250 €</td></tr>
                <tr><td className="border-b border-[var(--line)] py-2">{t.econ_table_margin}</td><td className="border-b border-[var(--line)] py-2 text-right font-mono">11.250 €</td></tr>
                <tr><td className="border-b border-[var(--line)] py-2">{t.econ_table_percent}</td><td className="border-b border-[var(--line)] py-2 text-right font-mono">20 %</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-[var(--muted)] mt-2">{t.econ_table_note}</p>
            <h3 className="text-sm font-semibold mt-5 mb-2">{t.econ_deliverables_title}</h3>
            <p className="text-[var(--muted)] my-1.5 text-sm">{t.econ_deliverables}</p>

            {/* Scenarios */}
            <h3 className="text-sm font-semibold mt-5 mb-3">{t.econ_scenarios}</h3>
            <div className="space-y-2">
              {economicScenarios.map((s, i) => {
                const m = s.price - s.cost;
                const mp = ((m / s.price) * 100).toFixed(1);
                return (
                  <div key={i} className="flex justify-between items-center py-2 px-3 border border-[var(--line)] rounded-lg">
                    <div>
                      <div className="text-sm font-bold">{s.name}</div>
                      <div className="text-[10px] text-[var(--muted)]">{s.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono" style={{ color: m >= 0 ? 'var(--accent)' : '#f2a995' }}>{formatEuro(m)}</div>
                      <div className="text-[10px] text-[var(--muted)]">{mp}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Simulator */}
          <Card>
            <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2">{t.econ_sim}</div>
            <label className="block my-5">
              <div className="flex justify-between mb-1 text-sm">
                <span>{t.econ_price}</span>
                <span className="font-bold font-mono">{formatEuro(price)}</span>
              </div>
              <input type="range" min={30000} max={90000} step={250} value={price}
                onChange={e => setPrice(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
            </label>
            <label className="block my-5">
              <div className="flex justify-between mb-1 text-sm">
                <span>{t.econ_cost}</span>
                <span className="font-bold font-mono">{formatEuro(cost)}</span>
              </div>
              <input type="range" min={25000} max={80000} step={250} value={cost}
                onChange={e => setCost(Number(e.target.value))} className="w-full accent-[var(--accent)]" />
            </label>
            <div className="text-xs text-[var(--muted)]">{t.econ_margin}</div>
            <div className="text-4xl font-extrabold tracking-[-0.04em] mt-1" style={{ color: margin < 0 ? '#f2a995' : 'var(--accent)' }}>
              {formatEuro(margin)}
            </div>
            <p className="text-[var(--muted)] text-sm">{percent} {lang === 'es' ? 'sobre ventas' : 'on sales'}</p>
            <Notice>{t.econ_notice}</Notice>
            <div className="flex gap-2 flex-wrap mt-5">
              <Btn onClick={handleRestore}>{t.btn_restore}</Btn>
            </div>
          </Card>
        </div>
      </section>

      {/* ====== CONSORTIUM ====== */}
      <section id="consorcio" className="my-8 mb-14">
        <SectionTitle>{t.cons_title}</SectionTitle>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex gap-4 mb-4">
                <div>
                  <div className="text-xs text-[var(--muted)]">{t.cons_ref}</div>
                  <div className="text-sm font-mono font-bold">SEP-211421662</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--muted)]">{t.cons_call}</div>
                  <div className="text-sm font-mono font-bold">I3-2026-INV2a</div>
                </div>
              </div>
              <p className="text-[var(--muted)] text-sm">{t.cons_desc}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">{t.cons_matrix}</h3>
              <div className="space-y-2">
                {[
                  lang === 'es' ? 'Socio técnico en demostradores de IA' : 'Technical partner in AI demonstrators',
                  lang === 'es' ? 'Validación de complementariedad energética' : 'Energy complementarity validation',
                  lang === 'es' ? 'Contribución al mapa territorial' : 'Contribution to territorial mapping',
                  lang === 'es' ? 'Co-diseño de entregables' : 'Co-design of deliverables',
                  lang === 'es' ? 'Participación en difusión y resultados' : 'Participation in dissemination & results',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 px-3 border border-[var(--line)] rounded-lg text-sm">
                    <span className="text-[var(--accent)]">○</span>
                    <span>{item}</span>
                    <Badge color="var(--gold)">{lang === 'es' ? 'SUJETO A ELEGIBILIDAD' : 'SUBJECT TO ELIGIBILITY'}</Badge>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[var(--muted)] mt-3">{t.cons_matrix_note}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* ====== ALLIANCE ====== */}
      <section id="alianza" className="my-8 mb-14">
        <SectionTitle>{t.alliance_title}</SectionTitle>
        <Card>
          <p className="text-xl max-w-[800px] text-[var(--text)] my-2">{t.alliance_lead}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <h3 className="text-sm font-semibold mb-2">{t.alliance_yes}</h3>
              <p className="text-[var(--muted)] my-1.5 text-sm">{t.alliance_yes_desc}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">{t.alliance_partial}</h3>
              <p className="text-[var(--muted)] my-1.5 text-sm">{t.alliance_partial_desc}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">{t.alliance_no}</h3>
              <p className="text-[var(--muted)] my-1.5 text-sm">{t.alliance_no_desc}</p>
            </div>
          </div>
          <div className="flex gap-2.5 flex-wrap mt-6">
            <Btn onClick={() => window.print()}>{t.btn_print}</Btn>
            <a href="https://montemolin-aihub.vercel.app/" target="_blank" rel="noopener noreferrer"
              className="inline-block bg-transparent border border-[var(--line)] rounded-[10px] text-[var(--text)] font-bold px-4 py-3 no-underline hover:border-[var(--accent)] transition-colors text-sm">
              {t.btn_montemolin}
            </a>
          </div>
        </Card>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-[var(--line)] pt-6 pb-6 text-[var(--muted)] text-xs">
        {t.footer}
      </footer>
    </div>
  );
}

// ---- Dashboard Card ----
function DashCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <Card className="!p-4">
      <div className="flex items-start gap-2">
        <span className="text-lg">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider">{label}</div>
          <div className="text-sm font-bold mt-0.5 truncate">{value}</div>
        </div>
      </div>
    </Card>
  );
}
