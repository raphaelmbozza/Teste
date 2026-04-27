"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import {
  CULTURA_ATTRIBUTES,
  PERFORMANCE_ATTRIBUTES,
  IA_ATTRIBUTES,
  LIDERANCA_ATTRIBUTES,
  SCALE,
  Attribute,
  Dimension,
} from "@/lib/culture-data";

interface Evaluation {
  id: string;
  type: "SELF" | "PEER" | "SUBORDINATE" | "LEADER";
  status: string;
  evaluatee: { id: string; name: string; department: string; jobTitle: string; isLeader: boolean };
  cycle: { name: string };
  responses: Array<{ dimension: string; attribute: string; score: number; justification: string }>;
}

type ResponseMap = Record<string, { score: number; justification: string }>;

const TYPE_LABELS: Record<string, string> = {
  SELF: "Autoavaliação",
  PEER: "Avaliação de Par",
  SUBORDINATE: "Avaliação de Liderado",
  LEADER: "Avaliação de Líder",
};

const DIMENSION_LABELS: Record<Dimension, string> = {
  CULTURA: "Cultura (JiT)",
  PERFORMANCE: "Performance",
  IA: "IA — ExcelêncIA",
  LIDERANCA: "Liderança iFood",
};

const DIMENSION_COLORS: Record<Dimension, string> = {
  CULTURA: "#7C3AED",
  PERFORMANCE: "#E5302F",
  IA: "#0EA5E9",
  LIDERANCA: "#D97706",
};

function getDimensions(type: string, isLeader: boolean): Dimension[] {
  const base: Dimension[] = ["CULTURA", "PERFORMANCE"];
  if (type === "SELF" || type === "LEADER") base.push("IA");
  if (isLeader) base.push("LIDERANCA");
  return base;
}

function getAttributes(dim: Dimension): Attribute[] {
  switch (dim) {
    case "CULTURA": return CULTURA_ATTRIBUTES;
    case "PERFORMANCE": return PERFORMANCE_ATTRIBUTES;
    case "IA": return IA_ATTRIBUTES;
    case "LIDERANCA": return LIDERANCA_ATTRIBUTES;
  }
}

