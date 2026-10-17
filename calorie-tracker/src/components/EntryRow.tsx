import { imgSrc } from "../api";
import { KIND_LABEL, timeLabel } from "../lib";
import type { Entry } from "../types";

export default function EntryRow({ entry, onOpen }: { entry: Entry; onOpen: () => void }) {
  const edited = entry.items.some((i) => i.edited);
  return (
    <button className="entry" onClick={onOpen}>
      {entry.image_url ? <img src={imgSrc(entry.image_url)} alt="" loading="lazy" /> : <div className="thumb-empty">🔎</div>}
      <div className="entry-main">
        <div className="entry-title">{entry.title}</div>
        <div className="muted small">
          {timeLabel(entry.created_at)} · <span className={`tag ${entry.kind}`}>{KIND_LABEL[entry.kind]}</span>
          {entry.items.length > 1 && ` · ${entry.items.length} items`}
          {edited && " · edited"}
        </div>
      </div>
      <div className="entry-kcal">
        {entry.total_calories}
        <span className="small muted"> kcal</span>
      </div>
    </button>
  );
}
