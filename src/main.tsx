import { ChangeEvent, DragEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ChevronDown,
  CircleHelp,
  Code2,
  Crown,
  FolderOpen,
  History,
  House,
  Layers3,
  Link2,
  LogIn,
  Menu,
  Monitor,
  Settings,
  Sparkles,
  Upload,
  UserRound,
  X,
} from "lucide-react";
import { createRoot } from "react-dom/client";
import "./style.css";

type Page =
  | "home"
  | "dashboard"
  | "create"
  | "projects"
  | "templates"
  | "history"
  | "favorites"
  | "billing"
  | "settings";
type Quality = "Production High" | "Production Moderate" | "Production Low";
const qualityMap: Record<Quality, string> = {
  "Production High": "4K",
  "Production Moderate": "2K",
  "Production Low": "1K",
};
const logo = "/vexora-logo.svg";
const runtimeEnv = (import.meta as any).env || {};
const configured = {
  production: Boolean(runtimeEnv.VITE_PRODUCTION_ENGINE_URL),
  automation: Boolean(runtimeEnv.VITE_AUTOMATION_ENGINE_URL),
  native: Boolean(runtimeEnv.VITE_NATIVE_BRIDGE_URL),
};

export function App() {
  const [page, setPage] = useState<Page>("home"),
    [sidebar, setSidebar] = useState(false),
    [quality, setQuality] = useState<Quality>("Production High"),
    [file, setFile] = useState<File | null>(null),
    [authOpen, setAuthOpen] = useState(false),
    [login, setLogin] = useState({ username: "", password: "" }),
    [notice, setNotice] = useState("");
  const [session, setSession] = useState<{ name: string; tier: string } | null>(
    () => {
      try {
        const x = sessionStorage.getItem("nesting-test-session");
        const saved = x ? JSON.parse(x) : null;
        return saved?.name === "Nesting Member" ? { ...saved, name: "Vexora Member" } : saved;
      } catch {
        return null;
      }
    },
  );
  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file],
  );
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  useEffect(() => {
    document.title = "Vexora AI — Native Illustrator Automation";
    history.replaceState(null, "", location.pathname);
  }, []);
  const go = (p: Page) => {
    setPage(p);
    setSidebar(false);
    setNotice("");
    history.replaceState(null, "", p === "home" ? location.pathname : `#${p}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const receive = (candidate?: File) => {
    if (!candidate) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(candidate.type)) {
      setNotice("Use a PNG, JPG, JPEG, or WebP design file.");
      return;
    }
    if (candidate.size > 50 * 1024 * 1024) {
      setNotice("The selected file is larger than 50 MB.");
      return;
    }
    setFile(candidate);
    setNotice("");
  };
  const signIn = () => {
    if (login.username.trim() === "admin" && login.password === "12345") {
      const t = { name: "Vexora Member", tier: "Plus Plan" };
      sessionStorage.setItem("nesting-test-session", JSON.stringify(t));
      setSession(t);
      setLogin({ username: "", password: "" });
      setAuthOpen(false);
      go("dashboard");
    } else setNotice("Incorrect username or password.");
  };
  const profile = () => (session ? go("dashboard") : setAuthOpen(true));
  const vectorize = () => {
    if (!file) setNotice("Upload a design before vectorizing.");
    else if (!configured.production)
      setNotice(
        "Production Engine requires configuration before jobs can be submitted. Your design stays in this browser.",
      );
    else
      setNotice(
        "Production Engine endpoint is configured. Job submission is ready for the connected backend.",
      );
  };
  const user = session?.name ?? "Vexora Member";
  return (
    <div className="app">
      {page === "home" ? (
        <Home go={go} profile={profile} />
      ) : (
        <>
          <button
            className={`logo-toggle ${sidebar ? "open" : ""}`}
            onClick={() => setSidebar((v) => !v)}
            aria-label={sidebar ? "Close navigation" : "Open navigation"}
            aria-expanded={sidebar}
          >
            <img src={logo} alt="Vexora AI" />
          </button>
          {sidebar && (
            <>
              <button
                className="scrim"
                onClick={() => setSidebar(false)}
                aria-label="Close navigation"
              />
              <aside className="drawer">
                <Sidebar
                  page={page}
                  go={go}
                  user={user}
                  tier={session?.tier ?? "Free Plan"}
                  profile={profile}
                />
              </aside>
            </>
          )}
          <main className="workspace">
            {page === "create" ? (
              <Creator
                quality={quality}
                setQuality={setQuality}
                file={file}
                preview={preview}
                receive={receive}
                vectorize={vectorize}
                notice={notice}
              />
            ) : (
              <Workspace
                page={page}
                go={go}
                session={session}
                profile={profile}
              />
            )}
          </main>
        </>
      )}
      {authOpen && (
        <Auth
          close={() => setAuthOpen(false)}
          login={login}
          setLogin={setLogin}
          signIn={signIn}
          notice={notice}
        />
      )}
    </div>
  );
}
function Brand() {
  return (
    <div className="brand">
      <img src={logo} alt="Vexora AI" />
      <span>
        <b>
          Vexora <i>AI</i>
        </b>
        <small>by Atherious Labs</small>
      </span>
    </div>
  );
}
function Home({ go, profile }: { go: (p: Page) => void; profile: () => void }) {
  const [info, setInfo] = useState<
    "how" | "features" | "illustrator" | "pricing" | ""
  >("");
  const content = {
    how: {
      title: "How Vexora AI Works",
      intro:
        "A focused production workflow that turns uploaded artwork into clean, editable vector output.",
      items: [
        "Upload a PNG, JPG, JPEG or WebP design up to 50 MB.",
        "Select Production High (4K), Production Moderate (2K), or Production Low (1K).",
        "The Production Engine prepares the artwork while the Automation Engine manages the workflow.",
        "Illustrator Native completes production tasks and returns export-ready files when connected.",
      ],
    },
    features: {
      title: "Production Features",
      intro:
        "Every feature is designed for artwork fidelity, editability, and real production use.",
      items: [
        "Drag-and-drop upload with an actual browser preview.",
        "Quality presets automatically mapped to 4K, 2K, and 1K.",
        "Real connection states for Production Engine, Automation Engine, and Illustrator Native.",
        "Project, template, history, favorites, batch-processing, and API integration workspaces.",
        "No fabricated projects, usage figures, credits, or completion states.",
      ],
    },
    illustrator: {
      title: "Illustrator Automation",
      intro:
        "Vexora AI is built to work with Adobe Illustrator through the Native Bridge.",
      items: [
        "Connect the authorized desktop device to Illustrator Native.",
        "Run vector preparation and production automation in the background.",
        "Keep the exact approved artwork as the master source throughout processing.",
        "Export support will activate through the connected engine and Native Bridge.",
        "Until the bridge is configured, the interface shows a genuine configuration-required state.",
      ],
    },
    pricing: {
      title: "Plans & Pricing",
      intro:
        "Choose a monthly membership or pay only for the generations you use.",
      items: [
        "Daily limits reset after 24 hours.",
        "Generation is locked when a daily or monthly limit is exhausted.",
        "An expired membership without renewal returns to the Normal plan.",
        "Renewal reminders begin daily from 10 days before expiry.",
      ],
    },
  } as const;
  const pricingPlans = [
    {
      name: "Plus",
      price: "$19.99",
      period: "/ month",
      limits: [
        "5 generations per day",
        "40 generations per month",
        "Production quality access",
      ],
    },
    {
      name: "Pro",
      price: "$49.99",
      period: "/ month",
      limits: [
        "15 generations per day",
        "100 generations per month",
        "Advanced native automation",
      ],
    },
    {
      name: "Pay As You Go",
      price: "$0.60–$0.80",
      period: "/ generation",
      limits: [
        "Balance deducted per creation",
        "No monthly membership required",
        "Pay only when you generate",
      ],
    },
  ];
  return (
    <div className="home home-pixel">
      <div className="landing-frame">
        <img
          className="landing-pixel-image"
          src="/vexora-landing.svg"
          alt="Vexora AI artwork and vector production platform"
        />
        <nav className="landing-hotspots" aria-label="Landing page navigation">
          <button className="hotspot hotspot-home" aria-label="Home" />
          <button
            className="hotspot hotspot-how"
            onClick={() => setInfo("how")}
            aria-label="How It Works"
          />
          <button
            className="hotspot hotspot-features"
            onClick={() => setInfo("features")}
            aria-label="Features"
          />
          <button
            className="hotspot hotspot-pricing"
            onClick={() => setInfo("pricing")}
            aria-label="Pricing"
          />
          <button
            className="hotspot hotspot-start"
            onClick={() => go("create")}
            aria-label="Get Started"
          />
          <button
            className="hotspot hotspot-how-cta"
            onClick={() => setInfo("how")}
            aria-label="How It Works"
          />
        </nav>
      </div>
      <footer className="pixel-copyright">
        <a className="seo-about-link" href="/about/">About Vexora AI</a> · © 2026 Atherious Labs. All rights reserved.
      </footer>
      {info && (
        <div className="home-modal-wrap" onClick={() => setInfo("")}>
          <section
            className="home-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={content[info].title}
          >
            <button
              className="home-modal-close"
              onClick={() => setInfo("")}
              aria-label="Close"
            >
              <X />
            </button>
            <span>Vexora AI</span>
            <h2>{content[info].title}</h2>
            <p>{content[info].intro}</p>
            {info === "pricing" ? (
              <>
                <div className="pricing-grid">
                  {pricingPlans.map((plan) => (
                    <article
                      className={`pricing-card ${plan.name === "Pro" ? "featured" : ""}`}
                      key={plan.name}
                    >
                      <span>{plan.name}</span>
                      <h3>
                        {plan.price} <small>{plan.period}</small>
                      </h3>
                      <ul>
                        {plan.limits.map((limit) => (
                          <li key={limit}>{limit}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
                <div className="pricing-rules">
                  {content.pricing.items.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </>
            ) : (
              <div>
                {content[info].items.map((item, index) => (
                  <article key={item}>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            )}
            {info === "pricing" && (
              <button
                className="glow-button modal-cta"
                onClick={() => go("billing")}
              >
                Open Plan & Billing <ArrowRight />
              </button>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
function Sidebar({ page, go, user, tier, profile }: any) {
  const links: [[Page, string, any]] | any = [
    ["home", "Home", House],
    ["dashboard", "Dashboard", Activity],
    ["create", "Create", Sparkles],
    ["projects", "Projects", FolderOpen],
    ["templates", "Templates", Layers3],
    ["history", "Generation History", History],
    ["favorites", "Favorites", Crown],
  ];
  return (
    <div className="sidebar-inner">
      <Brand />
      <button className="member" onClick={profile}>
        <UserRound />
        <span>
          <b>{user}</b>
          <small>{tier}</small>
        </span>
        <ChevronDown />
      </button>
      <div className="side-links">
        {links.map(([k, n, I]: any) => (
          <button
            key={k}
            className={page === k ? "selected" : ""}
            onClick={() => go(k)}
          >
            <I />
            {n}
          </button>
        ))}
      </div>
      <div className="side-links divided">
        <button onClick={() => go("create")}>
          <Link2 />
          Connect to Native
          <i className={configured.native ? "on" : ""} />
        </button>
        <button>
          <Layers3 />
          Batch Processing
        </button>
        <button>
          <Code2 />
          API &amp; Integrations
        </button>
      </div>
      <div className="side-links divided">
        <button onClick={() => go("billing")}>
          <Monitor />
          Plan &amp; Billing
        </button>
      </div>
      <div className="upgrade">
        <Crown />
        <b>Upgrade Your Plan</b>
        <p>Unlock higher quality, faster processing and advanced features.</p>
        <button onClick={() => go("billing")}>
          Upgrade to Pro
          <ArrowRight />
        </button>
      </div>
      <div className="side-links bottom">
        <button onClick={() => go("settings")}>
          <Settings />
          Settings
        </button>
        <button>
          <CircleHelp />
          Help &amp; Support
        </button>
      </div>
      <small className="copyright">
        © 2026 Atherious Labs. All rights reserved.
      </small>
    </div>
  );
}
function Creator({
  quality,
  setQuality,
  file,
  preview,
  receive,
  vectorize,
  notice,
}: any) {
  const drop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    receive(e.dataTransfer.files[0]);
  };
  return (
    <section className="creator">
      <header className="creator-head">
        <div>
          <span>
            Vexora AI <small>AI Vector Engine</small>
          </span>
          <h1>
            Vectorize <em>Now</em>
            <b>ϟ</b>
          </h1>
          <p>Turn any design into a clean, editable vector — instantly.</p>
        </div>
        <img src="/vexora-robot.svg" alt="Vexora AI robot" />
      </header>
      <div className="connections">
        <Connection
          label="Production Engine"
          value="AI artwork engine"
          online={configured.production}
        />
        <Connection
          label="Automation Engine"
          value="Workflow automation"
          online={configured.automation}
        />
        <Connection
          label="Illustrator Native"
          value="Desktop connection"
          online={configured.native}
        />
      </div>
      <label
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={drop}
      >
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            receive(e.target.files?.[0])
          }
        />
        {preview ? (
          <>
            <img src={preview} alt="Uploaded design preview" />
            <span>
              <b>{file.name}</b>
              <small>Click or drop another file to replace it</small>
            </span>
          </>
        ) : (
          <>
            <Upload />
            <b>Drop Your Design Here</b>
            <small>Upload PNG, JPG, JPEG, WebP (up to 50 MB)</small>
          </>
        )}
      </label>
      <div className="quality-row">
        <label className="quality-label">
          Output Quality
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as Quality)}
          >
            {Object.keys(qualityMap).map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <div className="resolutions">
          {["4K", "2K", "1K"].map((x) => (
            <span
              key={x}
              className={qualityMap[quality as Quality] === x ? "current" : ""}
            >
              <Monitor />
              {x}
            </span>
          ))}
        </div>
        <button className="vectorize" onClick={vectorize}>
          <Sparkles />
          Vectorize Now
          <ArrowRight />
        </button>
      </div>
      {notice && <p className="notice">{notice}</p>}
    </section>
  );
}
function Connection({ label, value, online }: any) {
  return (
    <div className="connection">
      <Layers3 />
      <span>
        <b>{label}</b>
        <small>{value}</small>
      </span>
      <i className={online ? "on" : ""} />
      <em>{online ? "Connected" : "Configuration required"}</em>
    </div>
  );
}
function Workspace({ page, go, session, profile }: any) {
  if (page !== "dashboard")
    return (
      <section className="empty">
        <div>
          <Layers3 />
        </div>
        <span>{page.toUpperCase()}</span>
        <h1>
          {page === "billing"
            ? "Plan & Billing"
            : page === "settings"
              ? "Settings"
              : page === "favorites"
                ? "Favorites"
                : page === "history"
                  ? "Generation History"
                  : page[0].toUpperCase() + page.slice(1)}
        </h1>
        <p>
          This section has no connected data yet. Connect the required
          integration to show real information.
        </p>
        {page === "billing" && (
          <button className="glow-button">Payment Gateway Required</button>
        )}
      </section>
    );
  return (
    <section className="dashboard">
      <header className="dashbar">
        <input placeholder="Search projects, designs, or templates…" />
        <button onClick={profile}>
          <UserRound />
          {session?.name ?? "Guest"}
        </button>
      </header>
      <h1>
        Welcome Back, <em>{session?.name?.split(" ")[0] ?? "Member"}</em>{" "}
        <span>👋</span>
      </h1>
      <p>
        Manage your designs, track usage, and create high-quality vector
        outputs.
      </p>
      <div className="dashboard-grid">
        <section className="account-card">
          <UserRound />
          <div>
            <b>{session?.name ?? "Vexora Member"}</b>
            <small>{session?.tier ?? "Free Plan"}</small>
          </div>
        </section>
        <Metric
          title="Credits Balance"
          value="—"
          note="Billing integration required"
        />
        <Metric title="Plan" value={session?.tier ?? "Free Plan"} />
        <Metric
          title="Usage (This Month)"
          value="—"
          note="No analytics connected"
        />
        <section className="data-empty large">
          <Activity />
          <b>Your Activity</b>
          <p>
            Activity will appear here once generation analytics are connected.
          </p>
        </section>
        <section className="actions-card">
          <b>Quick Actions</b>
          <button onClick={() => go("create")}>
            <Sparkles />
            Create Vector
          </button>
          <button onClick={() => go("projects")}>
            <FolderOpen />
            New Project
          </button>
          <button onClick={() => go("templates")}>
            <Layers3 />
            Use Template
          </button>
          <button onClick={() => go("create")}>
            <Link2 />
            Connect to Native
          </button>
        </section>
        <section className="data-empty recent">
          <FolderOpen />
          <b>Recent Projects</b>
          <p>No projects yet. Create your first vector workflow.</p>
        </section>
        <section className="upgrade-wide">
          <Crown />
          <h2>
            Upgrade to <em>Pro</em>
          </h2>
          <p>
            Get more credits, higher quality outputs, faster processing and
            exclusive features.
          </p>
          <button onClick={() => go("billing")}>
            Upgrade Plan
            <ArrowRight />
          </button>
        </section>
      </div>
    </section>
  );
}
function Metric({ title, value, note }: any) {
  return (
    <section className="metric">
      <small>{title}</small>
      <b>{value}</b>
      {note && <span>{note}</span>}
    </section>
  );
}
function Auth({ close, login, setLogin, signIn, notice }: any) {
  return (
    <div className="modal-wrap">
      <section className="auth-modal">
        <button className="close" onClick={close}>
          <X />
        </button>
        <Brand />
        <h2>Welcome to Vexora AI</h2>
        <p>Sign in to access your member workspace.</p>
        <label>
          Username
          <input
            value={login.username}
            onChange={(e) => setLogin({ ...login, username: e.target.value })}
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            autoComplete="current-password"
          />
        </label>
        <button className="glow-button" onClick={signIn}>
          <LogIn />
          Login
        </button>
        <button className="signup">
          Sign Up requires authentication provider configuration
        </button>
        {notice && <p className="notice">{notice}</p>}
      </section>
    </div>
  );
}
if (typeof document !== "undefined") {
  createRoot(document.getElementById("root")!).render(<App />);
}
