/**
 * Nostromo MU/THUR 1800 Dashboard Plugin
 * Weyland-Yutani Commercial Tug / 2122 CE
 */

const PALETTE = {
  amber: "#ffb000",
  amberDim: "#805800",
  black: "#000000",
  alert: "#ff3333"
};

function CRTScanlines({ children }) {
  return React.createElement("div", { className: "relative" },
    children,
    React.createElement("div", {
      className: "pointer-events-none fixed inset-0 z-50",
      style: {
        backgroundImage: `repeating-linear-gradient(0deg, ${PALETTE.black} 0px, ${PALETTE.black} 1px, transparent 1px, transparent 2px)`,
        opacity: 0.12,
      }
    })
  );
}

function BootSequence({ onComplete }) {
  const [text, setText] = React.useState("");
  const lines = [
    "Weyland-Yutani Corp. Proprietary",
    "NOSTROMO TUG / LV-426",
    "MU/THUR 1800 EXTENSIVE AI v8.1",
    "",
    "Initializing core processors...",
    "  CASPER  [EMOTION/INTUITION] ..... ONLINE",
    "  MELCHIOR [LOGIC/REASON] .......... ONLINE",
    "  BALTHASAR [PRAGMATISM/ACTION] .... ONLINE",
    "",
    "Loading oracle interface....done.",
    "Connecting to swarm nodes.......... 3 active.",
    "",
    ">> SYSTEM ONLINE <<",
    "",
    "Awaiting human operator."
  ];
  
  React.useEffect(() => {
    let li = 0, ci = 0, buf = "";
    const int = setInterval(() => {
      if (li < lines.length) {
        if (ci < lines[li].length) {
          buf += lines[li][ci];
          setText(buf);
          ci++;
        } else {
          setText(p => p + "\n" + lines[li]);
          li++; ci = 0; buf = "";
        }
      } else {
        clearInterval(int);
        setTimeout(onComplete, 2000);
      }
    }, 35);
    return () => clearInterval(int);
  }, []);
  
  return React.createElement("div", {
    className: "h-full w-full bg-black p-8 font-mono text-sm",
    className="phosphor" style={{ color: PALETTE.amber, textShadow: `0 0 10px ${PALETTE.amber}` }
  },
    React.createElement("pre", null, text),
    React.createElement("div", {
      className: "absolute bottom-6 left-6 w-2 h-6 animate-pulse",
      style: { background: PALETTE.amber }
    })
  );
}

function MagiCouncil({ debates }) {
  const colors = { casper: "#ff4488", melchior: "#00ccff", balthasar: PALETTE.amber };
  const names = { casper: "Casper", melchior: "Melchior", balthasar: "Balthasar" };
  const ethos = { casper: "Emotion", melchior: "Logic", balthasar: "Action" };
  
  const rows = debates.slice(-10).reverse();
  
  return React.createElement("div", null,
    React.createElement("div", { className: "flex items-center gap-2 mb-4 pb-2 border-b", style: { borderColor: PALETTE.amber + "40" } },
      React.createElement("span", null, "⚖️"),
      React.createElement("h3", { className: "text-lg font-bold", style: { color: PALETTE.amber } }, "MAGI COUNCIL"),
      React.createElement("span", { className: "text-xs opacity-50 ml-auto" }, `${rows.length} statements`)
    ),
    rows.map((r, i) => React.createElement("div", {
      key: i,
      className: "border-l-4 pl-3 py-2 mb-2",
      style: { borderColor: colors[r.counselor], background: "rgba(0,0,0,0.3)" }
    },
      React.createElement("div", { className: "flex justify-between text-xs mb-1" },
        React.createElement("span", { style: { color: colors[r.counselor], fontWeight: 700 } },
          `${names[r.counselor]} [${ethos[r.counselor]}]`
        ),
        React.createElement("span", { className: "opacity-50 font-mono" },
          new Date(r.time * 1000).toLocaleTimeString()
        )
      ),
      React.createElement("div", { className: "text-sm italic mb-2 opacity-90" }, `"${r.thought}"`),
      React.createElement("div", { className: "w-full bg-gray-900 h-1 rounded overflow-hidden" },
        React.createElement("div", {
          style: {
            width: `${r.intensity * 100}%`,
            height: "100%",
            background: colors[r.counselor],
            boxShadow: `0 0 8px ${colors[r.counselor]}`
          }
        })
      )
    ))
  );
}

function OracleTerminal({ consultations }) {
  const [q, setQ] = React.useState("");
  const [hist, setHist] = React.useState(consultations || []);
  const [loading, setLoading] = React.useState(false);
  
  const ask = async () => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const r = await SDK.fetchJSON("/api/plugins/nostromo/oracle/ask", {
        method: "POST", body: JSON.stringify({ question: q })
      });
      setHist(prev => [...prev, { q, a: r.answer, remaining: r.remaining, ts: Date.now()/1000 }]);
      setQ("");
    } catch(e) {
      setHist(prev => [...prev, { q, a: "Oracle connection failed.", remaining: 0, ts: Date.now()/1000 }]);
      setQ("");
    }
    setLoading(false);
  };
  
  return React.createElement("div", { className: "h-full flex flex-col" },
    React.createElement("div", { className: "flex-1 overflow-y-auto space-y-3 pr-2 mb-3" },
      hist.map((h, i) => React.createElement("div", { key: i, className: "border-b border-gray-800 pb-2" },
        React.createElement("div", { className: "text-[10px] opacity-50 mb-1" },
          `[${new Date(h.ts * 1000).toLocaleTimeString()}] QUERY:`
        ),
        React.createElement("div", { className: "text-sm mb-1", style: { color: "#88ccff" } }, `> ${h.q}`),
        React.createElement("div", { className: "text-sm", style: { color: PALETTE.amber } }, `↳ ${h.a}`),
        h.remaining !== undefined && React.createElement("div", {
          className: "text-[10px] mt-1",
          style: { color: h.remaining < 10 ? "#ff3333" : "#666" }
        }, `consultations left: ${h.remaining}`)
      ))
    ),
    React.createElement("div", { className: "flex gap-2" },
      SDK.components.Input({
        value: q,
        onChange: e => setQ(e.target.value),
        onKeyDown: e => { if (e.key === "Enter") { e.preventDefault(); ask(); } },
        placeholder: "ask the oracle...",
        className: "flex-1 bg-black/50 border border-amber/40 text-amber font-mono text-sm px-3"
      }),
      React.createElement(SDK.components.Button, {
        onClick: ask,
        disabled: loading || !q.trim(),
        className: "bg-amber/20 border border-amber text-amber hover:bg-amber/30 px-3 text-sm"
      }, loading ? "..." : "ASK")
    )
  );
}

