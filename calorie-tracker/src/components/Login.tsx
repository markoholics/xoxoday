import { useState } from "react";
import { ApiError, api, setPassword } from "../api";

export default function Login({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  return (
    <form
      className="login card"
      onSubmit={async (e) => {
        e.preventDefault();
        setPassword(pw);
        try {
          await api.auth();
          onOk();
        } catch (ex) {
          setErr(ex instanceof ApiError && ex.status === 401 ? "Wrong password." : (ex as Error).message);
        }
      }}
    >
      <h1>CalorieSnap</h1>
      <p className="muted">This app is private. Enter the passphrase to continue.</p>
      <input type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} aria-label="Passphrase" />
      {err && <p className="error-text">{err}</p>}
      <button className="btn primary">Unlock</button>
    </form>
  );
}
