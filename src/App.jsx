import { useState, useEffect, useRef } from "react";

const theme = {
  bg: "#FFF8F5",
  card: "#FFFFFF",
  primary: "#FF8FAB",
  primaryLight: "#FFD6E0",
  accent: "#FFCBA4",
  accentDeep: "#FF9F6B",
  teal: "#7ECECA",
  tealLight: "#D4F4F4",
  purple: "#C9B8FF",
  purpleLight: "#EDE8FF",
  text: "#2D2D2D",
  textMid: "#6B6B6B",
  textLight: "#A8A8A8",
  border: "#F0E8E4",
  green: "#8ADCB8",
  greenLight: "#D6F5EA",
};

const mockData = {
  growth: [],
  feeding: [],
  poop: [],
};

// WHO growth percentiles (simplified for demo)
const whoData = {
  months: [0,1,2,3,4,5,6,7,8,9,10,11,12],
  height: { p3:[46.1,50.8,54.4,57.3,59.7,61.7,63.3,64.8,66.2,67.5,68.7,69.9,71.0], p50:[49.9,54.7,58.4,61.4,63.9,65.9,67.6,69.2,70.6,72.0,73.3,74.5,75.7], p97:[53.7,58.6,62.4,65.5,68.0,70.1,71.9,73.5,75.0,76.5,77.9,79.2,80.5] },
  weight: { p3:[2.5,3.4,4.3,5.0,5.6,6.1,6.4,6.7,6.9,7.1,7.4,7.6,7.7], p50:[3.3,4.5,5.6,6.4,7.0,7.5,7.9,8.3,8.6,8.9,9.2,9.4,9.6], p97:[4.4,5.8,7.1,8.0,8.7,9.3,9.8,10.3,10.7,11.0,11.4,11.7,12.0] }
};

