"use client";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getScaleItem } from "@/lib/culture-data";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  jobTitle: string;
  isLeader: boolean;
}

interface Cycle {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface ONANode {
  id: string;
  name: string;
  department: string;
  x?: number;
  y?: number;
}

interface ONAEdge {
  from: string;
  to: string;
  frequency: number;
  influence: number;
}

const DEPT_COLORS: Record<string, string> = {
  "Produto": "#E5302F",
  "Engenharia": "#0EA5E9",
  "Dados": "#7C3AED",
  "Design": "#EC4899",
  "Marketing": "#F97316",
  "Operações": "#16A34A",
  "RH": "#D97706",
  "Financeiro": "#64748B",
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [onaData, setOnaData] = useState<{ respondent: any; collaborator: any; frequency: number; influence: number }[]>([]);
  const [selectedCycle, setSelectedCycle] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "ona" | "cycles">("overview");

  const [newCycle, setNewCycle] = useState({ name: "", description: "", startDate: "", endDate: "" });
  const [creating, setCreating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") router.push("/dashboard");
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/cycles").then((r) => r.json()),
    ]).then(([u, c]) => {
      setUsers(Array.isArray(u) ? u : []);
      const cyc = Array.isArray(c) ? c : [];
      setCycles(cyc);
      if (cyc.length > 0) setSelectedCycle(cyc[0].id);
      setLoading(false);
    });
  }, [status]);

  useEffect(() => {
    if (!selectedCycle) return;
    fetch(`/api/ona?cycleId=${selectedCycle}&all=true`)
      .then((r) => r.json())
      .then((data) => setOnaData(Array.isArray(data) ? data : []));
  }, [selectedCycle]);

  useEffect(() => {
    if (activeTab !== "ona" || !canvasRef.current || onaData.length === 0) return;
    drawONAGraph();
  }, [activeTab, onaData, users]);

  function drawONAGraph() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const uniqueIds = new Set<string>();
    for (const d of onaData) {
      uniqueIds.add(d.respondent.id);
      uniqueIds.add(d.collaborator.id);
    }

    const nodeIds = Array.from(uniqueIds).slice(0, 60);
    const nodes: Record<string, ONANode> = {};

    nodeIds.forEach((id, i) => {
      const angle = (i / nodeIds.length) * 2 * Math.PI;
      const r = Math.min(W, H) * 0.35;
      const user = users.find((u) => u.id === id);
      nodes[id] = {
        id,
        name: user?.name ?? id,
        department: user?.department ?? "",
        x: W / 2 + r * Math.cos(angle),
        y: H / 2 + r * Math.sin(angle),
      };
    });

    // Draw edges
    for (const d of onaData) {
      const from = nodes[d.respondent.id];
      const to = nodes[d.collaborator.id];
      if (!from || !to) continue;

      ctx.beginPath();
      ctx.moveTo(from.x!, from.y!);
      ctx.lineTo(to.x!, to.y!);
      ctx.strokeStyle = `rgba(229,48,47,${d.frequency / 10})`;
      ctx.lineWidth = d.influence / 3;
      ctx.stroke();
    }

    // Draw nodes
    for (const node of Object.values(nodes)) {
      const color = DEPT_COLORS[node.department] ?? "#666";
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, 8, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#1A1A1A";
      ctx.font = "9px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(node.name.split(" ")[0], node.x!, node.y! + 20);
    }
  }

  async function handleCreateCycle() {
    if (!newCycle.name || !newCycle.startDate || !newCycle.endDate) return;
    setCreating(true);
    const res = await fetch("/api/cycles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCycle),
    });
    const data = await res.json();
    setCycles((prev) => [data.cycle, ...prev]);
    setSelectedCycle(data.cycle.id);
    setNewCycle({ name: "", description: "", startDate: "", endDate: "" });
    setCreating(false);
    alert(`Ciclo criado! ${data.evaluationsCreated} avaliações geradas automaticamente.`);
  }

  async function handleSeed() {
    if (!confirm("Seed do banco com 200 usuários de exemplo?")) return;
    const res = await fetch("/api/seed", { method: "POST" });
    const data = await res.json();
    alert(data.message + ` (${data.total} usuários)`);
    window.location.reload();
  }

  const byDept = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.department] = (acc[u.department] ?? 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Painel Admin</h1>
            <p className="text-gray-500 text-sm mt-1">Gestão de ciclos, colaboradores e ONA</p>
          </div>
          {users.length === 0 && (
            <button
              onClick={handleSeed}
              className="px-4 py-2 text-white rounded-xl font-bold text-sm"
              style={{ background: "#7C3AED" }}
            >
              🌱 Seed 200 Colaboradores
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["overview", "cycles", "ona"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-xl font-semibold text-sm border-2 transition-all"
              style={{
                background: activeTab === tab ? "#E5302F" : "white",
                color: activeTab === tab ? "white" : "#E5302F",
                borderColor: "#E5302F",
              }}
            >
              {{ overview: "Visão Geral", cycles: "Ciclos", ona: "Rede ONA" }[tab]}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Colaboradores", value: users.length, color: "#E5302F" },
                { label: "Líderes", value: users.filter((u) => u.isLeader).length, color: "#D97706" },
                { label: "Departamentos", value: Object.keys(byDept).length, color: "#7C3AED" },
                { label: "Ciclos", value: cycles.length, color: "#0EA5E9" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="font-bold text-gray-900 mb-4">Colaboradores por Departamento</h2>
              <div className="flex flex-col gap-2">
                {Object.entries(byDept).sort((a, b) => b[1] - a[1]).map(([dept, count]) => (
                  <div key={dept} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-28 shrink-0">{dept}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-4 rounded-full"
                        style={{ width: `${(count / users.length) * 100}%`, background: DEPT_COLORS[dept] ?? "#666" }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-600 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4">Todos os Colaboradores</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 font-semibold text-gray-500">Nome</th>
                      <th className="text-left py-2 font-semibold text-gray-500">Departamento</th>
                      <th className="text-left py-2 font-semibold text-gray-500">Cargo</th>
                      <th className="text-left py-2 font-semibold text-gray-500">Papel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 50).map((u) => (
                      <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 font-medium">{u.name}</td>
                        <td className="py-2 text-gray-500">{u.department}</td>
                        <td className="py-2 text-gray-500">{u.jobTitle}</td>
                        <td className="py-2">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                            style={{ background: u.role === "ADMIN" ? "#7C3AED" : u.isLeader ? "#D97706" : "#0EA5E9" }}
                          >
                            {u.role === "ADMIN" ? "Admin" : u.isLeader ? "Líder" : "Colaborador"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length > 50 && (
                  <p className="text-xs text-gray-400 mt-2">Mostrando 50 de {users.length}</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Cycles Tab */}
        {activeTab === "cycles" && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <h2 className="font-bold text-gray-900 mb-4">Criar Novo Ciclo</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Nome do Ciclo</label>
                  <input
                    value={newCycle.name}
                    onChange={(e) => setNewCycle({ ...newCycle, name: e.target.value })}
                    placeholder="Ex: AvD 2024 — 1º Semestre"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Descrição</label>
                  <input
                    value={newCycle.description}
                    onChange={(e) => setNewCycle({ ...newCycle, description: e.target.value })}
                    placeholder="Opcional"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Início</label>
                  <input
                    type="date"
                    value={newCycle.startDate}
                    onChange={(e) => setNewCycle({ ...newCycle, startDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1">Fim</label>
                  <input
                    type="date"
                    value={newCycle.endDate}
                    onChange={(e) => setNewCycle({ ...newCycle, endDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleCreateCycle}
                disabled={creating || !newCycle.name}
                className="mt-4 px-6 py-2 text-white rounded-xl font-bold text-sm disabled:opacity-40"
                style={{ background: "#E5302F" }}
              >
                {creating ? "Criando..." : "Criar Ciclo + Gerar Avaliações"}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {cycles.map((cycle) => (
                <div key={cycle.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-bold text-gray-900">{cycle.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(cycle.startDate).toLocaleDateString("pt-BR")} → {new Date(cycle.endDate).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: cycle.status === "ACTIVE" ? "#DCFCE7" : cycle.status === "DRAFT" ? "#FEF3C7" : "#F3F4F6",
                      color: cycle.status === "ACTIVE" ? "#16A34A" : cycle.status === "DRAFT" ? "#D97706" : "#6B7280",
                    }}
                  >
                    {cycle.status}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ONA Tab */}
        {activeTab === "ona" && (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex items-center gap-4 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">Ciclo:</span>
              <select
                value={selectedCycle}
                onChange={(e) => setSelectedCycle(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
              >
                {cycles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <span className="text-sm text-gray-500">{onaData.length} conexões mapeadas</span>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4 flex gap-4 flex-wrap">
              {Object.entries(DEPT_COLORS).map(([dept, color]) => (
                <div key={dept} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                  <span className="text-xs text-gray-600">{dept}</span>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {onaData.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">🕸️</div>
                  <p className="text-gray-500 text-sm">Nenhum dado ONA ainda. Os colaboradores precisam preencher o mapeamento de rede.</p>
                </div>
              ) : (
                <canvas ref={canvasRef} width={900} height={600} className="w-full" />
              )}
            </div>

            {onaData.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Top Conectores da Rede</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {Object.entries(
                    onaData.reduce<Record<string, { name: string; dept: string; count: number }>>((acc, d) => {
                      const id = d.collaborator.id;
                      if (!acc[id]) acc[id] = { name: d.collaborator.name, dept: d.collaborator.department, count: 0 };
                      acc[id].count++;
                      return acc;
                    }, {})
                  )
                    .sort((a, b) => b[1].count - a[1].count)
                    .slice(0, 10)
                    .map(([id, data]) => (
                      <div key={id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ background: DEPT_COLORS[data.dept] ?? "#666" }}
                        >
                          {data.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{data.name}</p>
                          <p className="text-xs text-gray-500">{data.dept}</p>
                        </div>
                        <span className="text-sm font-black" style={{ color: "#E5302F" }}>{data.count} conexões</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
