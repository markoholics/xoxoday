import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../api";
import { dayLabel, fmt } from "../lib";
import type { DaySummary, Entry } from "../types";
import EntryRow from "./EntryRow";

interface Props {
  refreshKey: number;
  onOpen: (e: Entry) => void;
}

export default function History({ refreshKey, onOpen }: Props) {
  const [days, setDays] = useState<DaySummary[]>([]);
  const [target, setTarget] = useState(2000);
  const [next, setNext] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const sentinel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const load = useCallback(async (before: string | null, reset: boolean) => {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setError("");
    try {
      const r = await api.history(before);
      setTarget(r.target);
      setDays((d) => (reset ? r.days : [...d, ...r.days]));
      setNext(r.nextBefore);
      setDone(r.nextBefore === null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }, []);

  // Reload from the top whenever something was logged/edited elsewhere.
  useEffect(() => {
    setDone(false);
    void load(null, true);
  }, [refreshKey, load]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || done || error) return;
    const io = new IntersectionObserver((es) => es[0].isIntersecting && next && void load(next, false), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, [next, done, error, load, days.length]);

  if (!loading && !error && days.length === 0)
    return (
      <div className="empty">
        <p>No history yet.</p>
        <p className="muted">Days you log food on will show up here.</p>
      </div>
    );

  return (
    <>
      {days.map((d) => {
        const over = d.total_calories > target;
        return (
          <section key={d.day} className="day">
            <header className="day-head">
              <h3>{dayLabel(d.day)}</h3>
              <div className={`day-total${over ? " over" : ""}`}>
                {d.total_calories} <span className="muted">/ {target} kcal</span>
              </div>
            </header>
            <div className="bar">
              <i className={over ? "over" : ""} style={{ width: `${Math.min(100, (d.total_calories / target) * 100)}%` }} />
            </div>
            <div className="muted small">
              P {fmt(d.total_protein)}g · C {fmt(d.total_carbs)}g · F {fmt(d.total_fat)}g
            </div>
            <div className="list">
              {d.entries.map((e) => (
                <EntryRow key={e.id} entry={e} onOpen={() => onOpen(e)} />
              ))}
            </div>
          </section>
        );
      })}
      {error && (
        <div className="error-box">
          <p>{error}</p>
          <button className="btn" onClick={() => void load(next, days.length === 0)}>
            Retry
          </button>
        </div>
      )}
      {loading && <div className="spinner center" />}
      {done && days.length > 0 && <p className="muted center-text small">That's everything.</p>}
      <div ref={sentinel} style={{ height: 1 }} />
    </>
  );
}
