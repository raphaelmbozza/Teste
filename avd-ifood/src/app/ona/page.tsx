"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

interface User {
  id: string;
  name: string;
  department: string;
  jobTitle: string;
}

interface ONAEntry {
  collaboratorId: string;
  frequency: number;
  influence: number;
  types: string[];
}

const FREQ_LABELS = ["Raramente", "Mensalmente", "Semanalmente", "Frequentemente", "Diariamente"];
const INF_LABELS = ["Nenhuma", "Baixa", "Moderada", "Alta", "Muito Alta"];
const COLLAB_TYPES = [
  { key: "PROJETOS", label: "Projetos" },
  { key: "DECISOES", label: "Decisões" },
  { key: "APRENDIZADO", label: "Aprendizado" },
  { key: "SUPORTE", label: "Suporte" },
];

export default function ONAPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [cycles, setCycles] = useState<any[]>([]);
  const [cycleId, setCycleId] = useState("");
  const [entries, setEntries] = useState<Record<string, ONAEntry>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [search, setSearch] = useState("");

  const selfId = (session?.user as any)?.id;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/cycles").then((r) => r.json()),
    ]).then(([u, c]) => {
      setUsers(Array.isArray(u) ? u.filter((x: User) => x.id !== selfId) : []);
      const active = Array.isArray(c) ? c.filter((x: any) => x.status === "ACTIVE") : [];
      setCycles(active);
      if (active.length > 0) setCycleId(active[0].id);
      setLoading(false);
    });
  }, [status, selfId]);

  useEffect(() => {
    if (!cycleId || status !== "authenticated") return;
    fetch(`/api/ona?cycleId=${cycleId}`)
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, ONAEntry> = {};
        for (const r of data) {
          map[r.collaboratorId] = {
            collaboratorId: r.collaboratorId,
            frequency: r.frequency,
            influence: r.influence,
            types: JSON.parse(r.types ?? "[]"),
          };
        }
        setEntries(map);
      });
  }, [cycleId, status]);

  function update(userId: string, field: keyof ONAEntry, value: any) {
    setEntries((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], collaboratorId: userId, [field]: value },
    }));
  }

  function toggleType(userId: string, type: string) {
    const current = entries[userId]?.types ?? [];
    const next = current.includes(type) ? current.filter((t) => t !== type) : [...current, type];
    update(userId, "types", next);
  }

  async function handleSave() {
    if (!cycleId) return;
    setSaving(true);
    const valid = Object.values(entries).filter(
      (e) => e.frequency > 0 && e.influence > 0
    );
    await fetch("/api/ona", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cycleId, responses: valid }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.department.toLowerCase().includes(search.toLowerCase())
  );

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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Rede de Colaboração (ONA)</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Mapeie com quem você mais colabora. Isso ajuda a identificar pontes e silos na organização.
          </p>
        </div>

        {cycles.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800 text-sm mb-6">
            Nenhum ciclo ativo no momento. Aguarde o admin iniciar um ciclo.
          </div>
        )}

        {cycles.length > 1 && (
          <div className="mb-4">
            <select
              value={cycleId}
              onChange={(e) => setCycleId(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              {cycles.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
          <input
            type="text"
            placeholder="Buscar por nome ou departamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-4">
          {filtered.map((user) => {
            const entry = entries[user.id];
            const hasEntry = entry?.frequency > 0;

            return (
              <div
                key={user.id}
                className="bg-white rounded-2xl p-5 shadow-sm border-2 transition-all"
                style={{ borderColor: hasEntry ? "#E5302F" : "#E5E7EB" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: "#E5302F" }}
                  >
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.jobTitle} · {user.department}</p>
                  </div>
                  {hasEntry && (
                    <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#16A34A" }}>
                      Mapeado
                    </span>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">Frequência de colaboração</p>
                    <div className="flex gap-1">
                      {FREQ_LABELS.map((label, i) => (
                        <button
                          key={i}
                          onClick={() => update(user.id, "frequency", i + 1)}
                          title={label}
                          className="flex-1 h-8 rounded-lg text-xs font-bold border-2 transition-all"
                          style={{
                            background: entry?.frequency === i + 1 ? "#E5302F" : "#FDE8E8",
                            color: entry?.frequency === i + 1 ? "white" : "#E5302F",
                            borderColor: "#E5302F",
                          }}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {entry?.frequency ? FREQ_LABELS[entry.frequency - 1] : "Selecione..."}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">Influência no seu trabalho</p>
                    <div className="flex gap-1">
                      {INF_LABELS.map((label, i) => (
                        <button
                          key={i}
                          onClick={() => update(user.id, "influence", i + 1)}
                          title={label}
                          className="flex-1 h-8 rounded-lg text-xs font-bold border-2 transition-all"
                          style={{
                            background: entry?.influence === i + 1 ? "#0EA5E9" : "#E0F2FE",
                            color: entry?.influence === i + 1 ? "white" : "#0EA5E9",
                            borderColor: "#0EA5E9",
                          }}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {entry?.influence ? INF_LABELS[entry.influence - 1] : "Selecione..."}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Tipo de colaboração</p>
                  <div className="flex gap-2 flex-wrap">
                    {COLLAB_TYPES.map((t) => {
                      const active = entry?.types?.includes(t.key);
                      return (
                        <button
                          key={t.key}
                          onClick={() => toggleType(user.id, t.key)}
                          className="px-3 py-1 rounded-full text-xs font-bold border-2 transition-all"
                          style={{
                            background: active ? "#7C3AED" : "#F3F0FF",
                            color: active ? "white" : "#7C3AED",
                            borderColor: "#7C3AED",
                          }}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-gray-600">
            {Object.values(entries).filter((e) => e.frequency > 0).length} colaborações mapeadas
          </p>
          <button
            onClick={handleSave}
            disabled={saving || cycles.length === 0}
            className="px-8 py-3 text-white rounded-xl font-bold disabled:opacity-40 transition-opacity"
            style={{ background: saved ? "#16A34A" : "#E5302F" }}
          >
            {saving ? "Salvando..." : saved ? "✅ Salvo!" : "Salvar Mapeamento"}
          </button>
        </div>
      </main>
    </div>
  );
}