export default function EvaluateFormPage() {
  const { id } = useParams<{ id: string }>();
  const { status } = useSession();
  const router = useRouter();

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [responses, setResponses] = useState<ResponseMap>({});
  const [activeDim, setActiveDim] = useState<Dimension>("CULTURA");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!id || status !== "authenticated") return;
    fetch(`/api/evaluations/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setEvaluation(data);
        const map: ResponseMap = {};
        for (const r of data.responses ?? []) {
          map[`${r.dimension}::${r.attribute}`] = { score: r.score, justification: r.justification ?? "" };
        }
        setResponses(map);
        setLoading(false);
      });
  }, [id, status]);

  function setScore(dim: Dimension, attr: string, score: number) {
    setResponses((prev) => ({
      ...prev,
      [`${dim}::${attr}`]: { ...prev[`${dim}::${attr}`], score },
    }));
  }

  function setJustification(dim: Dimension, attr: string, text: string) {
    setResponses((prev) => ({
      ...prev,
      [`${dim}::${attr}`]: { ...prev[`${dim}::${attr}`], justification: text, score: prev[`${dim}::${attr}`]?.score ?? 0 },
    }));
  }

  function completionFor(dim: Dimension) {
    const attrs = getAttributes(dim);
    const done = attrs.filter((a) => (responses[`${dim}::${a.key}`]?.score ?? 0) > 0).length;
    return { done, total: attrs.length };
  }

  function isAllDone() {
    if (!evaluation) return false;
    const dims = getDimensions(evaluation.type, evaluation.evaluatee.isLeader);
    return dims.every((d) => {
      const { done, total } = completionFor(d);
      return done === total;
    });
  }

  async function handleSubmit() {
    if (!evaluation || !isAllDone()) return;
    setSaving(true);

    const payload = Object.entries(responses)
      .filter(([, v]) => v.score > 0)
      .map(([key, v]) => {
        const [dimension, attribute] = key.split("::");
        return { dimension, attribute, score: v.score, justification: v.justification };
      });

    await fetch("/api/evaluations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evaluationId: evaluation.id, responses: payload }),
    });

    router.push("/dashboard");
  }

  if (loading || !evaluation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (evaluation.status === "COMPLETED") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Avaliação concluída!</h1>
          <p className="text-gray-500 mb-6">Esta avaliação já foi enviada com sucesso.</p>
          <button onClick={() => router.push("/dashboard")} className="px-6 py-3 text-white rounded-xl font-bold" style={{ background: "#E5302F" }}>
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  const dims = getDimensions(evaluation.type, evaluation.evaluatee.isLeader);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#E5302F" }}>
                {TYPE_LABELS[evaluation.type]}
              </span>
              <h1 className="text-xl font-black text-gray-900 mt-2">{evaluation.evaluatee.name}</h1>
              <p className="text-sm text-gray-500">{evaluation.evaluatee.jobTitle} · {evaluation.evaluatee.department}</p>
              <p className="text-xs text-gray-400 mt-1">Ciclo: {evaluation.cycle.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Progresso</p>
              <p className="text-2xl font-black" style={{ color: "#E5302F" }}>
                {dims.reduce((s, d) => s + completionFor(d).done, 0)}/
                {dims.reduce((s, d) => s + completionFor(d).total, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Dimension tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {dims.map((dim) => {
            const { done, total } = completionFor(dim);
            const isActive = activeDim === dim;
            return (
              <button
                key={dim}
                onClick={() => setActiveDim(dim)}
                className="flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all border-2"
                style={{
                  background: isActive ? DIMENSION_COLORS[dim] : "white",
                  color: isActive ? "white" : DIMENSION_COLORS[dim],
                  borderColor: DIMENSION_COLORS[dim],
                }}
              >
                {DIMENSION_LABELS[dim]} ({done}/{total})
              </button>
            );
          })}
        </div>

        {/* Attributes */}
        <div className="flex flex-col gap-4">
          {getAttributes(activeDim).map((attr) => {
            const key = `${activeDim}::${attr.key}`;
            const current = responses[key] ?? { score: 0, justification: "" };

            return (
              <div key={attr.key} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-2 self-stretch rounded-full shrink-0"
                    style={{ background: DIMENSION_COLORS[activeDim] }}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{attr.label}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{attr.description}</p>
                  </div>
                </div>

                {/* Score picker */}
                <div className="flex gap-2 flex-wrap mb-4">
                  {SCALE.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setScore(activeDim, attr.key, s.value)}
                      className="flex-1 min-w-[110px] px-2 py-2 rounded-xl border-2 text-xs font-bold transition-all text-center"
                      style={{
                        background: current.score === s.value ? s.color : s.bg,
                        color: current.score === s.value ? "white" : s.color,
                        borderColor: s.color,
                      }}
                    >
                      <span className="text-base">{s.value}</span>
                      <br />
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Justification */}
                <textarea
                  value={current.justification}
                  onChange={(e) => setJustification(activeDim, attr.key, e.target.value)}
                  placeholder="Justificativa (opcional) — cite exemplos concretos..."
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none"
                />
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <div className="mt-8 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <div>
            {isAllDone() ? (
              <p className="text-green-600 font-semibold text-sm">✅ Todos os atributos preenchidos!</p>
            ) : (
              <p className="text-orange-500 font-semibold text-sm">
                ⚠️ Preencha todos os atributos para enviar.
              </p>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isAllDone() || saving}
            className="px-8 py-3 text-white rounded-xl font-bold disabled:opacity-40 transition-opacity"
            style={{ background: "#E5302F" }}
          >
            {saving ? "Enviando..." : "Enviar Avaliação"}
          </button>
        </div>
      </main>
    </div>
  );
}
