export const STATUSES = [
  {
    id: "planning",
    label: "Planification",
    code: "PLN",
    dot: "bg-slate",
    text: "text-slate",
    border: "border-slate/40",
    bg: "bg-slate/10",
  },

  {
    id: "permitting",
    label: "Permis",
    code: "PRM",
    dot: "bg-brass",
    text: "text-brass-dark",
    border: "border-brass/40",
    bg: "bg-brass/10",
  },

  {
    id: "construction",
    label: "En construction",
    code: "CON",
    dot: "bg-rust",
    text: "text-rust",
    border: "border-rust/40",
    bg: "bg-rust/10",
  },

  {
    id: "listed",
    label: "En vente",
    code: "LST",
    dot: "bg-sage",
    text: "text-sage",
    border: "border-sage/40",
    bg: "bg-sage/10",
  },

  {
    id: "sold",
    label: "Vendu",
    code: "SLD",
    dot: "bg-ink",
    text: "text-ink",
    border: "border-ink/30",
    bg: "bg-ink/5",
  },

  {
    id: "on-hold",
    label: "En attente",
    code: "HLD",
    dot: "bg-stone",
    text: "text-slate",
    border: "border-slate/30",
    bg: "bg-stone",
  },
];

export function getStatus(id) {
  return (
    STATUSES.find(
      (status) => status.id === id
    ) ?? STATUSES[0]
  );
}