export const SCALE = [
  { value: 1, label: "ESTACIONADO", description: "Desconectado com o destino final!", color: "#DC2626", bg: "#FEE2E2" },
  { value: 2, label: "AJUSTANDO A ROTA", description: "Foco em otimizar o trajeto!", color: "#EA580C", bg: "#FFEDD5" },
  { value: 3, label: "NA ROTA", description: "Parabéns! No caminho certo!", color: "#D97706", bg: "#FEF3C7" },
  { value: 4, label: "BRILHOU NA ENTREGA", description: "Surpreendendo ao longo da jornada!", color: "#16A34A", bg: "#DCFCE7" },
  { value: 5, label: "VOANDO ALTO", description: "Constantemente muito acima do esperado!", color: "#15803D", bg: "#BBF7D0" },
];

export type Dimension = "CULTURA" | "PERFORMANCE" | "IA" | "LIDERANCA";

export interface Attribute {
  key: string;
  label: string;
  description: string;
  dimension: Dimension;
}

export const CULTURA_ATTRIBUTES: Attribute[] = [
  {
    key: "SONHE_GRANDE",
    label: "Sonhe Grande",
    description: "Seja movido por propósito e apetite constante. Transforma ideias ambiciosas em ações que geram resultados.",
    dimension: "CULTURA",
  },
  {
    key: "CONFLITOS_PRODUTIVOS",
    label: "Conflitos Produtivos",
    description: "Encare a verdade e os conflitos de frente. Fala com honestidade, dá feedbacks construtivos com respeito e escuta ativa.",
    dimension: "CULTURA",
  },
  {
    key: "MENTALIDADE_DONO",
    label: "Mentalidade de Dono",
    description: "Pensa no iFood em primeiro lugar. Assume responsabilidade sem terceirizar problemas. Age com ética, autonomia e foco em resultados.",
    dimension: "CULTURA",
  },
  {
    key: "AMBIDESTRIA",
    label: "Ambidestria",
    description: "Valoriza inovação como motor do crescimento. Opera com eficiência e disrupção ao mesmo tempo. Cria soluções escaláveis.",
    dimension: "CULTURA",
  },
  {
    key: "AGIL_FALHE_RAPIDO",
    label: "Ágil: Falhe Rápido e Aprenda",
    description: "Aprende fazendo. Testa, erra, corrige rápido e mantém o ritmo — sem medo de ajustar a rota.",
    dimension: "CULTURA",
  },
  {
    key: "PRIORIZE_80_20",
    label: "Priorize 80/20",
    description: "Foca no essencial. Desomplica o caminho e transforma problemas em soluções que geram resultados de impacto.",
    dimension: "CULTURA",
  },
  {
    key: "GENTE",
    label: "Gente",
    description: "Acredita na força das pessoas. Valoriza equidade e diversidade — de pessoas, trajetórias e ideias.",
    dimension: "CULTURA",
  },
];

export const PERFORMANCE_ATTRIBUTES: Attribute[] = [
  {
    key: "CONSISTENCIA_ENTREGAS",
    label: "Consistência das Entregas",
    description: "Entrega de forma consistente, cumprindo prazos e compromissos assumidos com qualidade.",
    dimension: "PERFORMANCE",
  },
  {
    key: "IMPACTO_ENTREGAS",
    label: "Impacto das Entregas",
    description: "Gera impacto real e relevante para o negócio, time e ecossistema com suas entregas.",
    dimension: "PERFORMANCE",
  },
  {
    key: "QUALIDADE_ENTREGAS",
    label: "Qualidade das Entregas",
    description: "Entrega com alto padrão de qualidade, atenção ao detalhe e cuidado com a excelência.",
    dimension: "PERFORMANCE",
  },
];

export const IA_ATTRIBUTES: Attribute[] = [
  {
    key: "IA_EXPERIMENTA_USA",
    label: "Experimenta e Usa IA Regularmente",
    description: "Entende, experimenta e usa IA no dia a dia. Trata IA como ferramenta transformadora, não apenas de produtividade.",
    dimension: "IA",
  },
  {
    key: "IA_MULTIPLICADOR_FORCA",
    label: "IA como Multiplicador de Força",
    description: "Usa IA para potencializar resultados do time, entregando produtos melhores e mais rápidos.",
    dimension: "IA",
  },
  {
    key: "IA_NO_TRABALHO",
    label: "IA no Centro do Trabalho/Produto",
    description: "Incorpora IA no core do seu trabalho ou produto — não apenas em features incrementais.",
    dimension: "IA",
  },
  {
    key: "IA_FUTURO",
    label: "Constrói para a IA do Futuro",
    description: "Projeta soluções pensando em capacidades de IA que ainda estão evoluindo, com visão de longo prazo.",
    dimension: "IA",
  },
];

export const LIDERANCA_ATTRIBUTES: Attribute[] = [
  {
    key: "CONSTRUA_TIME_MELHOR",
    label: "Construa um Time Melhor que Você",
    description: "É exemplo. Garante pessoas certas nos lugares certos. Constrói a próxima geração de líderes. Cuida e desafia muito.",
    dimension: "LIDERANCA",
  },
  {
    key: "NAO_NEGOCIE_CULTURA",
    label: "Não Negocie Cultura",
    description: "Toma decisões difíceis e rápidas. Não permite ninguém jogando contra. Dá feedbacks e não é bonzinho.",
    dimension: "LIDERANCA",
  },
  {
    key: "HIGH_QUALITY_AGREEMENT",
    label: "Garanta High Quality Agreement",
    description: "Supera frustrações e ego. Entende a direção, comunica e engaja o time. iFood em 1º lugar.",
    dimension: "LIDERANCA",
  },
  {
    key: "ASSUMA_O_FRONT",
    label: "Assuma o Front",
    description: "Pega o problema e resolve, não repassa. Entende o detalhe. A melhor forma de quebrar silos é agindo.",
    dimension: "LIDERANCA",
  },
  {
    key: "SEJA_PARANOICO",
    label: "Seja Paranoico",
    description: "Busca fanaticamente a eficiência. Olha para o time com a mesma obsessão que olha para o mapa estratégico.",
    dimension: "LIDERANCA",
  },
];

export const ALL_ATTRIBUTES: Attribute[] = [
  ...CULTURA_ATTRIBUTES,
  ...PERFORMANCE_ATTRIBUTES,
  ...IA_ATTRIBUTES,
  ...LIDERANCA_ATTRIBUTES,
];

export function getAttributesByDimension(dimension: Dimension): Attribute[] {
  return ALL_ATTRIBUTES.filter((a) => a.dimension === dimension);
}

export function getScaleItem(value: number) {
  return SCALE.find((s) => s.value === value) ?? SCALE[2];
}

export function getDimensionsForEvalType(
  type: "SELF" | "PEER" | "SUBORDINATE" | "LEADER",
  evaluateeIsLeader: boolean
): Dimension[] {
  const base: Dimension[] = ["CULTURA", "PERFORMANCE", "IA"];
  if (evaluateeIsLeader) base.push("LIDERANCA");
  return base;
}
