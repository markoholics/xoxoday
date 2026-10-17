import { useState } from "react";
import { api } from "../api";
import { fmt } from "../lib";
import type { DaySummary, Entry } from "../types";
import EntryRow from "./EntryRow";
import Ring from "./Ring";

interface Props {
  data: (DaySummary & { target: number }) | null;
  error: string;
  onTarget: (t: number) => void;
  onOpen: (e: Entry) => void;
}

export default function Dashboard({ data, error, onTarget, onOpen }: Props) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");

  if (error) return <p className="error-box">{error}</p>;
  if (!data) return <div className="spinner center" />;

  const remaining = data.target - data.total_calories;
  const saveTarget = async () => {
    const n = Number(val);
    if (!Number.isFinite(n) || n < 500 || n > 20000) return setErr("Enter a target between 500 and 20,000 kcal.");
    try {
      onTarget((await api.setTarget(n)).target);
      setEditing(false);
      setErr("");
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  const macro = (label: string, g: number, cls: string) => (
    <div className={`macro ${cls}`}>
      <b>{fmt(g)}g</b>
      <span>{label}</span>
    </div>
  );

  return (
    <>
      <section className="card hero-card">
        <Ring value={data.total_calories} target={data.target} />
        <div className="hero-side">
          <div className={`remaining${remaining < 0 ? " over" : ""}`}>
            {Math.abs(remaining)} kcal
            <span>{remaining < 0 ? "over target" : "remaining"}</span>
          </div>
          <div className="macros">
            {macro("Protein", data.total_protein, "p")}
            {macro("Carbs", data.total_carbs, "c")}
            {macro("Fat", data.total_fat, "f")}
          </div>
          {editing ? (
            <form
              className="row"
              onSubmit={(e) => {
                e.preventDefault();
                void saveTarget();
              }}
            >
              <input aria-label="Daily calorie target" inputMode="numeric" autoFocus value={val} onChange={(e) => setVal(e.target.value)} />
              <button className="btn primary">Save</button>
              <button type="button" className="btn ghost" onClick={() => setEditing(false)}>
                ✕
              </button>
            </form>
          ) : (
            <button
              className="btn ghost small"
              onClick={() => {
                setVal(String(data.target));
                setEditing(true);
              }}
            >
              Daily target: {data.target} kcal · Edit
            </button>
          )}
          {err && <p className="error-text small">{err}</p>}
        </div>
      </section>

      <h3 className="section-title">Today's log</h3>
      {data.entries.length === 0 ? (
        <div className="empty">
          <p>Nothing logged yet today.</p>
          <p className="muted">Tap “Log food” to snap your first meal.</p>
        </div>
      ) : (
        <div className="list">
          {data.entries.map((e) => (
            <EntryRow key={e.id} entry={e} onOpen={() => onOpen(e)} />
          ))}
        </div>
      )}
    </>
  );
}
