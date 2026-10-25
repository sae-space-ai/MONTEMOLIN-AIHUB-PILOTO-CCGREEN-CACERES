import { useState, useCallback } from 'react';

// Data
const labels: [string, string][] = [
  ['Necesidad territorial documentada', 'Problema real y beneficiario identificados'],
  ['Interlocutor autorizado', 'Responsable capaz de evaluar la colaboración'],
  ['Datos y permisos', 'Fuentes disponibles y derechos de uso'],
  ['Viabilidad técnica', 'Prueba medible y restricciones conocidas'],
  ['Viabilidad económica', 'Costes, financiación y contratación evaluados'],
  ['Encaje confirmado con CCGreen', 'Validación expresa del promotor; nunca presupuesta'],
  ['Próxima acción aceptada', 'Reunión o paso concreto confirmado por ambas partes'],
];

const phases = [
  { period: 'Días 1–15', title: 'Validar interés y alcance', desc: 'Interlocutor, problema concreto, reglas de acceso, responsabilidades y contratación. Si no hay encaje, detener.' },
  { period: 'Días 16–30', title: 'Mapa territorial', desc: 'Explorar actores, necesidades, permisos y línea base; no se presupone participación empresarial.' },
  { period: 'Días 31–60', title: 'Pruebas de concepto', desc: 'Hasta dos casos en infraestructura independiente, con datos autorizados y criterios de evaluación previos.' },
  { period: 'Días 61–75', title: 'Viabilidad y valor territorial', desc: 'Evaluar costes, requisitos, seguridad, capacidades, barreras y potencial de transferencia.' },
  { period: 'Días 76–90', title: 'Dossier de decisión', desc: 'Entregar evidencias y recomendar continuar, reformular o cerrar.' },
];

function formatEuro(x: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(x);
}