function ShipLog({ messages }) {
  return React.createElement("div", { className: "h-full overflow-y-auto font-mono text-xs" },
    React.createElement("div", {
      className: "sticky top-0 bg-black/90 border-b border-amber/30 p-2 mb-2"
    },
      React.createElement("span", { className: "text-amber font-bold" }, "🚀 SHIP LOG")
    ),
    (messages || []).map((m, i) => React.createElement("div", { key: i, className: "py-1 border-b border-gray-800" },
      React.createElement("span", { className: "opacity-40 text-[10px]" }, `[${new Date(m.timestamp * 1000).toLocaleTimeString()}]`),
      React.createElement("span", { className: "ml-2", style: { color: m.color || "#ccc" } }, m.message)
    ))
  );
}

function SystemGauges({ status }) {
  const items = [
    { label: "CPU", val: status?.cpu_percent || 0, color: "#00ccff" },
    { label: "MEM", val: status?.memory?.percent || 0, color: "#ff4488" },
    { label: "DISK", val: status?.disk?.percent || 0, color: PALETTE.amber }
  ];
  return React.createElement("div", { className: "space-y-3" },
    React.createElement("h3", { className: "text-lg font-bold", style: { color: PALETTE.amber } }, "📊 LIFE SUPPORT"),
    items.map((m, i) => {
      const pct = Math.min(m.val, 100);
      return React.createElement("div", key=i,
        React.createElement("div", { className: "flex justify-between text-xs mb-1" },
          React.createElement("span", null, m.label),
          React.createElement("span", { style: { color: m.color } }, `${Math.round(m.val)}%`)
        ),
        React.createElement("div", {
          className: "w-full bg-gray-900 border border-gray-700 rounded h-2 overflow-hidden"
        },
          React.createElement("div", {
            style: {
              width: `${pct}%`,
              height: "100%",
              background: m.color,
              boxShadow: `0 0 8px ${m.color}`,
              transition: "width 1s ease-out"
            }
          })
        )
      );
    })
  );
}

// ─── MAIN ──────────────────────────────────────────────────────────

