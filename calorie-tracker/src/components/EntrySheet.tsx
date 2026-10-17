import { useState } from "react";
import { api, imgSrc } from "../api";
import { KIND_LABEL, fmt, timeLabel } from "../lib";
import type { Entry, Item } from "../types";

interface Props {
  entry: Entry;
  onChange: (e: Entry | null) => void; // null => entry removed
  onClose: () => void;
}

const SOURCE_LABEL = { estimated: "AI estimate", label: "From label", barcode: "Open Food Facts" } as const;

export default function EntrySheet({ entry, onChange, onClose }: Props) {
  const [editing, setEditing] = useState<number | null>(null);
  const [err, setErr] = useState("");

  const guard = async (fn: () => Promise<void>) => {
    setErr("");
    try {
      await fn();
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet tall" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>{entry.title}</h2>
          <button className="btn ghost" onClick={onClose}>
            Done
          </button>
        </div>
        <div className="muted small">
          {timeLabel(entry.created_at)} · <span className={`tag ${entry.kind}`}>{KIND_LABEL[entry.kind]}</span>
          {entry.barcode && ` · ${entry.barcode}`}
        </div>

        {entry.image_url && <img className="hero" src={imgSrc(entry.image_url)} alt={entry.title} />}

        <div className="totals">
          <div>
            <b>{entry.total_calories}</b>
            <span>kcal</span>
          </div>
          <div>
            <b>{fmt(entry.total_protein)}g</b>
            <span>protein</span>
          </div>
          <div>
            <b>{fmt(entry.total_carbs)}g</b>
            <span>carbs</span>
          </div>
          <div>
            <b>{fmt(entry.total_fat)}g</b>
            <span>fat</span>
          </div>
        </div>

        {entry.notes && <p className="note">{entry.notes}</p>}
        {err && (
          <p className="error-box" role="alert">
            {err}
          </p>
        )}

        <h3>Items</h3>
        <p className="muted small">Tap an item to correct its calories or macros.</p>
        <ul className="items">
          {entry.items.map((it) =>
            editing === it.id ? (
              <li key={it.id}>
                <ItemForm
                  item={it}
                  onCancel={() => setEditing(null)}
                  onSave={(f) =>
                    guard(async () => {
                      onChange(await api.patchItem(it.id, f));
                      setEditing(null);
                    })
                  }
                  onReset={() =>
                    guard(async () => {
                      onChange(await api.resetItem(it.id));
                      setEditing(null);
                    })
                  }
                  onDelete={() =>
                    guard(async () => {
                      const r = await api.deleteItem(it.id);
                      setEditing(null);
                      onChange(r.entry);
                    })
                  }
                />
              </li>
            ) : (
              <li key={it.id}>
                <button className="item" onClick={() => setEditing(it.id)}>
                  <div className="item-main">
                    <div className="item-name">
                      {it.name} {it.edited && <span className="tag edited">edited</span>}
                    </div>
                    <div className="muted small">
                      {it.portion && `${it.portion} · `}P {fmt(it.protein)} · C {fmt(it.carbs)} · F {fmt(it.fat)} · {SOURCE_LABEL[it.source]}
                    </div>
                  </div>
                  <div className="entry-kcal">
                    {it.calories}
                    <span className="small muted"> kcal</span>
                  </div>
                </button>
              </li>
            ),
          )}
        </ul>

        <button
          className="btn danger"
          onClick={() => {
            if (confirm("Delete this whole entry?")) void guard(async () => (await api.deleteEntry(entry.id), onChange(null)));
          }}
        >
          Delete entry
        </button>
      </div>
    </div>
  );
}

function ItemForm({
  item,
  onSave,
  onCancel,
  onReset,
  onDelete,
}: {
  item: Item;
  onSave: (f: { name: string; portion: string; calories: number; protein: number; carbs: number; fat: number }) => void;
  onCancel: () => void;
  onReset: () => void;
  onDelete: () => void;
}) {
  const [f, setF] = useState({
    name: item.name,
    portion: item.portion,
    calories: String(item.calories),
    protein: String(item.protein),
    carbs: String(item.carbs),
    fat: String(item.fat),
  });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const nums = [f.calories, f.protein, f.carbs, f.fat].map((v) => (v.trim() === "" ? NaN : Number(v)));
  const valid = f.name.trim() !== "" && nums.every((n) => Number.isFinite(n) && n >= 0);
  const o = item.original;

  return (
    <form
      className="item-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onSave({ name: f.name, portion: f.portion, calories: nums[0], protein: nums[1], carbs: nums[2], fat: nums[3] });
      }}
    >
      <label>
        Name
        <input value={f.name} onChange={set("name")} maxLength={120} />
      </label>
      <label>
        Portion
        <input value={f.portion} onChange={set("portion")} maxLength={120} />
      </label>
      <div className="grid4">
        <label>
          Calories
          <input inputMode="decimal" value={f.calories} onChange={set("calories")} />
        </label>
        <label>
          Protein g
          <input inputMode="decimal" value={f.protein} onChange={set("protein")} />
        </label>
        <label>
          Carbs g
          <input inputMode="decimal" value={f.carbs} onChange={set("carbs")} />
        </label>
        <label>
          Fat g
          <input inputMode="decimal" value={f.fat} onChange={set("fat")} />
        </label>
      </div>
      <p className="muted small">
        Original: {o.calories} kcal · P {fmt(o.protein)} · C {fmt(o.carbs)} · F {fmt(o.fat)}
      </p>
      <div className="row">
        <button className="btn primary" disabled={!valid}>
          Save
        </button>
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        {item.edited && (
          <button type="button" className="btn" onClick={onReset}>
            Reset
          </button>
        )}
        <button type="button" className="btn danger" onClick={onDelete}>
          Remove
        </button>
      </div>
    </form>
  );
}
