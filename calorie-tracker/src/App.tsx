import { useCallback, useEffect, useState } from "react";
import { ApiError, api, setUnauthorizedHandler } from "./api";
import AddFood from "./components/AddFood";
import Dashboard from "./components/Dashboard";
import EntrySheet from "./components/EntrySheet";
import History from "./components/History";
import Login from "./components/Login";
import { localDay } from "./lib";
import type { DaySummary, Entry } from "./types";

export default function App() {
  const [locked, setLocked] = useState(false);
  const [tab, setTab] = useState<"today" | "history">("today");
  const [today, setToday] = useState<(DaySummary & { target: number }) | null>(null);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState<Entry | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => setUnauthorizedHandler(() => setLocked(true)), []);

  const loadToday = useCallback(async () => {
    try {
      setToday(await api.day(localDay()));
      setError("");
    } catch (e) {
      if (!(e instanceof ApiError && e.status === 401)) setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    if (!locked) void loadToday();
  }, [locked, loadToday]);

  const changed = () => {
    setRefreshKey((k) => k + 1);
    void loadToday();
  };

  if (locked)
    return (
      <Login
        onOk={() => {
          setLocked(false);
          changed();
        }}
      />
    );

  return (
    <div className="app">
      <header className="topbar">
        <h1>CalorieSnap</h1>
        <nav>
          <button className={tab === "today" ? "on" : ""} onClick={() => setTab("today")}>
            Today
          </button>
          <button className={tab === "history" ? "on" : ""} onClick={() => setTab("history")}>
            History
          </button>
        </nav>
      </header>

      <main>
        {tab === "today" ? (
          <Dashboard data={today} error={error} onTarget={(t) => setToday((d) => d && { ...d, target: t })} onOpen={setOpen} />
        ) : (
          <History refreshKey={refreshKey} onOpen={setOpen} />
        )}
      </main>

      <button className="fab" onClick={() => setAdding(true)}>
        ＋ Log food
      </button>

      {adding && (
        <AddFood
          onClose={() => setAdding(false)}
          onDone={(e) => {
            setAdding(false);
            setOpen(e);
            changed();
          }}
        />
      )}

      {open && (
        <EntrySheet
          entry={open}
          onClose={() => setOpen(null)}
          onChange={(e) => {
            setOpen(e);
            changed();
          }}
        />
      )}
    </div>
  );
}
