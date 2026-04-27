"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { SCALE } from "@/lib/culture-data";

interface Evaluation {
  id: string;
  type: "SELF" | "PEER" | "SUBORDINATE" | "LEADER";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  evaluatee: { name: string; department: string; jobTitle: string };
  cycle: { name: string; status: string };
}

const TYPE_LABELS: Record<string, string> = {
  SELF: "Autoavaliação",
  PEER: "Par",
  SUBORDINATE: "Liderado",
  LEADER: "Líder",
};

const TYPE_COLORS: Record<string, string> = {
  SELF: "#7C3AED",
  PEER: "#0EA5E9",
  SUBORDINATE: "#16A34A",
  LEADER: "#E5302F",
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/evaluations")
      .then((r) => r.json())
      .then((data) => {
        setEvaluations(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [status]);

  const pending = evaluations.filter((e) => e.status !== "COMPLETED");
  const completed = evaluations.filter((e) => e.status === "COMPLETED");
  const progress = evaluations.length > 0 ? Math.round((completed.length / evaluations.length) * 100) : 0;

  if (status === "loading" || loading) {
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">
            Olá, {session?.user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Aqui estão suas avaliações pendentes e concluídas.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", value: evaluations.length, color: "#1A1A1A" },
            { label: "Pendentes", value: pending.length, color: "#EA580C" },
            { label: "Concluídas", value: completed.length, color: "#16A34A" },
            { label: "Progresso", value: `${progress}%`, color: "#E5302F" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progresso geral do ciclo</span>
            <span className="text-sm font-bold" style={{ color: "#E5302F" }}>{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="h-3 rounded-full transition-all"
              style={{ width: `${progress}%`, background: "#E5302F" }}
            />
          </div>
        </div>

        {/* Scale reference */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-8">
          <p className="text-sm font-bold text-gray-700 mb-3">Escala de Avaliação</p>
          <div className="flex flex-wrap gap-2">
            {SCALE.map((s) => (
              <span
                key={s.value}
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: s.bg, color: s.color }}
              >
                {s.value} — {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Pending evaluations */}
        {pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Avaliações Pendentes</h2>
            <div className="grid gap-3">
              {pending.map((ev) => (
                <Link
                  key={ev.id}
                  href={`/evaluate/${ev.id}`}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-red-300 hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: TYPE_COLORS[ev.type] }}
                    >
                      {TYPE_LABELS[ev.type].slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{ev.evaluatee.name}</p>
                      <p className="text-xs text-gray-500">{ev.evaluatee.jobTitle} · {ev.evaluatee.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ background: TYPE_COLORS[ev.type] }}
                    >
                      {TYPE_LABELS[ev.type]}
                    </span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Concluídas</h2>
            <div className="grid gap-3">
              {completed.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between opacity-70"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">{ev.evaluatee.name}</p>
                      <p className="text-xs text-gray-400">{ev.evaluatee.jobTitle} · {ev.evaluatee.department}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    Concluída
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {evaluations.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎯</div>
            <p className="text-gray-500">Nenhuma avaliação disponível. Aguarde o início do ciclo.</p>
          </div>
        )}
      </main>
    </div>
  );
}