function VoiceModal({ onClose, onSave }) {
  const [phase, setPhase] = useState("listening"); // listening | processing | done
  const [transcript, setTranscript] = useState("");
  const [parsed, setParsed] = useState(null);
  const [dots, setDots] = useState(0);

  const demoTranscript = "9点20分，宝宝喝奶粉130ml，瓶喂";
  const demoParsed = { module: "喂奶记录", time: "09:20", type: "奶粉", ml: 130, method: "瓶喂" };

  useEffect(() => {
    const dotInterval = setInterval(() => setDots(d => (d + 1) % 4), 400);
    const t1 = setTimeout(() => {
      setTranscript(demoTranscript);
      setPhase("processing");
      clearInterval(dotInterval);
    }, 2500);
    const t2 = setTimeout(() => {
      setParsed(demoParsed);
      setPhase("done");
    }, 4000);
    return () => { clearInterval(dotInterval); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100,
      animation: "fadeIn 0.3s ease"
    }}>
      <div style={{
        background: "#FFFFFF", borderRadius: "28px 28px 0 0", padding: "32px 24px 48px",
        width: "100%", maxWidth: 390, animation: "slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
            🎙️ 小记正在聆听
          </span>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: theme.textLight }}>✕</button>
        </div>

        {phase === "listening" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 20px" }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: `rgba(255,143,171,${0.15 - i*0.04})`,
                  animation: `pulse 1.5s ease-in-out ${i*0.3}s infinite`
                }} />
              ))}
              <div style={{
                position: "absolute", inset: "20px", borderRadius: "50%",
                background: "linear-gradient(135deg, #FF8FAB, #FF6B9D)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, boxShadow: "0 8px 24px rgba(255,143,171,0.5)"
              }}>🎤</div>
            </div>
            <p style={{ color: theme.textMid, fontSize: 15, fontFamily: "'PingFang SC', sans-serif" }}>
              正在聆听{".".repeat(dots + 1)}
            </p>
            <p style={{ color: theme.textLight, fontSize: 13, marginTop: 8, fontFamily: "'PingFang SC', sans-serif" }}>
              请说出您想记录的内容
            </p>
          </div>
        )}

        {(phase === "processing" || phase === "done") && (
          <div style={{
            background: theme.bg, borderRadius: 16, padding: "16px", marginBottom: 20,
            border: `1px solid ${theme.border}`
          }}>
            <p style={{ fontSize: 12, color: theme.textLight, marginBottom: 6, fontFamily: "'PingFang SC', sans-serif" }}>识别内容</p>
            <p style={{ fontSize: 16, color: theme.text, fontWeight: 500, fontFamily: "'PingFang SC', sans-serif", lineHeight: 1.6 }}>
              "{transcript}"
            </p>
          </div>
        )}

        {phase === "processing" && (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ display: "inline-flex", gap: 6 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%", background: theme.primary,
                  animation: `bounce 0.8s ease ${i*0.15}s infinite`
                }} />
              ))}
            </div>
            <p style={{ color: theme.textMid, fontSize: 14, marginTop: 10, fontFamily: "'PingFang SC', sans-serif" }}>AI 正在解析中...</p>
          </div>
        )}

        {phase === "done" && parsed && (
          <>
            <div style={{
              background: "linear-gradient(135deg, #FFD6E0, #FFE8D6)",
              borderRadius: 16, padding: 20, marginBottom: 20,
              border: `1px solid ${theme.primaryLight}`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 20 }}>🍼</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: theme.primary, fontFamily: "'PingFang SC', sans-serif" }}>
                  已解析 → {parsed.module}
                </span>
              </div>
              {[
                ["时间", parsed.time],
                ["奶类型", parsed.type],
                ["毫升数", `${parsed.ml} ml`],
                ["喂养方式", parsed.method],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 14, color: theme.textMid, fontFamily: "'PingFang SC', sans-serif" }}>{k}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={onClose} style={{
                flex: 1, padding: "14px", borderRadius: 14, border: `2px solid ${theme.border}`,
                background: "white", color: theme.textMid, fontSize: 15, fontWeight: 600,
                cursor: "pointer", fontFamily: "'PingFang SC', sans-serif"
              }}>重新录制</button>
              <button onClick={() => { onSave(parsed); onClose(); }} style={{
                flex: 2, padding: "14px", borderRadius: 14, border: "none",
                background: "linear-gradient(135deg, #FF8FAB, #FF6B9D)",
                color: "white", fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "'PingFang SC', sans-serif",
                boxShadow: "0 4px 16px rgba(255,143,171,0.5)"
              }}>✓ 确认保存</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function GrowthChart({ data, type }) {
  const width = 320, height = 180;
  const pad = { top: 20, right: 20, bottom: 30, left: 36 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const field = type === "height" ? "height" : "weight";
  const whoRef = whoData[field];
  const months = whoData.months;

  const minVal = type === "height" ? 45 : 2;
  const maxVal = type === "height" ? 85 : 13;

  const toX = (i) => pad.left + (i / (months.length - 1)) * innerW;
  const toY = (v) => pad.top + innerH - ((v - minVal) / (maxVal - minVal)) * innerH;

  const makePath = (arr) => arr.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ");
  const makeArea = (arr, arr2) => {
    const top = arr.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`).join(" ");
    const bot = [...arr2].reverse().map((v, i) => `L${toX(arr2.length - 1 - i)},${toY(v)}`).join(" ");
    return `${top} ${bot} Z`;
  };

  // user data points: map to approximate months
  const userPoints = data.slice().reverse().map((d, i) => ({
    x: toX(Math.min(i, months.length - 1)),
    y: toY(d[field]),
    val: d[field],
  }));

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ overflow: "visible" }}>
      {/* WHO bands */}
      <path d={makeArea(whoRef.p97, whoRef.p50)} fill="rgba(255,143,171,0.08)" />
      <path d={makeArea(whoRef.p50, whoRef.p3)} fill="rgba(255,143,171,0.12)" />
      {/* WHO lines */}
      {[whoRef.p3, whoRef.p50, whoRef.p97].map((arr, i) => (
        <path key={i} d={makePath(arr)} fill="none" stroke={i === 1 ? "#FF8FAB" : "#FFD6E0"}
          strokeWidth={i === 1 ? 1.5 : 1} strokeDasharray={i === 1 ? "none" : "4,3"} />
      ))}
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map(t => (
        <line key={t} x1={pad.left} x2={width - pad.right}
          y1={pad.top + t * innerH} y2={pad.top + t * innerH}
          stroke="#F0E8E4" strokeWidth={1} />
      ))}
      {/* User data line */}
      {userPoints.length > 1 && (
        <path d={userPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ")}
          fill="none" stroke="#FF6B9D" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {userPoints.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={5} fill="#FF6B9D" stroke="white" strokeWidth={2} />
          <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize={9} fill={theme.textMid} fontFamily="'PingFang SC', sans-serif">
            {p.val}
          </text>
        </g>
      ))}
      {/* Y axis labels */}
      {[minVal, (minVal + maxVal) / 2, maxVal].map(v => (
        <text key={v} x={pad.left - 4} y={toY(v) + 4} textAnchor="end" fontSize={9} fill={theme.textLight} fontFamily="'PingFang SC', sans-serif">
          {v}
        </text>
      ))}
      {/* Legend */}
      <line x1={pad.left + 10} x2={pad.left + 22} y1={height - 8} y2={height - 8} stroke="#FFD6E0" strokeWidth={1} strokeDasharray="3,2" />
      <text x={pad.left + 26} y={height - 5} fontSize={8} fill={theme.textLight} fontFamily="'PingFang SC', sans-serif">WHO标准</text>
      <line x1={pad.left + 80} x2={pad.left + 92} y1={height - 8} y2={height - 8} stroke="#FF6B9D" strokeWidth={2} />
      <text x={pad.left + 96} y={height - 5} fontSize={8} fill={theme.textLight} fontFamily="'PingFang SC', sans-serif">宝宝数据</text>
    </svg>
  );
}

function TabBar({ active, onChange }) {
  const tabs = [
    { id: "home", icon: "🏠", label: "首页" },
    { id: "growth", icon: "📏", label: "成长" },
    { id: "feeding", icon: "🍼", label: "喂奶" },
    { id: "poop", icon: "💩", label: "排便" },
    { id: "schedule", icon: "📅", label: "日程" },
    { id: "mine", icon: "👤", label: "我的" },
  ];
  return (
    <div style={{
      display: "flex", background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(10px)", borderTop: `1px solid ${theme.border}`,
      padding: "8px 0 16px",
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
          border: "none", background: "none", cursor: "pointer", padding: "6px 0",
          transition: "all 0.2s ease"
        }}>
          <div style={{
            fontSize: active === t.id ? 24 : 20,
            transition: "all 0.2s ease",
            filter: active !== t.id ? "grayscale(0.5) opacity(0.5)" : "none",
            transform: active === t.id ? "scale(1.15)" : "scale(1)",
          }}>{t.icon}</div>
          <span style={{
            fontSize: 10, fontWeight: active === t.id ? 700 : 400,
            color: active === t.id ? theme.primary : theme.textLight,
            fontFamily: "'PingFang SC', sans-serif"
          }}>{t.label}</span>
          {active === t.id && (
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: theme.primary }} />
          )}
        </button>
      ))}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: theme.card, borderRadius: 20, padding: "20px",
      boxShadow: "0 2px 16px rgba(0,0,0,0.06)", marginBottom: 16,
      border: `1px solid ${theme.border}`, ...style
    }}>{children}</div>
  );
}

function SectionTitle({ children }) {
  return (
    <p style={{ fontSize: 13, fontWeight: 700, color: theme.textLight, letterSpacing: "0.08em",
      textTransform: "uppercase", marginBottom: 14, fontFamily: "'PingFang SC', sans-serif" }}>
      {children}
    </p>
  );
}

// ── Helper: group records by date ──────────────────────────────────────────
function groupByDate(records, getDate) {
  const map = {};
  records.forEach(r => {
    const d = getDate(r);
    if (!map[d]) map[d] = [];
    map[d].push(r);
  });
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
}

function formatDateLabel(dateStr) {
  const today = "2025-03-06";
  const yesterday = "2025-03-05";
  if (dateStr === today) return "今天";
  if (dateStr === yesterday) return "昨天";
  return dateStr.replace(/-/g, "年").replace(/(\d+)年(\d+)$/, "$1年$2月").replace(/(\d{4})年(\d{2})年(\d{2})/, "$1年$2月$3日");
}

// ── Detail Page: 今日奶量 ───────────────────────────────────────────────────
function FeedingDetailPage({ onBack }) {
  const groups = groupByDate(mockData.feeding, r => r.datetime.split(" ")[0]);
  return (
    <div style={{ padding: "0 16px", paddingBottom: 80 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0 20px" }}>
        <button onClick={onBack} style={{
          border: "none", background: theme.card, borderRadius: 12, width: 36, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>←</button>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
          🍼 喂奶记录
        </h2>
      </div>
      {groups.map(([date, items]) => {
        const total = items.reduce((s, i) => s + i.ml, 0);
        return (
          <div key={date} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 16, borderRadius: 2, background: theme.primary }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
                  {formatDateLabel(date)}
                </span>
              </div>
              <span style={{ fontSize: 12, color: theme.primary, fontWeight: 600, fontFamily: "'PingFang SC', sans-serif",
                background: theme.primaryLight, borderRadius: 8, padding: "3px 10px" }}>
                共 {total}ml · {items.length}次
              </span>
            </div>
            {items.map((item, i) => (
              <div key={item.id} style={{
                background: theme.card, borderRadius: 16, padding: "14px 16px",
                marginBottom: 8, border: `1px solid ${theme.border}`,
                display: "flex", alignItems: "center", gap: 14,
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)"
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 13,
                  background: item.type === "奶粉" ? theme.primaryLight : theme.tealLight,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
                }}>{item.type === "奶粉" ? "🍼" : "🤱"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                    <span style={{ background: item.type === "奶粉" ? theme.primaryLight : theme.tealLight,
                      color: item.type === "奶粉" ? theme.primary : theme.teal,
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                      fontFamily: "'PingFang SC', sans-serif" }}>{item.type}</span>
                    <span style={{ background: theme.bg, color: theme.textMid,
                      fontSize: 11, padding: "2px 8px", borderRadius: 6,
                      fontFamily: "'PingFang SC', sans-serif" }}>{item.method}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
                      {item.ml}<span style={{ fontSize: 12, fontWeight: 400, color: theme.textMid }}> ml</span>
                    </span>
                    <span style={{ fontSize: 12, color: theme.textLight, fontFamily: "'PingFang SC', sans-serif" }}>
                      {item.datetime.split(" ")[1]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Detail Page: 今日排便 ───────────────────────────────────────────────────
function PoopDetailPage({ onBack }) {
  const groups = groupByDate(mockData.poop, r => r.datetime.split(" ")[0]);
  return (
    <div style={{ padding: "0 16px", paddingBottom: 80 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0 20px" }}>
        <button onClick={onBack} style={{
          border: "none", background: theme.card, borderRadius: 12, width: 36, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>←</button>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
          💩 排便记录
        </h2>
      </div>
      {groups.map(([date, items]) => {
        const bigCnt = items.filter(i => i.type === "大便").length;
        const smallCnt = items.filter(i => i.type === "小便").length;
        return (
          <div key={date} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 4, height: 16, borderRadius: 2, background: theme.accentDeep }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
                  {formatDateLabel(date)}
                </span>
              </div>
              <span style={{ fontSize: 12, color: theme.accentDeep, fontWeight: 600, fontFamily: "'PingFang SC', sans-serif",
                background: theme.accentDeep + "18", borderRadius: 8, padding: "3px 10px" }}>
                大便{bigCnt}次 · 小便{smallCnt}次
              </span>
            </div>
            {items.map((item) => {
              const isBig = item.type === "大便";
              return (
                <div key={item.id} style={{
                  background: theme.card, borderRadius: 16, padding: "14px 16px",
                  marginBottom: 8, border: `1px solid ${theme.border}`,
                  display: "flex", alignItems: "center", gap: 14,
                  boxShadow: "0 1px 6px rgba(0,0,0,0.04)"
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 13,
                    background: isBig ? theme.accentDeep + "20" : theme.tealLight,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
                  }}>{isBig ? "💩" : "💧"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 700,
                        color: isBig ? theme.accentDeep : theme.teal,
                        fontFamily: "'PingFang SC', sans-serif" }}>{item.type}</span>
                      <span style={{ fontSize: 12, color: theme.textLight, fontFamily: "'PingFang SC', sans-serif" }}>
                        {item.datetime.split(" ")[1]}
                      </span>
                    </div>
                    {item.state && (
                      <p style={{ fontSize: 12, color: theme.textMid, marginTop: 5,
                        background: theme.bg, borderRadius: 7, padding: "3px 8px", display: "inline-block",
                        fontFamily: "'PingFang SC', sans-serif" }}>{item.state}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ── Detail Page: 身高 ──────────────────────────────────────────────────────
function HeightDetailPage({ onBack }) {
  return (
    <div style={{ padding: "0 16px", paddingBottom: 80 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0 20px" }}>
        <button onClick={onBack} style={{
          border: "none", background: theme.card, borderRadius: 12, width: 36, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>←</button>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
          📏 身高记录
        </h2>
      </div>
      {mockData.growth.map((item, i) => (
        <div key={item.date} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 4, height: 16, borderRadius: 2, background: theme.teal }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
              {item.date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$1年$2月$3日")}
            </span>
            {i === 0 && <span style={{ fontSize: 11, background: theme.tealLight, color: theme.teal,
              borderRadius: 6, padding: "2px 8px", fontWeight: 700, fontFamily: "'PingFang SC', sans-serif" }}>最新</span>}
          </div>
          <div style={{
            background: theme.card, borderRadius: 16, padding: "18px 20px",
            border: `1px solid ${i === 0 ? theme.teal + "44" : theme.border}`,
            display: "flex", alignItems: "center", gap: 16,
            boxShadow: i === 0 ? "0 2px 12px rgba(126,206,202,0.15)" : "0 1px 6px rgba(0,0,0,0.04)"
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: "linear-gradient(135deg, #D4F4F4, #B8EDED)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26
            }}>📏</div>
            <div>
              <p style={{ fontSize: 11, color: theme.textLight, fontFamily: "'PingFang SC', sans-serif", marginBottom: 4 }}>身高</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: theme.teal, fontFamily: "'PingFang SC', sans-serif", lineHeight: 1 }}>
                {item.height}<span style={{ fontSize: 14, fontWeight: 400, color: theme.textMid }}> cm</span>
              </p>
            </div>
            {i > 0 && (
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <p style={{ fontSize: 11, color: theme.textLight, fontFamily: "'PingFang SC', sans-serif" }}>较上次</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: theme.green, fontFamily: "'PingFang SC', sans-serif" }}>
                  +{(mockData.growth[i-1].height - item.height).toFixed(1)}cm
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Detail Page: 体重 ──────────────────────────────────────────────────────
function WeightDetailPage({ onBack }) {
  return (
    <div style={{ padding: "0 16px", paddingBottom: 80 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0 20px" }}>
        <button onClick={onBack} style={{
          border: "none", background: theme.card, borderRadius: 12, width: 36, height: 36,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>←</button>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
          ⚖️ 体重记录
        </h2>
      </div>
      {mockData.growth.map((item, i) => (
        <div key={item.date} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 4, height: 16, borderRadius: 2, background: theme.purple }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
              {item.date.replace(/(\d{4})-(\d{2})-(\d{2})/, "$1年$2月$3日")}
            </span>
            {i === 0 && <span style={{ fontSize: 11, background: theme.purpleLight, color: theme.purple,
              borderRadius: 6, padding: "2px 8px", fontWeight: 700, fontFamily: "'PingFang SC', sans-serif" }}>最新</span>}
          </div>
          <div style={{
            background: theme.card, borderRadius: 16, padding: "18px 20px",
            border: `1px solid ${i === 0 ? theme.purple + "44" : theme.border}`,
            display: "flex", alignItems: "center", gap: 16,
            boxShadow: i === 0 ? "0 2px 12px rgba(201,184,255,0.18)" : "0 1px 6px rgba(0,0,0,0.04)"
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: "linear-gradient(135deg, #EDE8FF, #DDD4FF)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26
            }}>⚖️</div>
            <div>
              <p style={{ fontSize: 11, color: theme.textLight, fontFamily: "'PingFang SC', sans-serif", marginBottom: 4 }}>体重</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: theme.purple, fontFamily: "'PingFang SC', sans-serif", lineHeight: 1 }}>
                {item.weight}<span style={{ fontSize: 14, fontWeight: 400, color: theme.textMid }}> kg</span>
              </p>
            </div>
            {i > 0 && (
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <p style={{ fontSize: 11, color: theme.textLight, fontFamily: "'PingFang SC', sans-serif" }}>较上次</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: theme.green, fontFamily: "'PingFang SC', sans-serif" }}>
                  +{(mockData.growth[i-1].weight - item.weight).toFixed(1)}kg
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}


function EmptyState({ emoji, title, subtitle, btnText, onBtn }) {
  return (
    <div style={{
      textAlign: "center", padding: "48px 24px",
      background: "white", borderRadius: 20,
      border: "1.5px dashed #F0E8E4",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
    }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>{emoji}</div>
      <p style={{ fontSize: 16, fontWeight: 700, color: "#2D2D2D", fontFamily: "'PingFang SC', sans-serif", marginBottom: 8 }}>{title}</p>
      <p style={{ fontSize: 13, color: "#A8A8A8", fontFamily: "'PingFang SC', sans-serif", lineHeight: 1.6, marginBottom: onBtn ? 20 : 0 }}>{subtitle}</p>
      {onBtn && (
        <button onClick={onBtn} style={{
          background: "linear-gradient(135deg, #FF8FAB, #FF6B9D)", border: "none",
          borderRadius: 50, padding: "12px 28px", color: "white",
          fontSize: 14, fontWeight: 700, cursor: "pointer",
          fontFamily: "'PingFang SC', sans-serif",
          boxShadow: "0 4px 14px rgba(255,143,171,0.4)"
        }}>{btnText}</button>
      )}
    </div>
  );
}

// ── HomeTab ────────────────────────────────────────────────────────────────
function HomeTab({ onVoice, onDetail }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayFeeding = mockData.feeding.filter(f => f.datetime.startsWith(today));
  const totalMl = todayFeeding.reduce((s, f) => s + f.ml, 0);
  const todayPoop = mockData.poop.filter(p => p.datetime.startsWith(today));
  const bigCount = todayPoop.filter(p => p.type === "大便").length;
  const smallCount = todayPoop.filter(p => p.type === "小便").length;
  const lastGrowth = mockData.growth[0];
  const hasAnyData = mockData.feeding.length > 0 || mockData.poop.length > 0 || mockData.growth.length > 0;

  const now = new Date();
  const dateStr = now.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

  const statCards = [
    { id: "feeding", icon: "🍼", label: "今日奶量", val: totalMl > 0 ? `${totalMl}ml` : "暂无记录", sub: totalMl > 0 ? `共${todayFeeding.length}次` : "点击去记录", color: theme.primaryLight, accent: theme.primary },
    { id: "poop",    icon: "💩", label: "今日排便", val: (bigCount + smallCount) > 0 ? `${bigCount}次大便` : "暂无记录", sub: (bigCount + smallCount) > 0 ? `${smallCount}次小便` : "点击去记录", color: theme.accentDeep + "22", accent: theme.accentDeep },
    { id: "height",  icon: "📏", label: "最新身高", val: lastGrowth ? `${lastGrowth.height}cm` : "未记录", sub: lastGrowth ? lastGrowth.date.slice(5) + "测量" : "点击去记录", color: theme.tealLight, accent: theme.teal },
    { id: "weight",  icon: "⚖️", label: "最新体重", val: lastGrowth ? `${lastGrowth.weight}kg` : "未记录", sub: lastGrowth ? lastGrowth.date.slice(5) + "测量" : "点击去记录", color: theme.purpleLight, accent: theme.purple },
  ];

  return (
    <div style={{ padding: "0 16px", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 20px" }}>
        <div>
          <p style={{ fontSize: 13, color: theme.textLight, fontFamily: "'PingFang SC', sans-serif" }}>
            {dateStr}
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: theme.text, margin: "4px 0 0",
            fontFamily: "'PingFang SC', sans-serif", lineHeight: 1.2 }}>
            {hasAnyData ? "宝宝今天" : "你好 👋"}<br/>
            <span style={{ color: theme.primary }}>{hasAnyData ? "记录了成长 ✨" : "开始记录宝宝成长吧"}</span>
          </h1>
        </div>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #FFD6E0, #FFB3C6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, boxShadow: "0 4px 12px rgba(255,143,171,0.3)"
        }}>👶</div>
      </div>

      {/* Voice button */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <button onClick={onVoice} style={{
          background: "linear-gradient(145deg, #FF8FAB, #FF5C8D)",
          borderRadius: 50, padding: "16px 40px",
          display: "inline-flex", alignItems: "center", gap: 10,
          border: "none", cursor: "pointer",
          boxShadow: "0 6px 20px rgba(255,92,141,0.45), 0 2px 6px rgba(255,92,141,0.25)",
          transition: "transform 0.15s ease", userSelect: "none", outline: "none",
        }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          onTouchStart={e => e.currentTarget.style.transform = "scale(0.95)"}
          onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <span style={{ fontSize: 20 }}>🎤</span>
          <span style={{ color: "white", fontWeight: 800, fontSize: 17,
            fontFamily: "'PingFang SC', sans-serif", letterSpacing: "0.02em" }}>点我记录</span>
        </button>
      </div>

      {/* Today stats — clickable */}
      <SectionTitle>今日汇总</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {statCards.map(item => (
          <div key={item.label} onClick={() => onDetail(item.id)}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.96)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
            onTouchStart={e => e.currentTarget.style.transform = "scale(0.96)"}
            onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
            style={{
              background: item.color, borderRadius: 18, padding: "16px",
              border: `1px solid ${item.accent}33`, cursor: "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              position: "relative"
            }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{item.icon}</div>
            <p style={{ fontSize: 11, color: theme.textMid, fontFamily: "'PingFang SC', sans-serif", marginBottom: 4 }}>{item.label}</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>{item.val}</p>
            <p style={{ fontSize: 11, color: theme.textLight, fontFamily: "'PingFang SC', sans-serif" }}>{item.sub}</p>
            {/* Arrow indicator */}
            <div style={{
              position: "absolute", top: 14, right: 14, fontSize: 12,
              color: item.accent, opacity: 0.7
            }}>›</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <SectionTitle>最近记录</SectionTitle>
      {(() => {
        const recentAll = [
          ...mockData.feeding.map(f => ({ ...f, _type: "feeding" })),
          ...mockData.poop.map(p => ({ ...p, _type: "poop" }))
        ].sort((a, b) => b.datetime.localeCompare(a.datetime)).slice(0, 3);

        if (recentAll.length === 0) {
          return (
            <EmptyState
              emoji="📝"
              title="还没有任何记录"
              subtitle={"点击上方「点我记录」语音录入\n或前往各功能页手动添加"}
              btnText="语音记录"
              onBtn={onVoice}
            />
          );
        }
        return (
          <Card>
            {recentAll.map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0", borderBottom: i < recentAll.length - 1 ? `1px solid ${theme.border}` : "none"
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: item._type === "feeding" ? theme.primaryLight : theme.accentDeep + "22",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
                }}>
                  {item._type === "feeding" ? "🍼" : item.type === "大便" ? "💩" : "💧"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
                    {item._type === "feeding" ? `${item.type} ${item.ml}ml · ${item.method}` : `${item.type}${item.state ? " · " + item.state : ""}`}
                  </p>
                  <p style={{ fontSize: 11, color: theme.textLight, fontFamily: "'PingFang SC', sans-serif" }}>
                    {item.datetime.split(" ")[1]}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        );
      })()}
    </div>
  );
}

function GrowthTab() {
  const [chartType, setChartType] = useState("height");
  return (
    <div style={{ padding: "0 16px", paddingBottom: 80 }}>
      <div style={{ padding: "16px 0 20px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
          📏 成长记录
        </h2>
      </div>

      {/* Chart toggle */}
      <Card>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["height", "weight"].map(t => (
            <button key={t} onClick={() => setChartType(t)} style={{
              flex: 1, padding: "10px", borderRadius: 12,
              border: "none", cursor: "pointer", fontFamily: "'PingFang SC', sans-serif",
              fontWeight: 700, fontSize: 13,
              background: chartType === t ? "linear-gradient(135deg, #FF8FAB, #FF6B9D)" : theme.bg,
              color: chartType === t ? "white" : theme.textMid,
              transition: "all 0.2s ease",
              boxShadow: chartType === t ? "0 4px 12px rgba(255,143,171,0.4)" : "none"
            }}>{t === "height" ? "📏 身高曲线" : "⚖️ 体重曲线"}</button>
          ))}
        </div>
        {mockData.growth.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: theme.textLight, fontFamily: "'PingFang SC', sans-serif" }}>
            <p style={{ fontSize: 32, marginBottom: 8 }}>📈</p>
            <p style={{ fontSize: 13 }}>添加记录后，这里将显示成长曲线</p>
          </div>
        ) : (
          <GrowthChart data={mockData.growth} type={chartType} />
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {["P3", "P50中位", "P97"].map((l, i) => (
            <div key={l} style={{
              background: i === 1 ? theme.primaryLight : theme.bg,
              borderRadius: 8, padding: "4px 10px", fontSize: 10, color: theme.textMid,
              fontFamily: "'PingFang SC', sans-serif", border: `1px solid ${theme.border}`
            }}>WHO {l}</div>
          ))}
        </div>
      </Card>

      {/* Records list */}
      <SectionTitle>历史记录</SectionTitle>
      {mockData.growth.length === 0 ? (
        <EmptyState emoji="📏" title="还没有成长记录" subtitle="记录宝宝的身高和体重，生成专属成长曲线" />
      ) : (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
            background: theme.bg, padding: "12px 20px",
            borderBottom: `1px solid ${theme.border}`
          }}>
            {["日期", "身高(cm)", "体重(kg)", ""].map((h, i) => (
              <p key={i} style={{ fontSize: 11, fontWeight: 700, color: theme.textLight,
                fontFamily: "'PingFang SC', sans-serif", textAlign: i > 0 ? "center" : "left" }}>{h}</p>
            ))}
          </div>
          {mockData.growth.map((item, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr",
              padding: "14px 20px", borderBottom: i < mockData.growth.length - 1 ? `1px solid ${theme.border}` : "none",
              alignItems: "center"
            }}>
              <p style={{ fontSize: 13, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
                {item.date.slice(5)}
              </p>
              <p style={{ fontSize: 14, fontWeight: 700, color: theme.teal, textAlign: "center",
                fontFamily: "'PingFang SC', sans-serif" }}>{item.height}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: theme.purple, textAlign: "center",
                fontFamily: "'PingFang SC', sans-serif" }}>{item.weight}</p>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: theme.green }} />
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function FeedingTab() {
  const today = new Date().toISOString().slice(0, 10);
  const todayFeeding = mockData.feeding.filter(f => f.datetime.startsWith(today));
  const totalMl = todayFeeding.reduce((s, f) => s + f.ml, 0);

  return (
    <div style={{ padding: "0 16px", paddingBottom: 80 }}>
      <div style={{ padding: "16px 0 20px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
          🍼 喂奶记录
        </h2>
      </div>

      {/* Today summary */}
      <div style={{
        background: "linear-gradient(135deg, #FFD6E0, #FFE8D6)",
        borderRadius: 20, padding: "20px", marginBottom: 20,
        border: `1px solid ${theme.primaryLight}`
      }}>
        <p style={{ fontSize: 12, color: theme.textMid, fontFamily: "'PingFang SC', sans-serif", marginBottom: 8 }}>
          今日 · {new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric" })}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ fontSize: 36, fontWeight: 800, color: theme.primary, fontFamily: "'PingFang SC', sans-serif", lineHeight: 1 }}>
              {totalMl}<span style={{ fontSize: 16, fontWeight: 500, marginLeft: 4 }}>ml</span>
            </p>
            <p style={{ fontSize: 13, color: theme.textMid, fontFamily: "'PingFang SC', sans-serif", marginTop: 6 }}>
              今日已摄入总奶量
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: theme.accentDeep, fontFamily: "'PingFang SC', sans-serif" }}>
              {todayFeeding.length}次
            </p>
            <p style={{ fontSize: 12, color: theme.textMid, fontFamily: "'PingFang SC', sans-serif" }}>
              已喂养
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 16, background: "rgba(255,255,255,0.5)", borderRadius: 8, height: 8, overflow: "hidden" }}>
          <div style={{
            width: `${Math.min((totalMl / 800) * 100, 100)}%`, height: "100%",
            background: "linear-gradient(90deg, #FF8FAB, #FF6B9D)", borderRadius: 8,
            transition: "width 0.5s ease"
          }} />
        </div>
        <p style={{ fontSize: 11, color: theme.textLight, marginTop: 6, fontFamily: "'PingFang SC', sans-serif" }}>
          建议日摄入量 800ml
        </p>
      </div>

      {/* Records */}
      <SectionTitle>喂奶记录</SectionTitle>
      {mockData.feeding.length === 0 ? (
        <EmptyState emoji="🍼" title="还没有喂奶记录" subtitle={"点击首页「点我记录」语音录入\n例如：9点20分宝宝喝奶粉130ml"} />
      ) : (
        mockData.feeding.map((item, i) => {
          const isToday = item.datetime.startsWith(today);
          const todayLabel = new Date().toISOString().slice(0, 10);
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          return (
            <div key={item.id} style={{
              background: theme.card, borderRadius: 16, padding: "16px",
              marginBottom: 10, border: `1px solid ${isToday ? theme.primaryLight : theme.border}`,
              boxShadow: isToday ? "0 2px 12px rgba(255,143,171,0.12)" : "0 1px 6px rgba(0,0,0,0.04)",
              display: "flex", alignItems: "center", gap: 14
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: item.type === "奶粉" ? theme.primaryLight : theme.tealLight,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
              }}>
                {item.type === "奶粉" ? "🍼" : "🤱"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{
                    background: item.type === "奶粉" ? theme.primaryLight : theme.tealLight,
                    color: item.type === "奶粉" ? theme.primary : theme.teal,
                    fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                    fontFamily: "'PingFang SC', sans-serif"
                  }}>{item.type}</span>
                  <span style={{
                    background: theme.bg, color: theme.textMid,
                    fontSize: 11, padding: "2px 8px", borderRadius: 6,
                    fontFamily: "'PingFang SC', sans-serif"
                  }}>{item.method}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: 22, fontWeight: 800, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
                    {item.ml}<span style={{ fontSize: 13, fontWeight: 400, color: theme.textMid }}> ml</span>
                  </p>
                  <p style={{ fontSize: 12, color: isToday ? theme.primary : theme.textLight,
                    fontFamily: "'PingFang SC', sans-serif", fontWeight: isToday ? 600 : 400 }}>
                    {item.datetime.replace(todayLabel, "今天").replace(yesterday, "昨天")}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function PoopTab() {
  const today = new Date().toISOString().slice(0, 10);
  const todayPoop = mockData.poop.filter(p => p.datetime.startsWith(today));
  const bigCount = todayPoop.filter(p => p.type === "大便").length;
  const smallCount = todayPoop.filter(p => p.type === "小便").length;

  return (
    <div style={{ padding: "0 16px", paddingBottom: 80 }}>
      <div style={{ padding: "16px 0 20px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
          💩 排便记录
        </h2>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        <div style={{
          background: "linear-gradient(135deg, #FFE8D6, #FFDAC9)", borderRadius: 20, padding: 20,
          border: `1px solid ${theme.accent}44`
        }}>
          <p style={{ fontSize: 28 }}>💩</p>
          <p style={{ fontSize: 34, fontWeight: 800, color: theme.accentDeep, fontFamily: "'PingFang SC', sans-serif", lineHeight: 1 }}>
            {bigCount}<span style={{ fontSize: 15, fontWeight: 400 }}>次</span>
          </p>
          <p style={{ fontSize: 12, color: theme.textMid, fontFamily: "'PingFang SC', sans-serif", marginTop: 4 }}>今日大便</p>
        </div>
        <div style={{
          background: "linear-gradient(135deg, #D4F4F4, #C2EEEE)", borderRadius: 20, padding: 20,
          border: `1px solid ${theme.teal}44`
        }}>
          <p style={{ fontSize: 28 }}>💧</p>
          <p style={{ fontSize: 34, fontWeight: 800, color: theme.teal, fontFamily: "'PingFang SC', sans-serif", lineHeight: 1 }}>
            {smallCount}<span style={{ fontSize: 15, fontWeight: 400 }}>次</span>
          </p>
          <p style={{ fontSize: 12, color: theme.textMid, fontFamily: "'PingFang SC', sans-serif", marginTop: 4 }}>今日小便</p>
        </div>
      </div>

      {/* Records */}
      <SectionTitle>排便记录</SectionTitle>
      {mockData.poop.length === 0 ? (
        <EmptyState emoji="💩" title="还没有排便记录" subtitle={"点击首页「点我记录」语音录入\n例如：宝宝刚刚大便了，黄色糊状"} />
      ) : (
        mockData.poop.map((item, i) => {
          const isToday = item.datetime.startsWith(today);
          const isBig = item.type === "大便";
          const todayLabel = new Date().toISOString().slice(0, 10);
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          return (
            <div key={item.id} style={{
              background: theme.card, borderRadius: 16, padding: "16px",
              marginBottom: 10, border: `1px solid ${isToday ? (isBig ? theme.accent : theme.teal) + "44" : theme.border}`,
              display: "flex", alignItems: "center", gap: 14
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: isBig ? theme.accentDeep + "22" : theme.tealLight,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22
              }}>
                {isBig ? "💩" : "💧"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "center" }}>
                  <span style={{
                    fontSize: 14, fontWeight: 700, color: isBig ? theme.accentDeep : theme.teal,
                    fontFamily: "'PingFang SC', sans-serif"
                  }}>{item.type}</span>
                  <p style={{ fontSize: 12, color: isToday ? theme.primary : theme.textLight,
                    fontFamily: "'PingFang SC', sans-serif", fontWeight: isToday ? 600 : 400 }}>
                    {item.datetime.replace(todayLabel, "今天").replace(yesterday, "昨天")}
                  </p>
                </div>
                {item.state && (
                  <p style={{ fontSize: 13, color: theme.textMid, fontFamily: "'PingFang SC', sans-serif",
                    background: theme.bg, borderRadius: 8, padding: "4px 8px", display: "inline-block" }}>
                    {item.state}
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

const defaultSchedule = [
  { id: 1, time: "8:00-8:15",   label: "E",   content: "吃第1顿饭【160ml】" },
  { id: 2, time: "8:15-10:00",  label: "A",   content: "晨间护理【15分钟】换尿不湿/洗脸/AD、D3/滴眼药水/修剪指甲" },
  { id: 3, time: "8:15-10:00",  label: "A",   content: "追视追听【10分钟】黑白卡/小沙锤" },
  { id: 4, time: "8:15-10:00",  label: "A",   content: "大运动&自主玩耍【30分钟】健身架/氦气球" },
  { id: 5, time: "8:15-10:00",  label: "A",   content: "大运动【20分钟】趴/抬头" },
  { id: 6, time: "8:15-10:00",  label: "A",   content: "被动操【15分钟】扩胸运动等" },
  { id: 7, time: "8:15-10:00",  label: "A",   content: "亲子互动【15-30分钟】聊天/发呆" },
  { id: 8, time: "10:00-11:00", label: "S&Y", content: "上午的小觉【60分钟】" },
  { id: 9, time: "11:00-11:15", label: "E",   content: "吃第2顿饭【160ml】" },
  { id: 10, time: "11:15-12:00",label: "A",   content: "午间护理【10分钟】换尿不湿/滴眼药水" },
  { id: 11, time: "11:15-12:00",label: "A",   content: "精细运动【15分钟】被动抓握/捏布书/奥波球" },
  { id: 12, time: "11:15-12:00",label: "A",   content: "户外【20分钟】小区遛弯" },
  { id: 13, time: "12:00-14:00",label: "S&Y", content: "中午的小觉【90-120分钟】" },
  { id: 14, time: "14:00-14:15",label: "E",   content: "吃第3顿饭【160ml】" },
  { id: 15, time: "14:15-16:00",label: "A",   content: "午间护理【10分钟】换尿不湿/滴眼药水" },
  { id: 16, time: "14:15-16:00",label: "A",   content: "户外【30分钟】小区遛弯" },
  { id: 17, time: "14:15-16:00",label: "A",   content: "认知能力【15分钟】照镜子/视觉、听觉感官瓶" },
  { id: 18, time: "14:15-16:00",label: "A",   content: "大运动【10分钟】竖抱够家具" },
  { id: 19, time: "14:15-16:00",label: "A",   content: "被动操【15分钟】扩胸运动等" },
  { id: 20, time: "14:15-16:00",label: "A",   content: "大运动【15分钟】趴/抬头/翻身" },
  { id: 21, time: "16:00-17:00",label: "S&Y", content: "下午的小觉【60分钟】" },
  { id: 22, time: "17:00-17:15",label: "E",   content: "吃第4顿饭【160ml】" },
  { id: 23, time: "17:15-19:00",label: "A",   content: "晚间护理【10分钟】换尿不湿/滴眼药水" },
  { id: 24, time: "17:15-19:00",label: "A",   content: "语言启蒙【30分钟】双语读绘本" },
  { id: 25, time: "17:15-19:00",label: "A",   content: "语言启蒙【5分钟】唱儿歌" },
  { id: 26, time: "17:15-19:00",label: "A",   content: "亲子互动【10分钟】手指舞" },
  { id: 27, time: "17:15-19:00",label: "A",   content: "大运动&自主玩耍【30分钟】健身架/氦气球" },
  { id: 28, time: "17:15-19:00",label: "A",   content: "内耳前庭训练【5分钟】升降机/拖拉机" },
  { id: 29, time: "19:00-19:20",label: "S&Y", content: "晚间短时间休息【20分钟】发呆" },
  { id: 30, time: "19:00-19:45",label: "A",   content: "睡前消耗【15分钟】洗澡/游泳" },
  { id: 31, time: "19:00-19:45",label: "A",   content: "睡前护理【15分钟】洗脸/做抚触" },
  { id: 32, time: "19:00-19:45",label: "A",   content: "睡前仪式【5分钟】关灯/穿睡袋/听音乐床铃" },
  { id: 33, time: "19:45-20:00",label: "E",   content: "吃第5顿饭【180ml】" },
  { id: 34, time: "20:00-8:00", label: "S&Y", content: "睡整夜觉" },
];

const labelColor = (label) => {
  if (label === "E") return { bg: "#FFD6E0", color: "#FF6B9D", border: "#FFACC7" };
  if (label === "S&Y") return { bg: "#EDE8FF", color: "#9B8AE8", border: "#C9B8FF" };
  return { bg: "#D6F5EA", color: "#3BAE7A", border: "#8ADCB8" };
};

function ScheduleTab() {
  const [items, setItems] = useState(defaultSchedule.map(i => ({ ...i, done: false })));
  const [editingId, setEditingId] = useState(null);
  const [editTime, setEditTime] = useState("");
  const [editContent, setEditContent] = useState("");
  const [addMode, setAddMode] = useState(false);
  const [newTime, setNewTime] = useState("");
  const [newContent, setNewContent] = useState("");
  const [sortMode, setSortMode] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [touchDragId, setTouchDragId] = useState(null);
  const [touchDragOverId, setTouchDragOverId] = useState(null);
  const itemRefs = useRef({});

  const doneCount = items.filter(i => i.done).length;

  const toggleDone = (id) => {
    if (sortMode) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditTime(item.time);
    setEditContent(item.content);
  };

  const saveEdit = () => {
    setItems(prev => prev.map(i => i.id === editingId ? { ...i, time: editTime, content: editContent } : i));
    setEditingId(null);
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const addItem = () => {
    if (!newTime.trim() || !newContent.trim()) return;
    const newId = Date.now();
    const newEntry = { id: newId, time: newTime, label: "A", content: newContent, done: false };
    setItems(prev => {
      const lastIdx = prev.map(i => i.time).lastIndexOf(newTime);
      if (lastIdx >= 0) {
        const next = [...prev];
        next.splice(lastIdx + 1, 0, newEntry);
        return next;
      }
      return [...prev, newEntry];
    });
    setNewTime(""); setNewContent(""); setAddMode(false);
  };

  const moveItem = (id, dir) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (dir === "up" && idx === 0) return prev;
      if (dir === "down" && idx === prev.length - 1) return prev;
      const next = [...prev];
      const swap = dir === "up" ? idx - 1 : idx + 1;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  };

  // Drag-and-drop handlers
  const onDragStart = (e, id) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e, id) => {
    e.preventDefault();
    setDragOverId(id);
  };
  const onDrop = (e, targetId) => {
    e.preventDefault();
    if (dragId === targetId) { setDragId(null); setDragOverId(null); return; }
    setItems(prev => {
      const from = prev.findIndex(i => i.id === dragId);
      const to = prev.findIndex(i => i.id === targetId);
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDragId(null); setDragOverId(null);
  };
  const onDragEnd = () => { setDragId(null); setDragOverId(null); };

  // Touch drag handlers
  const onTouchStart = (e, id) => {
    setTouchDragId(id);
  };
  const onTouchMove = (e) => {
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!el) return;
    const card = el.closest("[data-sortid]");
    if (card) setTouchDragOverId(parseInt(card.dataset.sortid));
  };
  const onTouchEnd = () => {
    if (touchDragId && touchDragOverId && touchDragId !== touchDragOverId) {
      setItems(prev => {
        const from = prev.findIndex(i => i.id === touchDragId);
        const to = prev.findIndex(i => i.id === touchDragOverId);
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      });
    }
    setTouchDragId(null); setTouchDragOverId(null);
  };

  const inputStyle = {
    width: "100%", border: `1.5px solid ${theme.primary}`, borderRadius: 10,
    padding: "8px 12px", fontSize: 13, fontFamily: "'PingFang SC', sans-serif",
    color: theme.text, background: "white", outline: "none", marginBottom: 8
  };

  return (
    <div style={{ padding: "0 16px", paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ padding: "16px 0 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
            📅 每日日程
          </h2>
          <p style={{ fontSize: 12, color: theme.textLight, fontFamily: "'PingFang SC', sans-serif", marginTop: 3 }}>
            4-5月龄宝宝作息表
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { setSortMode(s => !s); setEditingId(null); setAddMode(false); }} style={{
            background: sortMode ? "linear-gradient(135deg, #8ADCB8, #5CC99A)" : theme.bg,
            border: `1.5px solid ${sortMode ? theme.green : theme.border}`,
            borderRadius: 14, padding: "8px 12px", color: sortMode ? "white" : theme.textMid,
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'PingFang SC', sans-serif",
            boxShadow: sortMode ? "0 3px 10px rgba(90,200,154,0.35)" : "none",
            transition: "all 0.2s ease"
          }}>{sortMode ? "✓ 完成" : "⇅ 排序"}</button>
          {!sortMode && (
            <button onClick={() => setAddMode(true)} style={{
              background: "linear-gradient(135deg, #FF8FAB, #FF6B9D)", border: "none",
              borderRadius: 14, padding: "8px 14px", color: "white", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "'PingFang SC', sans-serif",
              boxShadow: "0 3px 10px rgba(255,143,171,0.4)"
            }}>+ 添加</button>
          )}
        </div>
      </div>

      {/* Sort mode tip */}
      {sortMode && (
        <div style={{
          background: "linear-gradient(135deg, #D6F5EA, #C2F0DF)", borderRadius: 14,
          padding: "10px 14px", marginBottom: 12,
          border: `1px solid ${theme.green}55`,
          display: "flex", alignItems: "center", gap: 8
        }}>
          <span style={{ fontSize: 16 }}>↕️</span>
          <p style={{ fontSize: 12, color: "#3BAE7A", fontFamily: "'PingFang SC', sans-serif", fontWeight: 600 }}>
            拖拽卡片调整顺序，或点击 ↑ ↓ 按钮上下移动。完成后点击「✓ 完成」保存顺序。
          </p>
        </div>
      )}

      {/* Progress */}
      {!sortMode && (
        <div style={{
          background: "white", borderRadius: 16, padding: "14px 16px", marginBottom: 16,
          border: `1px solid ${theme.border}`, boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.text, fontFamily: "'PingFang SC', sans-serif" }}>
              今日完成进度
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: theme.primary, fontFamily: "'PingFang SC', sans-serif" }}>
              {doneCount} / {items.length}
            </span>
          </div>
          <div style={{ background: theme.bg, borderRadius: 8, height: 8, overflow: "hidden" }}>
            <div style={{
              width: `${items.length ? (doneCount / items.length) * 100 : 0}%`,
              height: "100%", background: "linear-gradient(90deg, #FF8FAB, #FF6B9D)",
              borderRadius: 8, transition: "width 0.4s ease"
            }} />
          </div>
        </div>
      )}

      {/* Add new item */}
      {addMode && !sortMode && (
        <div style={{
          background: "white", borderRadius: 16, padding: 16, marginBottom: 14,
          border: `2px solid ${theme.primary}`, boxShadow: "0 4px 16px rgba(255,143,171,0.15)"
        }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: theme.primary, marginBottom: 10, fontFamily: "'PingFang SC', sans-serif" }}>
            ✏️ 新增日程
          </p>
          <input value={newTime} onChange={e => setNewTime(e.target.value)}
            placeholder="时间，如 9:00-9:30" style={inputStyle} />
          <textarea value={newContent} onChange={e => setNewContent(e.target.value)}
            placeholder="日程内容" rows={2} style={{ ...inputStyle, resize: "none" }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setAddMode(false)} style={{
              flex: 1, padding: "10px", borderRadius: 10, border: `1.5px solid ${theme.border}`,
              background: "white", color: theme.textMid, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "'PingFang SC', sans-serif"
            }}>取消</button>
            <button onClick={addItem} style={{
              flex: 2, padding: "10px", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg, #FF8FAB, #FF6B9D)",
              color: "white", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "'PingFang SC', sans-serif"
            }}>保存</button>
          </div>
        </div>
      )}

      {/* Schedule list — flat in sort mode, grouped otherwise */}
      {sortMode ? (
        // ── SORT MODE: flat list with drag handles ──
        <div>
          {items.map((item, idx) => {
            const lc = labelColor(item.label);
            const isDragging = dragId === item.id || touchDragId === item.id;
            const isOver = dragOverId === item.id || touchDragOverId === item.id;
            return (
              <div
                key={item.id}
                data-sortid={item.id}
                draggable
                onDragStart={e => onDragStart(e, item.id)}
                onDragOver={e => onDragOver(e, item.id)}
                onDrop={e => onDrop(e, item.id)}
                onDragEnd={onDragEnd}
                onTouchStart={e => onTouchStart(e, item.id)}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{
                  background: isDragging ? "#FFF0F6" : isOver ? "#FFF8FC" : "white",
                  borderRadius: 14, padding: "10px 12px", marginBottom: 6,
                  border: `1.5px solid ${isDragging ? theme.primary : isOver ? theme.primaryLight : theme.border}`,
                  boxShadow: isDragging ? "0 6px 20px rgba(255,143,171,0.25)" : "0 1px 4px rgba(0,0,0,0.04)",
                  display: "flex", alignItems: "center", gap: 10,
                  cursor: "grab", transition: "all 0.15s ease",
                  opacity: isDragging ? 0.7 : 1,
                  userSelect: "none",
                  transform: isDragging ? "scale(1.02)" : "scale(1)",
                }}
              >
                {/* Drag handle */}
                <div style={{
                  display: "flex", flexDirection: "column", gap: 3, flexShrink: 0,
                  padding: "4px 2px", cursor: "grab"
                }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ display: "flex", gap: 3 }}>
                      <div style={{ width: 3, height: 3, borderRadius: "50%", background: theme.textLight }} />
                      <div style={{ width: 3, height: 3, borderRadius: "50%", background: theme.textLight }} />
                    </div>
                  ))}
                </div>

                {/* Label */}
                <div style={{
                  background: lc.bg, color: lc.color, border: `1px solid ${lc.border}`,
                  borderRadius: 7, padding: "2px 7px", fontSize: 10, fontWeight: 800,
                  fontFamily: "'PingFang SC', sans-serif", flexShrink: 0,
                }}>{item.label}</div>

                {/* Time + content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 10, color: theme.textLight, fontFamily: "'PingFang SC', sans-serif", marginBottom: 2 }}>
                    {item.time}
                  </p>
                  <p style={{
                    fontSize: 12, color: theme.text, fontFamily: "'PingFang SC', sans-serif",
                    lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis",
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical"
                  }}>{item.content}</p>
                </div>

                {/* Up / Down buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
                  <button onClick={() => moveItem(item.id, "up")} disabled={idx === 0} style={{
                    border: "none", background: idx === 0 ? theme.bg : theme.primaryLight,
                    borderRadius: 7, width: 26, height: 26,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: idx === 0 ? "default" : "pointer", fontSize: 13,
                    color: idx === 0 ? theme.textLight : theme.primary,
                    fontWeight: 700, transition: "all 0.15s ease"
                  }}>↑</button>
                  <button onClick={() => moveItem(item.id, "down")} disabled={idx === items.length - 1} style={{
                    border: "none", background: idx === items.length - 1 ? theme.bg : theme.primaryLight,
                    borderRadius: 7, width: 26, height: 26,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: idx === items.length - 1 ? "default" : "pointer", fontSize: 13,
                    color: idx === items.length - 1 ? theme.textLight : theme.primary,
                    fontWeight: 700, transition: "all 0.15s ease"
                  }}>↓</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // ── NORMAL MODE: grouped by time, with checkbox / edit / delete ──
        (() => {
          const timeGroups = items.reduce((acc, item) => {
            if (!acc[item.time]) acc[item.time] = [];
            acc[item.time].push(item);
            return acc;
          }, {});
          // preserve original insertion order for times
          const seenTimes = [];
          items.forEach(i => { if (!seenTimes.includes(i.time)) seenTimes.push(i.time); });

          return seenTimes.map((time) => (
            <div key={time} style={{ marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, marginTop: 10 }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: theme.primary, flexShrink: 0 }} />
                <span style={{
                  fontSize: 12, fontWeight: 700, color: theme.textMid,
                  fontFamily: "'PingFang SC', sans-serif", letterSpacing: "0.02em"
                }}>{time}</span>
                <div style={{ flex: 1, height: 1, background: theme.border }} />
              </div>

              {timeGroups[time].map(item => {
                const lc = labelColor(item.label);
                const isEditing = editingId === item.id;
                return (
                  <div key={item.id} style={{
                    background: item.done ? "#FAFAFA" : "white",
                    borderRadius: 14, padding: "12px 14px", marginBottom: 6,
                    border: `1px solid ${item.done ? theme.border : isEditing ? theme.primary : theme.border}`,
                    boxShadow: item.done ? "none" : "0 1px 6px rgba(0,0,0,0.04)",
                    transition: "all 0.2s ease"
                  }}>
                    {isEditing ? (
                      <div>
                        <input value={editTime} onChange={e => setEditTime(e.target.value)}
                          style={{ ...inputStyle, marginBottom: 6 }} placeholder="时间" />
                        <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                          rows={2} style={{ ...inputStyle, resize: "none" }} placeholder="内容" />
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => setEditingId(null)} style={{
                            flex: 1, padding: "8px", borderRadius: 9, border: `1.5px solid ${theme.border}`,
                            background: "white", color: theme.textMid, fontSize: 12, fontWeight: 600,
                            cursor: "pointer", fontFamily: "'PingFang SC', sans-serif"
                          }}>取消</button>
                          <button onClick={saveEdit} style={{
                            flex: 2, padding: "8px", borderRadius: 9, border: "none",
                            background: "linear-gradient(135deg, #FF8FAB, #FF6B9D)",
                            color: "white", fontSize: 12, fontWeight: 700,
                            cursor: "pointer", fontFamily: "'PingFang SC', sans-serif"
                          }}>保存修改</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div onClick={() => toggleDone(item.id)} style={{
                          width: 22, height: 22, borderRadius: 7, flexShrink: 0, marginTop: 1,
                          border: item.done ? "none" : `2px solid ${theme.border}`,
                          background: item.done ? "linear-gradient(135deg, #FF8FAB, #FF6B9D)" : "white",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", transition: "all 0.2s ease",
                          boxShadow: item.done ? "0 2px 6px rgba(255,143,171,0.4)" : "none"
                        }}>
                          {item.done && <span style={{ color: "white", fontSize: 12, fontWeight: 800 }}>✓</span>}
                        </div>
                        <div style={{
                          background: lc.bg, color: lc.color, border: `1px solid ${lc.border}`,
                          borderRadius: 7, padding: "2px 7px", fontSize: 10, fontWeight: 800,
                          fontFamily: "'PingFang SC', sans-serif", flexShrink: 0, marginTop: 2,
                          opacity: item.done ? 0.5 : 1
                        }}>{item.label}</div>
                        <p style={{
                          flex: 1, fontSize: 13, color: item.done ? theme.textLight : theme.text,
                          fontFamily: "'PingFang SC', sans-serif", lineHeight: 1.55,
                          textDecoration: item.done ? "line-through" : "none",
                          transition: "all 0.2s ease"
                        }}>{item.content}</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                          <button onClick={() => startEdit(item)} style={{
                            border: "none", background: theme.bg, borderRadius: 7,
                            width: 26, height: 26, display: "flex", alignItems: "center",
                            justifyContent: "center", cursor: "pointer", fontSize: 12
                          }}>✏️</button>
                          <button onClick={() => deleteItem(item.id)} style={{
                            border: "none", background: "#FFF0F0", borderRadius: 7,
                            width: 26, height: 26, display: "flex", alignItems: "center",
                            justifyContent: "center", cursor: "pointer", fontSize: 12
                          }}>🗑️</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ));
        })()
      )}
    </div>
  );
}


// ── MineTab ───────────────────────────────────────────────────────────────
function MineTab() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modal, setModal] = useState(null);
  // modal values: "login" | "babies" | "addBaby" | "feedback" | "privacy" | "terms"
  const [loginForm, setLoginForm] = useState({ phone: "", code: "" });
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [babies, setBabies] = useState([
    { id: 1, name: "小宝贝", birth: "2024-11-01", gender: "女" }
  ]);
  const [babyForm, setBabyForm] = useState({ name: "", birth: "", gender: "女" });
  const [editingBabyId, setEditingBabyId] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({ content: "", email: "" });
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const sendCode = () => {
    if (!loginForm.phone || loginForm.phone.length < 11) { showToast("请输入正确的手机号"); return; }
    setCodeCountdown(60);
    const t = setInterval(() => setCodeCountdown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; }), 1000);
    showToast("验证码已发送");
  };

  const handleLogin = () => {
    if (!loginForm.phone || !loginForm.code) { showToast("请填写手机号和验证码"); return; }
    setIsLoggedIn(true); setModal(null); showToast("✅ 登录成功，数据已同步云端");
  };

  const openAddBaby = () => {
    setEditingBabyId(null);
    setBabyForm({ name: "", birth: "", gender: "女" });
    setModal("addBaby");
  };

  const openEditBaby = (baby) => {
    setEditingBabyId(baby.id);
    setBabyForm({ name: baby.name, birth: baby.birth, gender: baby.gender });
    setModal("addBaby");
  };

  const saveBaby = () => {
    if (!babyForm.name.trim() || !babyForm.birth.trim()) { showToast("请填写宝宝昵称和出生日期"); return; }
    if (editingBabyId) {
      setBabies(prev => prev.map(b => b.id === editingBabyId ? { ...b, ...babyForm } : b));
      showToast("✅ 宝宝信息已更新");
    } else {
      setBabies(prev => [...prev, { id: Date.now(), ...babyForm }]);
      showToast("✅ 宝宝已添加");
    }
    setModal("babies");
  };

  const deleteBaby = (id) => {
    setBabies(prev => prev.filter(b => b.id !== id));
    showToast("已删除");
  };

  const calcAge = (birth) => {
    try {
      const b = new Date(birth), now = new Date("2025-03-06");
      const months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
      if (months < 0) return "";
      if (months < 12) return months + "个月";
      const y = Math.floor(months / 12), m = months % 12;
      return y + "岁" + (m ? m + "个月" : "");
    } catch { return ""; }
  };

  const handleFeedback = () => {
    if (!feedbackForm.content.trim()) { showToast("请填写意见内容"); return; }
    showToast("✅ 感谢您的反馈，我们会认真查看！");
    setFeedbackForm({ content: "", email: "" }); setModal(null);
  };

  const inputSt = {
    width: "100%", border: "1.5px solid #F0E8E4", borderRadius: 12,
    padding: "12px 14px", fontSize: 14, fontFamily: "'PingFang SC', sans-serif",
    color: "#2D2D2D", background: "#FFF8F5", outline: "none", marginBottom: 12,
    boxSizing: "border-box"
  };

  const pf = "'PingFang SC', sans-serif";

  // ── modals ──────────────────────────────────────────────────────
  const renderModal = () => {
    if (modal === "login") return (
      <div>
        <p style={{ fontSize: 18, fontWeight: 800, color: "#2D2D2D", fontFamily: pf, marginBottom: 6 }}>欢迎登录 👋</p>
        <p style={{ fontSize: 13, color: "#A8A8A8", fontFamily: pf, marginBottom: 24 }}>登录后数据云端同步，换机不丢失</p>
        <input value={loginForm.phone} onChange={e => setLoginForm(p => ({ ...p, phone: e.target.value }))}
          placeholder="请输入手机号" style={inputSt} type="tel" maxLength={11} />
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <input value={loginForm.code} onChange={e => setLoginForm(p => ({ ...p, code: e.target.value }))}
            placeholder="验证码" style={{ ...inputSt, flex: 1, marginBottom: 0 }} maxLength={6} />
          <button onClick={sendCode} disabled={codeCountdown > 0} style={{
            flexShrink: 0, padding: "12px 14px", borderRadius: 12, border: "none",
            background: codeCountdown > 0 ? "#F0E8E4" : "linear-gradient(135deg, #FF8FAB, #FF6B9D)",
            color: codeCountdown > 0 ? "#A8A8A8" : "white", fontSize: 13, fontWeight: 700,
            cursor: codeCountdown > 0 ? "default" : "pointer", fontFamily: pf, whiteSpace: "nowrap"
          }}>{codeCountdown > 0 ? codeCountdown + "s" : "发送验证码"}</button>
        </div>
        <button onClick={handleLogin} style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg, #FF8FAB, #FF6B9D)", color: "white",
          fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: pf,
          boxShadow: "0 4px 16px rgba(255,143,171,0.45)"
        }}>登录 / 注册</button>
        <p style={{ fontSize: 12, color: "#A8A8A8", textAlign: "center", marginTop: 14, fontFamily: pf, lineHeight: 1.7 }}>
          登录即代表同意《用户协议》与《隐私政策》<br/>未注册手机号将自动注册账号
        </p>
      </div>
    );

    if (modal === "babies") return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#2D2D2D", fontFamily: pf }}>宝宝信息 👶</p>
          <button onClick={openAddBaby} style={{
            background: "linear-gradient(135deg, #FF8FAB, #FF6B9D)", border: "none",
            borderRadius: 12, padding: "8px 14px", color: "white", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: pf, boxShadow: "0 3px 10px rgba(255,143,171,0.35)"
          }}>+ 添加宝宝</button>
        </div>
        {babies.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>👶</p>
            <p style={{ fontSize: 14, color: "#A8A8A8", fontFamily: pf }}>还没有添加宝宝</p>
            <p style={{ fontSize: 12, color: "#C8C8C8", fontFamily: pf, marginTop: 6 }}>点击右上角「+ 添加宝宝」开始</p>
          </div>
        )}
        {babies.map(baby => (
          <div key={baby.id} style={{
            background: "#FFF8F5", borderRadius: 18, padding: "16px 18px", marginBottom: 12,
            border: "1.5px solid #FFD6E0", boxShadow: "0 2px 10px rgba(255,143,171,0.08)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
                background: baby.gender === "女" ? "linear-gradient(135deg,#FFD6E0,#FFB3C6)" : "linear-gradient(135deg,#D4F4F4,#A8E8E8)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26
              }}>{baby.gender === "女" ? "👧" : "👦"}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#2D2D2D", fontFamily: pf }}>{baby.name}</p>
                <p style={{ fontSize: 12, color: "#A8A8A8", fontFamily: pf, marginTop: 3 }}>
                  {baby.birth} · {calcAge(baby.birth)} · {baby.gender}宝
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openEditBaby(baby)} style={{
                  border: "none", background: "#FFD6E0", borderRadius: 10,
                  width: 34, height: 34, display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", fontSize: 15
                }}>✏️</button>
                {babies.length > 1 && (
                  <button onClick={() => deleteBaby(baby.id)} style={{
                    border: "none", background: "#FFF0F0", borderRadius: 10,
                    width: 34, height: 34, display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer", fontSize: 15
                  }}>🗑️</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );

    if (modal === "addBaby") return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={() => setModal("babies")} style={{
            border: "none", background: "#F0E8E4", borderRadius: "50%", width: 32, height: 32,
            fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6B6B6B"
          }}>←</button>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#2D2D2D", fontFamily: pf }}>
            {editingBabyId ? "编辑宝宝信息" : "添加宝宝"} 👶
          </p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: babyForm.gender === "女" ? "linear-gradient(135deg,#FFD6E0,#FFB3C6)" : "linear-gradient(135deg,#D4F4F4,#A8E8E8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 42, boxShadow: "0 4px 16px rgba(255,143,171,0.2)"
          }}>{babyForm.gender === "女" ? "👧" : "👦"}</div>
        </div>
        <p style={{ fontSize: 12, color: "#A8A8A8", fontFamily: pf, marginBottom: 6 }}>
          宝宝昵称 <span style={{ color: "#FF8FAB" }}>*</span>
        </p>
        <input value={babyForm.name} onChange={e => setBabyForm(p => ({ ...p, name: e.target.value }))}
          placeholder="给宝宝起个昵称" style={inputSt} />
        <p style={{ fontSize: 12, color: "#A8A8A8", fontFamily: pf, marginBottom: 6 }}>
          出生日期 <span style={{ color: "#FF8FAB" }}>*</span>
        </p>
        <input value={babyForm.birth} onChange={e => setBabyForm(p => ({ ...p, birth: e.target.value }))}
          placeholder="如 2024-11-01" style={inputSt} />
        <p style={{ fontSize: 12, color: "#A8A8A8", fontFamily: pf, marginBottom: 10 }}>性别</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {["女", "男"].map(g => (
            <button key={g} onClick={() => setBabyForm(p => ({ ...p, gender: g }))} style={{
              flex: 1, padding: "13px", borderRadius: 14, cursor: "pointer",
              border: "2px solid " + (babyForm.gender === g ? "#FF8FAB" : "#F0E8E4"),
              background: babyForm.gender === g ? "#FFD6E0" : "white",
              color: babyForm.gender === g ? "#FF6B9D" : "#A8A8A8",
              fontSize: 15, fontWeight: 700, fontFamily: pf, transition: "all 0.2s ease"
            }}>{g === "女" ? "👧 女宝" : "👦 男宝"}</button>
          ))}
        </div>
        <button onClick={saveBaby} style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg, #FF8FAB, #FF6B9D)", color: "white",
          fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: pf,
          boxShadow: "0 4px 16px rgba(255,143,171,0.45)"
        }}>保存</button>
      </div>
    );

    if (modal === "feedback") return (
      <div>
        <p style={{ fontSize: 18, fontWeight: 800, color: "#2D2D2D", fontFamily: pf, marginBottom: 6 }}>提提意见 💬</p>
        <p style={{ fontSize: 13, color: "#A8A8A8", fontFamily: pf, marginBottom: 20 }}>您的每一条反馈都是我们进步的动力</p>
        <p style={{ fontSize: 12, color: "#A8A8A8", fontFamily: pf, marginBottom: 6 }}>意见内容 <span style={{ color: "#FF8FAB" }}>*</span></p>
        <textarea value={feedbackForm.content} onChange={e => setFeedbackForm(p => ({ ...p, content: e.target.value }))}
          placeholder="请告诉我们您的想法、建议或遇到的问题..." rows={4} style={{ ...inputSt, resize: "none" }} />
        <p style={{ fontSize: 12, color: "#A8A8A8", fontFamily: pf, marginBottom: 6 }}>联系邮箱 <span style={{ color: "#C9B8FF" }}>选填</span></p>
        <input value={feedbackForm.email} onChange={e => setFeedbackForm(p => ({ ...p, email: e.target.value }))}
          placeholder="填写邮箱后，有机会收到我们的回复 ✉️" style={inputSt} type="email" />
        <div style={{
          background: "#EDE8FF", borderRadius: 12, padding: "10px 14px", marginBottom: 20,
          border: "1px solid #C9B8FF44", display: "flex", alignItems: "flex-start", gap: 8
        }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: 12, color: "#9B8AE8", fontFamily: pf, lineHeight: 1.6 }}>
            留下邮箱后，我们可能会就您的反馈与您取得联系，为您提供更好的帮助
          </p>
        </div>
        <button onClick={handleFeedback} style={{
          width: "100%", padding: "14px", borderRadius: 14, border: "none",
          background: "linear-gradient(135deg, #FF8FAB, #FF6B9D)", color: "white",
          fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: pf,
          boxShadow: "0 4px 16px rgba(255,143,171,0.45)"
        }}>提交反馈</button>
      </div>
    );

    const docContent = {
      privacy: { title: "隐私政策 🔒", items: [
        ["信息收集", "我们仅收集您主动填写的宝宝成长数据（身高、体重、喂奶、排便记录等），以及注册时使用的手机号。我们不会收集您的位置信息或通讯录。"],
        ["信息使用", "您的数据仅用于宝贝日记 App 的功能展示与云端同步服务，不会用于任何广告推送或第三方商业用途。"],
        ["数据存储", "本地数据存储在您的设备中。登录后数据加密同步至云端服务器，您可随时在「我的」页面申请删除账号及全部数据。"],
        ["第三方服务", "App 使用短信验证码服务（用于登录）。除此之外，我们不接入任何第三方数据收集 SDK。"],
        ["未成年人", "本产品面向成年监护人使用，记录的是婴幼儿数据，我们不直接收集未成年人个人信息。"],
      ]},
      terms: { title: "用户协议 📋", items: [
        ["服务说明", "宝贝日记是一款面向家长的婴幼儿成长记录工具。您可以免登录使用本地记录功能，注册登录后可享受云端同步服务。"],
        ["用户责任", "您对填写的宝宝健康数据的准确性负责。本 App 提供的成长曲线参考 WHO 标准，仅供参考，不构成医疗建议。"],
        ["账号管理", "每个手机号对应一个账号。您可随时在设置中注销账号，注销后数据将在 30 天内从服务器永久删除。"],
        ["禁止行为", "禁止使用本 App 从事任何违法活动，包括但不限于传播虚假信息、侵犯他人隐私等。"],
        ["服务变更", "我们保留在必要时更新本协议的权利。重大变更将通过 App 内通知告知您。"],
      ]}
    };
    const doc = docContent[modal];
    if (!doc) return null;
    return (
      <div>
        <p style={{ fontSize: 18, fontWeight: 800, color: "#2D2D2D", fontFamily: pf, marginBottom: 20 }}>{doc.title}</p>
        {doc.items.map(([t, txt]) => (
          <div key={t} style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#2D2D2D", fontFamily: pf, marginBottom: 6 }}>{t}</p>
            <p style={{ fontSize: 13, color: "#6B6B6B", fontFamily: pf, lineHeight: 1.7 }}>{txt}</p>
          </div>
        ))}
        <p style={{ fontSize: 12, color: "#A8A8A8", fontFamily: pf, marginTop: 10 }}>最后更新：2025年3月</p>
      </div>
    );
  };

  // ── menu ────────────────────────────────────────────────────────
  const menuItems = [
    {
      group: "宝宝",
      items: [
        {
          icon: "👶", label: "宝宝信息",
          sub: babies.length > 0 ? "已添加 " + babies.length + " 个宝宝 · " + babies.map(b => b.name).join("、") : "点击添加宝宝信息",
          action: () => setModal("babies")
        },
      ]
    },
    {
      group: "其他",
      items: [
        { icon: "💬", label: "提提意见", sub: "您的反馈帮助我们变得更好", action: () => setModal("feedback") },
        { icon: "🔗", label: "分享 App", sub: "推荐给其他宝爸宝妈", action: () => showToast("复制分享链接成功！") },
        { icon: "🔒", label: "隐私政策", sub: "了解我们如何保护您的数据", action: () => setModal("privacy") },
        { icon: "📋", label: "用户协议", sub: "查看服务条款", action: () => setModal("terms") },
        { icon: "ℹ️", label: "版本信息", sub: "宝贝日记 v1.0.0", action: () => showToast("已是最新版本 ✨") },
      ]
    },
    ...(isLoggedIn ? [{
      group: "",
      items: [{ icon: "🚪", label: "退出登录", sub: "", action: () => { setIsLoggedIn(false); showToast("已退出登录"); }, danger: true }]
    }] : [])
  ];

  return (
    <div style={{ padding: "0 16px", paddingBottom: 90 }}>
      <div style={{ padding: "16px 0 20px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: theme.text, fontFamily: pf }}>👤 我的</h2>
      </div>

      {/* Login / profile banner */}
      {isLoggedIn ? (
        <div style={{
          background: "linear-gradient(135deg, #FFD6E0, #FFE8D6)", borderRadius: 24, padding: "20px",
          marginBottom: 20, border: "1px solid " + theme.primaryLight, display: "flex", alignItems: "center", gap: 16
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "linear-gradient(135deg, #FF8FAB, #FF6B9D)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, boxShadow: "0 4px 14px rgba(255,143,171,0.4)"
          }}>👩</div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: theme.text, fontFamily: pf }}>宝妈/宝爸</p>
            <p style={{ fontSize: 12, color: theme.textMid, fontFamily: pf, marginTop: 3 }}>
              📱 138****8888 · 数据已同步云端 ☁️
            </p>
          </div>
        </div>
      ) : (
        <div onClick={() => setModal("login")} style={{
          background: "linear-gradient(135deg, #FF8FAB, #FF6B9D)", borderRadius: 24,
          padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16,
          cursor: "pointer", boxShadow: "0 6px 24px rgba(255,143,171,0.4)"
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26
          }}>👤</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: "white", fontFamily: pf }}>点击登录 / 注册</p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontFamily: pf, marginTop: 4 }}>
              ☁️ 登录后数据云端备份，换机不丢失
            </p>
          </div>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 18 }}>›</span>
        </div>
      )}

      {/* Local data tip */}
      {!isLoggedIn && (
        <div style={{
          background: "#EDE8FF", borderRadius: 14, padding: "12px 16px", marginBottom: 20,
          border: "1px solid #C9B8FF44", display: "flex", alignItems: "center", gap: 10
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: 12, color: "#9B8AE8", fontFamily: pf, lineHeight: 1.6 }}>
            当前数据仅保存在本机，<span style={{ fontWeight: 700 }}>登录后自动同步云端</span>，卸载或换机数据不丢失
          </p>
        </div>
      )}

      {/* Menu */}
      {menuItems.map((group, gi) => (
        <div key={gi} style={{ marginBottom: 16 }}>
          {group.group && (
            <p style={{ fontSize: 11, fontWeight: 700, color: theme.textLight, letterSpacing: "0.08em",
              marginBottom: 8, fontFamily: pf }}>{group.group.toUpperCase()}</p>
          )}
          <div style={{
            background: "white", borderRadius: 18, overflow: "hidden",
            border: "1px solid " + theme.border, boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
          }}>
            {group.items.map((item, ii) => (
              <div key={ii} onClick={item.action} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                borderBottom: ii < group.items.length - 1 ? "1px solid " + theme.border : "none",
                cursor: "pointer", background: "white"
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: item.danger ? "#FFF0F0" : theme.bg,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
                }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, fontFamily: pf, color: item.danger ? "#FF4D4D" : theme.text }}>
                    {item.label}
                  </p>
                  {item.sub ? <p style={{ fontSize: 11, color: theme.textLight, fontFamily: pf, marginTop: 2 }}>{item.sub}</p> : null}
                </div>
                <span style={{ color: item.danger ? "#FFB3B3" : theme.textLight, fontSize: 16 }}>›</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal */}
      {modal && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end",
          zIndex: 100, animation: "fadeIn 0.2s ease"
        }}>
          <div style={{
            background: "white", borderRadius: "24px 24px 0 0",
            padding: "28px 24px 48px", width: "100%",
            maxHeight: "85%", overflowY: "auto",
            animation: "slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1)"
          }}>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
              <button onClick={() => setModal(null)} style={{
                border: "none", background: "#F0E8E4", borderRadius: "50%",
                width: 32, height: 32, fontSize: 16, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", color: theme.textMid
              }}>✕</button>
            </div>
            {renderModal()}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "absolute", bottom: 110, left: "50%", transform: "translateX(-50%)",
          background: "#2D2D2D", color: "white", borderRadius: 20,
          padding: "10px 20px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
          fontFamily: pf, zIndex: 300, animation: "toastIn 0.3s ease",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}>{toast}</div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [detailPage, setDetailPage] = useState(null); // "feeding" | "poop" | "height" | "weight"
  const [showVoice, setShowVoice] = useState(false);
  const [toast, setToast] = useState(null);
  const scrollRef = useRef(null);

  const handleSave = (data) => {
    setToast(`✅ 已记录到${data.module}`);
    setTimeout(() => setToast(null), 3000);
  };

  const openDetail = (id) => {
    setDetailPage(id);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const closeDetail = () => {
    setDetailPage(null);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const handleTabChange = (t) => {
    setDetailPage(null);
    setTab(t);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "#F0E8E4", display: "flex",
      justifyContent: "center", alignItems: "center",
      fontFamily: "'PingFang SC', 'Helvetica Neue', sans-serif"
    }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity:0 } to { transform: translateX(0); opacity:1 } }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity:0.6 } 50% { transform: scale(1.4); opacity:0 } }
        @keyframes bounce { 0%,80%,100% { transform: translateY(0) } 40% { transform: translateY(-8px) } }
        @keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(20px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Phone frame */}
      <div style={{
        width: "min(390px, 100vw)", height: "min(844px, 100vh)", background: theme.bg,
        borderRadius: "min(48px, 4vw)",
        overflow: "hidden", position: "relative", display: "flex", flexDirection: "column",
        boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 0 0 8px #1a1a1a, 0 0 0 10px #2a2a2a",
      }}>
        {/* Status bar */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 28px 0", flexShrink: 0
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>9:41</span>
          <div style={{ width: 120, height: 30, background: "#1a1a1a", borderRadius: 20,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#333" }} />
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: theme.text }}>●●●</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: theme.text }}>100%</span>
          </div>
        </div>

        {/* Scroll area */}
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>

          {/* Detail pages (slide in over home) */}
          {detailPage && (
            <div style={{ animation: "slideInRight 0.3s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
              {detailPage === "feeding" && <FeedingDetailPage onBack={closeDetail} />}
              {detailPage === "poop"    && <PoopDetailPage    onBack={closeDetail} />}
              {detailPage === "height"  && <HeightDetailPage  onBack={closeDetail} />}
              {detailPage === "weight"  && <WeightDetailPage  onBack={closeDetail} />}
            </div>
          )}

          {/* Main tabs (hidden when detail is open) */}
          {!detailPage && (
            <>
              {tab === "home"     && <HomeTab onVoice={() => setShowVoice(true)} onDetail={openDetail} />}
              {tab === "growth"   && <GrowthTab />}
              {tab === "feeding"  && <FeedingTab />}
              {tab === "poop"     && <PoopTab />}
              {tab === "schedule" && <ScheduleTab />}
              {tab === "mine"     && <MineTab />}
            </>
          )}
        </div>

        {/* Tab bar — hidden when detail page is open */}
        {!detailPage && (
          <div style={{ flexShrink: 0 }}>
            <TabBar active={tab} onChange={handleTabChange} />
          </div>
        )}

        {/* Voice modal */}
        {showVoice && <VoiceModal onClose={() => setShowVoice(false)} onSave={handleSave} />}

        {/* Toast */}
        {toast && (
          <div style={{
            position: "absolute", bottom: 100, left: "50%", transform: "translateX(-50%)",
            background: "#2D2D2D", color: "white", borderRadius: 20,
            padding: "10px 20px", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap",
            fontFamily: "'PingFang SC', sans-serif", zIndex: 200,
            animation: "toastIn 0.3s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
          }}>{toast}</div>
        )}
      </div>
    </div>
  );
}
