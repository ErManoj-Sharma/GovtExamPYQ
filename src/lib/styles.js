export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0e0f14;
    --surface: #16181f;
    --surface2: #1d2030;
    --border: #2a2d3e;
    --text: #e8eaf0;
    --muted: #7b8099;
    --accent: #6c63ff;
    --accent2: #ff6584;
    --success: #34d399;
    --error: #f87171;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  .layout { display: flex; min-height: 100vh; }
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .content { flex: 1; overflow-y: auto; padding: 32px; }

  /* ── Buttons ── */
  .btn-primary {
    padding: 10px 28px;
    background: linear-gradient(135deg, var(--accent), #8b5cf6);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
    box-shadow: 0 4px 20px rgba(108,99,255,0.35);
  }
  .btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
  .btn-secondary {
    padding: 10px 24px;
    background: var(--surface2);
    color: var(--text);
    border: 1px solid var(--border);
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-secondary:hover { border-color: var(--accent); color: #a89fff; }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .sidebar.mobile-open { display: block; position: fixed; inset: 0; z-index: 50; width: 260px; }
    .mobile-toggle {
      position: fixed; bottom: 24px; right: 24px; z-index: 60;
      width: 48px; height: 48px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border: none; color: #fff; font-size: 22px; cursor: pointer;
      box-shadow: 0 4px 20px rgba(108,99,255,0.5);
      display: flex; align-items: center; justify-content: center;
    }
    .mobile-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 40;
    }
  }
  @media (min-width: 769px) { .mobile-toggle { display: none; } }
`;