import { useRef, useState } from "react";
import { api } from "../api";
import { localDay, toDataUrl } from "../lib";
import type { Entry } from "../types";
import Camera from "./Camera";

interface Props {
  onDone: (entry: Entry) => void;
  onClose: () => void;
}

type Stage = { name: "choose" } | { name: "camera" } | { name: "busy"; preview: string | null; label: string } | { name: "error"; message: string };

export default function AddFood({ onDone, onClose }: Props) {
  const [stage, setStage] = useState<Stage>({ name: "choose" });
  const [barcode, setBarcode] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const nativeCamRef = useRef<HTMLInputElement>(null);

  const submitImage = async (blob: Blob) => {
    try {
      const dataUrl = await toDataUrl(blob);
      setStage({ name: "busy", preview: dataUrl, label: "Identifying your food…" });
      onDone(await api.analyze({ image: dataUrl, day: localDay() }));
    } catch (e) {
      setStage({ name: "error", message: (e as Error).message });
    }
  };

  const submitBarcode = async () => {
    setStage({ name: "busy", preview: null, label: "Looking up product…" });
    try {
      onDone(await api.analyze({ barcode, day: localDay() }));
    } catch (e) {
      setStage({ name: "error", message: (e as Error).message });
    }
  };

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) void submitImage(f);
  };

  const openCamera = () => {
    if ((navigator.mediaDevices as MediaDevices | undefined)?.getUserMedia) setStage({ name: "camera" });
    else nativeCamRef.current?.click();
  };

  if (stage.name === "camera")
    return (
      <Camera
        onClose={() => setStage({ name: "choose" })}
        onCapture={(b) => void submitImage(b)}
        onUnavailable={() => {
          setStage({ name: "choose" });
          nativeCamRef.current?.click();
        }}
      />
    );

  return (
    <div className="overlay" onClick={stage.name === "busy" ? undefined : onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>Log food</h2>
          {stage.name !== "busy" && (
            <button className="btn ghost" onClick={onClose}>
              Close
            </button>
          )}
        </div>

        {stage.name === "busy" && (
          <div className="busy">
            {stage.preview && <img src={stage.preview} alt="" />}
            <div className="spinner" />
            <p>{stage.label}</p>
          </div>
        )}

        {stage.name === "error" && (
          <div className="error-box" role="alert">
            <p>{stage.message}</p>
            <button className="btn" onClick={() => setStage({ name: "choose" })}>
              Try again
            </button>
          </div>
        )}

        {stage.name === "choose" && (
          <>
            <p className="muted">Snap a plate, a nutrition label or a barcode. We'll work out which it is.</p>
            <div className="choices">
              <button className="btn primary big" onClick={openCamera}>
                📷 Take photo
              </button>
              <button className="btn big" onClick={() => fileRef.current?.click()}>
                🖼️ Upload photo
              </button>
            </div>
            <form
              className="barcode-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (barcode.trim()) void submitBarcode();
              }}
            >
              <label htmlFor="bc" className="muted">
                Or type a barcode number
              </label>
              <div className="row">
                <input id="bc" inputMode="numeric" placeholder="e.g. 3017620422003" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                <button className="btn" disabled={!barcode.trim()}>
                  Look up
                </button>
              </div>
            </form>
          </>
        )}

        <input ref={fileRef} type="file" accept="image/*" hidden onChange={pick} />
        <input ref={nativeCamRef} type="file" accept="image/*" capture="environment" hidden onChange={pick} />
      </div>
    </div>
  );
}