export default function App() {
  const [checks, setChecks] = useState<boolean[]>(new Array(7).fill(false));
  const [price, setPrice] = useState(56250);
  const [cost, setCost] = useState(45000);

  const checkedCount = checks.filter(Boolean).length;

  const handleCheck = useCallback((i: number) => {
    setChecks(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setChecks(new Array(7).fill(false));
  }, []);

  const handleDemo = useCallback(() => {
    setChecks(labels.map((_, i) => i !== 5));
  }, []);

  const handleRestore = useCallback(() => {
    setPrice(56250);
    setCost(45000);
  }, []);

  const handleExport = useCallback(() => {
    const text = 'SIMULACIÓN CCGREEN — NO ES EVIDENCIA REAL\n' +
      labels.map((x, i) => x[0] + ';' + (checks[i] ? 'MARCADO DEMO' : 'PENDIENTE')).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ccgreen_ficha_demo.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [checks]);

  const margin = price - cost;
  const percent = ((price - cost) / price * 100).toFixed(1).replace('.', ',') + ' %';

  const statusText = checkedCount === 7
    ? '7 criterios marcados · SOLO DEMO'
    : checkedCount > 0
      ? 'Evaluación incompleta · DEMO'
      : 'Sin cualificar';

  return (
    <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <header className="flex justify-between gap-4 items-center flex-wrap">
        <div className="font-extrabold tracking-wider text-lg">
          MONTEMOLIN<span className="text-[var(--accent)]">—AIHUB</span>
        </div>
        <nav className="flex gap-3.5 flex-wrap">
          <a href="#valor" className="text-[var(--muted)] no-underline text-[13px] hover:text-[var(--accent)] transition-colors">Propuesta</a>
          <a href="#plan" className="text-[var(--muted)] no-underline text-[13px] hover:text-[var(--accent)] transition-colors">90 días</a>
          <a href="#evaluacion" className="text-[var(--muted)] no-underline text-[13px] hover:text-[var(--accent)] transition-colors">Evaluación</a>
          <a href="#economia" className="text-[var(--muted)] no-underline text-[13px] hover:text-[var(--accent)] transition-colors">Economía</a>
          <a href="#alianza" className="text-[var(--muted)] no-underline text-[13px] hover:text-[var(--accent)] transition-colors">Alianza</a>
        </nav>
        <div className="border border-[var(--line)] rounded-full px-3 py-1 text-[var(--muted)] text-xs">
          Propuesta independiente · DEMO
        </div>
      </header>

      {/* Hero */}
      <div className="pt-16 md:pt-20 pb-14">
        <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)]">
          CCGreen · Cáceres · Piloto exploratorio
        </div>
        <h1 className="text-[clamp(36px,6vw,66px)] leading-[1.08] tracking-[-0.05em] max-w-[880px] my-3.5 font-bold">
          De la infraestructura digital al <span className="text-[var(--accent)]">impacto empresarial y territorial.</span>
        </h1>
        <p className="text-xl max-w-[800px] text-[var(--muted)] my-2">
          Piloto de 90 días para identificar oportunidades de innovación, validar aplicaciones de IA industrial y documentar posibles colaboraciones de energía limpia en Extremadura.
        </p>
        <div className="flex gap-2.5 flex-wrap mt-6">
          <a href="#evaluacion" className="inline-block bg-[var(--accent)] rounded-[10px] text-[#0b2521] font-bold px-4.5 py-3 no-underline hover:opacity-90 transition-opacity">
            Probar evaluación interactiva
          </a>
          <a href="#alianza" className="inline-block bg-transparent border border-[var(--line)] rounded-[10px] text-[var(--text)] font-bold px-4.5 py-3 no-underline hover:border-[var(--accent)] transition-colors">
            Ver propuesta de colaboración
          </a>
        </div>
        <p className="text-xs text-[var(--muted)] mt-4">
          Prototipo no solicitado. No existe colaboración, contrato ni aprobación acreditada de CCGreen.
        </p>
      </div>

      {/* Value Proposition */}
      <section id="valor" className="my-8 mb-16">
        <h2 className="text-[clamp(24px,3vw,35px)] tracking-[-0.03em] mb-4.5 font-bold">¿Qué podría aportar MONTEMOLIN-AIHUB?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2">01 · Empresas</div>
            <h3 className="text-lg font-semibold mb-2">Ecosistema regional</h3>
            <p className="text-[var(--muted)] my-1.5">Detectar necesidades empresariales reales, responsables, datos y posibilidades de colaboración industrial.</p>
          </Card>
          <Card>
            <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2">02 · Tecnología</div>
            <h3 className="text-lg font-semibold mb-2">Demostradores de IA</h3>
            <p className="text-[var(--muted)] my-1.5">Explorar inteligencia documental, visión artificial y automatización mediante pruebas limitadas y medibles.</p>
          </Card>
          <Card>
            <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2">03 · Energía</div>
            <h3 className="text-lg font-semibold mb-2">Innovación renovable</h3>
            <p className="text-[var(--muted)] my-1.5">Analizar prefactibilidad, consumo por tarea y oportunidades de eficiencia, sin prometer suministro eléctrico.</p>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card>
            <div className="text-4xl font-extrabold tracking-[-0.04em]">90 días</div>
            <div className="text-xs text-[var(--muted)]">Duración propuesta, sujeta a contratación</div>
          </Card>
          <Card>
            <div className="text-4xl font-extrabold tracking-[-0.04em]">2</div>
            <div className="text-xs text-[var(--muted)]">Máximo de demostradores técnicos propuestos</div>
          </Card>
          <Card>
            <div className="text-4xl font-extrabold tracking-[-0.04em]">0</div>
            <div className="text-xs text-[var(--muted)]">Colaboraciones o empresas confirmadas en esta demostración</div>
          </Card>
        </div>
      </section>

      {/* Plan / Roadmap */}
      <section id="plan" className="my-8 mb-16">
        <h2 className="text-[clamp(24px,3vw,35px)] tracking-[-0.03em] mb-4.5 font-bold">Hoja de ruta y puntos de decisión</h2>
        <Card>
          {phases.map((phase, i) => (
            <div key={i} className={`flex gap-5 py-4 ${i < phases.length - 1 ? 'border-b border-[var(--line)]' : ''}`}>
              <b className="min-w-[78px] text-[var(--accent)] shrink-0">{phase.period}</b>
              <div>
                <h3 className="text-lg font-semibold mb-2">{phase.title}</h3>
                <p className="text-[var(--muted)] my-0">{phase.desc}</p>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* Evaluation */}
      <section id="evaluacion" className="my-8 mb-16">
        <h2 className="text-[clamp(24px,3vw,35px)] tracking-[-0.03em] mb-4.5 font-bold">Evaluador de oportunidad territorial</h2>
        <p className="text-[var(--muted)] my-2">Prueba los criterios de selección. Todas las casillas representan una simulación; no verifican proyectos reales.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Checks panel */}
          <Card>
            <div>
              {labels.map((label, i) => (
                <label key={i} className="flex gap-3 items-start p-3 border border-[var(--line)] rounded-[10px] my-2 cursor-pointer hover:border-[var(--accent)]/40 transition-colors">
                  <input
                    type="checkbox"
                    checked={checks[i]}
                    onChange={() => handleCheck(i)}
                    className="accent-[var(--accent)] w-[19px] h-[19px] mt-0.5 shrink-0"
                  />
                  <div>
                    <strong className="block">{label[0]}</strong>
                    <span className="text-xs text-[var(--muted)]">{label[1]}</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex gap-2.5 flex-wrap mt-6">
              <button onClick={handleReset} className="bg-transparent border border-[var(--line)] rounded-[10px] text-[var(--text)] font-bold px-4.5 py-3 cursor-pointer hover:border-[var(--accent)] transition-colors">
                Reiniciar
              </button>
              <button onClick={handleDemo} className="bg-transparent border border-[var(--line)] rounded-[10px] text-[var(--text)] font-bold px-4.5 py-3 cursor-pointer hover:border-[var(--accent)] transition-colors">
                Ejemplo simulado
              </button>
            </div>
          </Card>

          {/* Result panel */}
          <Card>
            <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2">Resultado de la demostración</div>
            <div className="text-4xl font-extrabold tracking-[-0.04em]">{checkedCount} / 7</div>
            <div className="h-2.5 bg-[#29443f] rounded-full overflow-hidden my-4">
              <div
                className="h-full bg-[var(--accent)] transition-all duration-200"
                style={{ width: `${(checkedCount / 7) * 100}%` }}
              />
            </div>
            <div className="text-[var(--gold)] font-bold">{statusText}</div>
            <h3 className="text-lg font-semibold mt-7 mb-2">La evidencia es imprescindible</h3>
            <p className="text-[var(--muted)] my-1.5">El interés de una empresa no constituye un acuerdo. La participación de CCGreen, el acceso a datos y la viabilidad de una colaboración energética deben confirmarse expresamente.</p>
            <div className="border-l-3 border-[var(--gold)] px-4 py-3 bg-[#28302c] rounded-r-lg text-[#ebdcc3] text-[13px] mt-4">
              Ningún resultado de esta pantalla acredita contratos, inversión, subvenciones, empleos o energía disponible.
            </div>
            <div className="flex gap-2.5 flex-wrap mt-6">
              <button onClick={handleExport} className="bg-transparent border border-[var(--line)] rounded-[10px] text-[var(--text)] font-bold px-4.5 py-3 cursor-pointer hover:border-[var(--accent)] transition-colors">
                Exportar ficha DEMO
              </button>
            </div>
          </Card>
        </div>
      </section>

      {/* Energy */}
      <section id="energia" className="my-8 mb-16">
        <h2 className="text-[clamp(24px,3vw,35px)] tracking-[-0.03em] mb-4.5 font-bold">Montemolín: energía limpia como hipótesis de colaboración</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <div className="text-4xl font-extrabold tracking-[-0.04em]">25 MWp</div>
            <p className="text-[var(--muted)] my-1.5">Escenario fotovoltaico de prefactibilidad de RURAL-GOV-ENERGY, no potencia instalada.</p>
          </Card>
          <Card>
            <div className="text-4xl font-extrabold tracking-[-0.04em]">41.250</div>
            <p className="text-[var(--muted)] my-1.5">MWh/año de producción inicial modelizada, no energía generada ni comprometida.</p>
          </Card>
          <Card>
            <div className="text-4xl font-extrabold tracking-[-0.04em]">22,24 M€</div>
            <p className="text-[var(--muted)] my-1.5">Inversión estimada en el escenario de estudio, no financiación obtenida.</p>
          </Card>
        </div>
        <div className="border-l-3 border-[var(--gold)] px-4 py-3 bg-[#28302c] rounded-r-lg text-[#ebdcc3] text-[13px] mt-4">
          No se ha verificado conexión a red, permisos, P90, precio PPA ni posibilidad de entrega al proyecto CCGreen. El piloto propone estudiar, no garantizar, esa complementariedad.
        </div>
      </section>

      {/* Economics */}
      <section id="economia" className="my-8 mb-16">
        <h2 className="text-[clamp(24px,3vw,35px)] tracking-[-0.03em] mb-4.5 font-bold">Economía del piloto: escenarios orientativos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Reference model */}
          <Card>
            <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2">Modelo de referencia</div>
            <table className="w-full border-collapse">
              <tbody>
                <tr><td className="border-b border-[var(--line)] py-2">Coste directo propuesto</td><td className="border-b border-[var(--line)] py-2 text-right">45.000 €</td></tr>
                <tr><td className="border-b border-[var(--line)] py-2">Precio orientativo</td><td className="border-b border-[var(--line)] py-2 text-right">56.250 €</td></tr>
                <tr><td className="border-b border-[var(--line)] py-2">Margen bruto</td><td className="border-b border-[var(--line)] py-2 text-right">11.250 €</td></tr>
                <tr><td className="border-b border-[var(--line)] py-2">Margen sobre ventas</td><td className="border-b border-[var(--line)] py-2 text-right">20 %</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-[var(--muted)] mt-2">Sin IVA. No es presupuesto aceptado ni oferta contractual.</p>
            <h3 className="text-lg font-semibold mt-5 mb-2">Entregables</h3>
            <p className="text-[var(--muted)] my-1.5">Mapa de oportunidades, dos fichas técnicas como máximo, matriz de viabilidad, riesgos, evaluación de complementariedad energética y recomendación ejecutiva.</p>
          </Card>

          {/* Simulator */}
          <Card>
            <div className="uppercase text-xs tracking-[0.13em] font-extrabold text-[var(--accent)] mb-2">Simulador económico</div>
            <label className="block my-5">
              <div className="flex justify-between mb-1">
                <span>Precio propuesto</span>
                <span className="font-bold">{formatEuro(price)}</span>
              </div>
              <input
                type="range"
                min={30000}
                max={90000}
                step={250}
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
            </label>
            <label className="block my-5">
              <div className="flex justify-between mb-1">
                <span>Coste directo</span>
                <span className="font-bold">{formatEuro(cost)}</span>
              </div>
              <input
                type="range"
                min={25000}
                max={80000}
                step={250}
                value={cost}
                onChange={e => setCost(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
            </label>
            <div className="text-xs text-[var(--muted)]">Margen bruto calculado</div>
            <div className="text-4xl font-extrabold tracking-[-0.04em]" style={{ color: margin < 0 ? '#f2a995' : 'var(--accent)' }}>
              {formatEuro(margin)}
            </div>
            <p className="text-[var(--muted)]">{percent} sobre ventas</p>
            <div className="border-l-3 border-[var(--gold)] px-4 py-3 bg-[#28302c] rounded-r-lg text-[#ebdcc3] text-[13px] mt-4">
              No incluye gastos generales, impuestos ni financiación. Modificar controles no genera una oferta comercial.
            </div>
            <div className="flex gap-2.5 flex-wrap mt-6">
              <button onClick={handleRestore} className="bg-transparent border border-[var(--line)] rounded-[10px] text-[var(--text)] font-bold px-4.5 py-3 cursor-pointer hover:border-[var(--accent)] transition-colors">
                Restablecer
              </button>
            </div>
          </Card>
        </div>
      </section>

      {/* Alliance */}
      <section id="alianza" className="my-8 mb-16">
        <h2 className="text-[clamp(24px,3vw,35px)] tracking-[-0.03em] mb-4.5 font-bold">Una colaboración que primero debe demostrar su encaje</h2>
        <Card>
          <p className="text-xl max-w-[800px] text-[var(--text)] my-2">
            ¿Vería CCGreen interés en evaluar un piloto independiente que conecte innovación empresarial, aplicaciones industriales de IA y posibles complementariedades energéticas en Extremadura?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Si hay interés</h3>
              <p className="text-[var(--muted)] my-1.5">Identificar decisor, necesidades, permisos, modelo de colaboración y procedimiento de compra.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Si el encaje es parcial</h3>
              <p className="text-[var(--muted)] my-1.5">Reducir alcance o enfocarlo en una única necesidad verificable.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Si no hay encaje</h3>
              <p className="text-[var(--muted)] my-1.5">Detener la iniciativa sin asumir que existe un compromiso.</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold mt-6 mb-2">Cooperación europea</h3>
          <p className="text-[var(--muted)] my-1.5">Podría estudiarse una colaboración futura con MONTEMOLIN-AIHUB y la propuesta I3-2026-INV2a, referencia SEP-211421662. La documentación disponible no acredita subvención concedida, incorporación formal de CCGreen ni elegibilidad de cambios en el consorcio.</p>
          <div className="flex gap-2.5 flex-wrap mt-6">
            <button onClick={() => window.print()} className="bg-transparent border border-[var(--line)] rounded-[10px] text-[var(--text)] font-bold px-4.5 py-3 cursor-pointer hover:border-[var(--accent)] transition-colors">
              Imprimir presentación
            </button>
            <a href="https://montemolin-aihub.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-block bg-transparent border border-[var(--line)] rounded-[10px] text-[var(--text)] font-bold px-4.5 py-3 no-underline hover:border-[var(--accent)] transition-colors">
              Conocer MONTEMOLIN-AIHUB
            </a>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--line)] pt-6 pb-6 text-[var(--muted)] text-xs">
        Propuesta independiente de MONTEMOLIN-AIHUB. No es una página oficial de CCGreen ni implica patrocinio o colaboración. Datos económicos y energéticos: escenarios internos sujetos a verificación. La aplicación no almacena ni transmite información introducida.
      </footer>
    </div>
  );
}

// Reusable Card component
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-[var(--line)] rounded-[17px] bg-gradient-to-br from-[#152e31] to-[#102025] p-5.5">
      {children}
    </div>
  );
}