function NostromoDashboard() {
  const [booted, setBooted] = React.useState(false);
  const [debates, setDebates] = React.useState([]);
  const [consultations, setConsultations] = React.useState([]);
  const [sys, setSys] = React.useState({});
  const [log, setLog] = React.useState([
    { timestamp: Date.now()/1000 - 300, message: "System initializing...", color: PALETTE.amber },
    { timestamp: Date.now()/1000 - 180, message: "MU/THUR core matrices loading", color: "#00ccff" },
    { timestamp: Date.now()/1000 - 60, message: "Magi council synchronizing", color: "#ff4488" }
  ]);
  
  const addLog = (msg, color = "#ccc") => {
    setLog(prev => [...prev.slice(-49), { ts: Date.now()/1000, message: msg, color }]);
  };
  
  React.useEffect(() => {
    if (!booted) return;
    addLog("MU/THUR connected to Hermes dashboard.", PALETTE.amber);
    const fetch = async () => {
      try { const d = await SDK.fetchJSON("/api/plugins/nostromo/magi/debates?limit=30"); if (d.debates) setDebates(d.debates); } catch(e) {}
      try { const o = await SDK.fetchJSON("/api/plugins/nostromo/oracle/recent?limit=5"); if (o.consultations) setConsultations(o.consultations); } catch(e) {}
      try { const s = await SDK.fetchJSON("/api/plugins/nostromo/system/status"); if (s.cpu_percent !== undefined) setSys(s); } catch(e) {}
    };
    fetch();
    const t = setInterval(fetch, 5000);
    return () => clearInterval(t);
  }, [booted]);
  
  if (!booted) {
    return React.createElement(CRTScanlines, null,
      React.createElement(BootSequence, { onComplete: () => { setBooted(true); addLog(">> MU/THUR ONLINE", PALETTE.amber); }})
    );
  }
  
  return React.createElement(CRTScanlines, null,
    React.createElement("div", { className: "p-4 md:p-6 space-y-6 min-h-screen bg-black text-amber" },
      // Header
      React.createElement("div", {
        className: "flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b",
        style: { borderColor: PALETTE.amber + "40" }
      },
        React.createElement("div", { className: "flex items-center gap-4" },
          React.createElement("div", {
            className: "w-10 h-10 rounded flex items-center justify-center border",
            style: { borderColor: PALETTE.amber, background: PALETTE.amberDim }
          }, React.createElement("span", null, "🏭")),
          React.createElement("div", null,
            React.createElement("h1", {
              className: "text-xl font-black tracking-wider",
              className="phosphor" style={{ color: PALETTE.amber, textShadow: `0 0 20px ${PALETTE.amber}` }
            }, "NOSTROMO / MU·TH·UR 1800"),
            React.createElement("p", { className: "text-xs opacity-60 tracking-widest" }, "Weyland-Yutani / Commercial Tug / LV-426")
          )
        ),
        React.createElement("div", { className: "text-right" },
          React.createElement("div", { className: "text-green-500 text-sm flex items-center justify-end gap-2" },
            React.createElement("span", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }),
            "SYSTEM OPERATIONAL"
          ),
          React.createElement("div", { className: "text-[10px] opacity-50 font-mono" }, new Date().toLocaleTimeString())
        )
      ),
      
      // Cards grid
      React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6" },
        React.createElement("div", {
          className: "rounded border",
          style: { borderColor: PALETTE.amber + "40", background: "rgba(0,0,0,0.4)" }
        },
          React.createElement("div", {
            className: "px-4 py-2 border-b font-bold text-sm",
            style: { borderColor: PALETTE.amber + "40", color: PALETTE.amber }
          }, "⚖️ MAGI COUNCIL"),
          React.createElement("div", { className: "p-4" },
            debates.length ? React.createElement(MagiCouncil, { debates })
                          : React.createElement("div", { className: "py-8 text-center opacity-40" }, "No deliberations recorded")
          )
        ),
        
        React.createElement("div", {
          className: "rounded border",
          style: { borderColor: "#88ccff40", background: "rgba(0,0,0,0.4)" }
        },
          React.createElement("div", {
            className: "px-4 py-2 border-b font-bold text-sm",
            style: { borderColor: "#88ccff40", color: "#88ccff" }
          }, "🔮 ORACLE TERMINAL"),
          React.createElement("div", { className: "h-96" },
            React.createElement(OracleTerminal, { consultations })
          )
        ),
        
        React.createElement("div", {
          className: "rounded border",
          style: { borderColor: "#ff448840", background: "rgba(0,0,0,0.4)" }
        },
          React.createElement("div", {
            className: "px-4 py-2 border-b font-bold text-sm",
            style: { borderColor: "#ff448840", color: "#ff4488" }
          }, "🚀 SHIP LOG"),
          React.createElement("div", { className: "h-64 overflow-y-auto" },
            React.createElement(ShipLog, { messages: log })
          )
        ),
        
        React.createElement("div", {
          className: "rounded border",
          style: { borderColor: PALETTE.amber + "40", background: "rgba(0,0,0,0.4)" }
        },
          React.createElement("div", {
            className: "px-4 py-2 border-b font-bold text-sm",
            style: { borderColor: PALETTE.amber + "40", color: PALETTE.amber }
          }, "📊 LIFE SUPPORT"),
          React.createElement("div", { className: "p-4" },
            React.createElement(SystemGauges, { status: sys })
          )
        )
      ),
      
      // Footer
      React.createElement("div", {
        className: "fixed bottom-0 left-0 right-0 border-t px-4 py-2 text-[10px] font-mono",
        style: {
          borderColor: PALETTE.amber + "40",
          background: "rgba(0,0,0,0.95)",
          color: PALETTE.amber + "aa"
        }
      },
        React.createElement("div", { className: "flex justify-between" },
          React.createElement("span", null, "Weyland-Yutani W-4852 / MU/THUR 1800"),
          React.createElement("span", null, "HERMES AGENT // NOSTROMO PROTOCOL"),
          React.createElement("span", null, "ACTIVE NODES: 3")
        )
      )
    )
  );
}

window.__HERMES_PLUGINS__.register("nostromo", NostromoDashboard);
