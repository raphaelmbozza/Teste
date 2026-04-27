"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { SCALE, CULTURA_ATTRIBUTES, PERFORMANCE_ATTRIBUTES, IA_ATTRIBUTES, LIDERANCA_ATTRIBUTES, getScaleItem } from "@/lib/culture-data";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ResultItem {
  type: string;
  dimension: string;
  attribute: string;
  avg: number;
  count: number;
  justifications: string[];
}

const DIM_LABELS: Record<string, string> = {
  CULTURA: "Cultura",
  PERFORMANCE: "Performance",
  IA: "IA",
  LIDERANCA: "Liderança",
};

const TYPE_LABELS: Record<string, string> = {
  SELF: "Auto",
  PEER: "Pares",
  SUBORDINATE: "Liderados",
  LEADER: "Líder",
};

const TYPE_COLORS: Record<string, string> = {
  SELF: "#7C3AED",
  PEER: "#0EA5E9",
  SUBORDINATE: "#16A34A",
  LEADER: "#E5302F",
};

function AttrName(attr: string) {
  const all = [...CULTURA_ATTRIBUTES, ...PERFORMANCE_ATTRIBUTES, ...IA_ATTRIBUTES, ...LIDERANCA_ATTRIBUTES];
  return all.find((a) => a.key === attr)?.label ?? attr;
}

export default function ResultsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [summary, setSummary] = useState<ResultItem[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);
  const [cycleId, setCycleId] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"CULTURA" | "PERFORMANCE" | "IA" | "LIDERANCA">("CULTURA");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/cycles")
      .then((r) => r.json())
      .then((data) => {
        const c = Array.isArray(data) ? data : [];
        setCycles(c);
        if (c.length > 0) setCycleId(c[0].id);
      });
  }, [status]);

  useEffect(() => {
    if (!cycleId && cycles.length === 0) {
      setLoading(false);
      return;
    }
    if (!cycleId) return;
    fetch(`/api/results?cycleId=${cycleId}`)
      .then((r) => r.json())
      .then((data) => {
        setSummary(data.summary ?? []);
        setLoading(false);
      });
  }, [cycleId, cycles]);

  function avgForDim(dim: string) {
    const items = summary.filter((s) => s.dimension === dim);
    if (!items.length) return null;
    return items.reduce((acc, s) => acc + s.avg, 0) / items.length;
  }

  function radarData() {
    const types = ["SELF", "PEER", "SUBORDINATE", "LEADER"];
    const dims = ["CULTURA", "PERFORMANCE", "IA", "LIDERANCA"];
    return dims.map((dim) => {
      const entry: any = { dim: DIM_LABELS[dim] };
      for (const type of types) {
        const items = summary.filter((s) => s.dimension === dim && s.type === type);
        if (items.length) {
          entry[type] = Math.round((items.reduce((a, s) => a + s.avg, 0) / items.length) * 10) / 10;
        }
      }
      return entry;
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const dims: Array<"CULTURA" | "PERFORMANCE" | "IA" | "LIDERANCA"> = ["CULTURA", "PERFORMANCE", "IA", "LIDERANCA"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Meus Resultados</h1>
            <p className="text-gray-500 text-sm mt-1">Visão consolidada das avaliações recebidas</p>
          </div>
          {cycles.length > 0 && (
            <select
              value={cycleId}
              onChange={(e) => { setCycleId(e.target.value); setLoading(true); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              {cycles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          )}
        </div>

        {summary.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📊</div>
            <p className="text-gray-500">Nenhum resultado disponível ainda. Complete o ciclo de avaliações.</p>
          </div>
        ) : (
          <>
            {/* Overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {dims.map((dim) => {
                const avg = avgForDim(dim);
                const scale = avg ? getScaleItem(Math.round(avg)) : null;
                return (
                  <div key={dim} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{DIM_LABELS[dim]}</p>
                    {avg ? (
                      <>
                        <p className="text-3xl font-black" style={{ color: scale?.color }}>{avg.toFixed(1)}</p>
                        <p className="text-xs font-bold mt-1" style={{ color: scale?.color }}>{scale?.label}</p>
                      </>
                    ) : (
                      <p className="text-gray-400 text-sm">—</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Radar chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
              <h2 className="font-bold text-gray-900 mb-4">Visão 360° por Dimensão</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dim" tick={{ fontSize: 12 }} />
                  {["SELF", "PEER", "SUBORDINATE", "LEADER"].map((type) => (
                    <Radar
                      key={type}
                      name={TYPE_LABELS[type]}
                      dataKey={type}
                      stroke={TYPE_COLORS[type]}
                      fill={TYPE_COLORS[type]}
                      fillOpacity={0.15}
                    />
                  ))}
                  <Legend />
                  <Tooltip formatter={(v: any) => v?.toFixed(1)} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Dimension tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
              {dims.map((dim) => (
                <button
                  key={dim}
                  onClick={() => setActiveTab(dim)}
                  className="flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all border-2"
                  style={{
                    background: activeTab === dim ? "#E5302F" : "white",
                    color: activeTab === dim ? "white" : "#E5302F",
                    borderColor: "#E5302F",
                  }}
                >
                  {DIM_LABELS[dim]}
                </button>
              ))}
            </div>

            {/* Attribute breakdown */}
            <div className="flex flex-col gap-4">
              {summary
                .filter((s) => s.dimension === activeTab)
                .reduce<string[]>((acc, s) => acc.includes(s.attribute) ? acc : [...acc, s.attribute], [])
                .map((attr) => {
                  const items = summary.filter((s) => s.dimension === activeTab && s.attribute === attr);
                  const overallAvg = items.reduce((a, s) => a + s.avg, 0) / items.length;
                  const scale = getScaleItem(Math.round(overallAvg));

                  return (
                    <div key={attr} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                        <h3 className="font-bold text-gray-900">{AttrName(attr)}</h3>
                        <span
                          className="px-3 py-0.5 rounded-full text-sm font-black"
                          style={{ background: scale.bg, color: scale.color }}
                        >
                          {overallAvg.toFixed(1)} — {scale.label}
                        </span>
                      </div>

                      <div className="flex gap-4 flex-wrap mb-4">
                        {items.map((item) => (
                          <div key={item.type} className="flex items-center gap-2">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: TYPE_COLORS[item.type] }}>
                              {TYPE_LABELS[item.type]}
                            </span>
                            <span className="text-sm font-bold" style={{ color: getScaleItem(Math.round(item.avg)).color }}>
                              {item.avg.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-400">({item.count})</span>
                          </div>
                        ))}
                      </div>

                      {/* Bar visualization */}
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${(overallAvg / 5) * 100}%`, background: scale.color }}
                        />
                      </div>

                      {/* Justifications */}
                      {items.flatMap((i) => i.justifications).length > 0 && (
                        <details className="mt-4">
                          <summary className="text-xs font-semibold text-gray-500 cursor-pointer hover:text-gray-700">
                            Ver comentários ({items.flatMap((i) => i.justifications).length})
                          </summary>
                          <div className="mt-2 flex flex-col gap-2">
                            {items.flatMap((i) =>
                              i.justifications.map((j, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 border-l-4" style={{ borderColor: TYPE_COLORS[i.type] }}>
                                  <span className="text-xs font-bold" style={{ color: TYPE_COLORS[i.type] }}>{TYPE_LABELS[i.type]}: </span>
                                  {j}
                                </div>
                              ))
                            )}
                          </div>
                        </details>
                      )}
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
