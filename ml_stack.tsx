import React, { useState, useEffect, useRef } from "react";

type Project = {
  id: string;
  tag: string;
  title: string;
  tagline: string;
  status: string;
  color: string;
  problem: string;
  approach: string[];
  architecture: { step: string; label: string; detail: string }[];
  stack: string[];
  metrics: { label: string; value: string }[];
  githubUrl: string | null;
  demoUrl: string | null;
  dataset?: string;
};

const PROJECTS: Project[] = [
  {
    id: "01",
    tag: "Computer Vision · MLOps · Multi-modal",
    title: "Visual Product Recommendation Engine",
    tagline: "137,798 products. Sub-5ms search. Full production stack.",
    status: "Live",
    color: "#6366f1",
    problem: "Visual search at marketplace scale requires more than a trained model. It needs a reproducible embedding pipeline, a versioned index, a production inference service, and automated deployment — all working together reliably.",
    approach: [
      "Fine-grained visual retrieval using Vision Transformer (ViT) — the CLS token embedding captures global product semantics, not just local texture features like CNNs.",
      "Late fusion of image and text signals at inference time. Product title, brand, and category are encoded separately and combined with a tunable alpha parameter — improving retrieval quality over image-only baseline.",
      "FAISS IndexFlatIP over L2-normalised embeddings gives exact cosine similarity search across 137k products in under 5ms — no approximation needed at this scale.",
      "Dataset: Amazon Berkeley Objects (ABO) — 147k multi-category listings with rich metadata. Architecture benchmarked against eProduct visual search methodology and designed to generalise to MEP-3M at 3M+ products.",
      "Full MLOps layer: MLflow experiment tracking, model registry with staging and production tags, automatic index rebuild on model promotion, rollback on health check failure.",
    ],
    architecture: [
      { step: "01", label: "ABO Dataset", detail: "147k products · image + metadata" },
      { step: "02", label: "ViT Encoder", detail: "google/vit-base-patch16-224 · 768-dim CLS token" },
      { step: "03", label: "Text Encoder", detail: "sentence-transformers · title + brand + category" },
      { step: "04", label: "Late Fusion", detail: "α · image + (1-α) · text · L2 normalised" },
      { step: "05", label: "FAISS Index", detail: "IndexFlatIP · 137,798 vectors · <5ms search" },
      { step: "06", label: "FastAPI", detail: "/recommend · /health · /model-info" },
      { step: "07", label: "MLflow", detail: "Experiment tracking · model registry · versioning" },
      { step: "08", label: "HF Space", detail: "Live demo · full index loaded at startup" },
    ],
    stack: ["ViT", "FAISS", "FastAPI", "MLflow", "Docker", "GitHub Actions", "sentence-transformers", "ABO Dataset", "HuggingFace"],
    metrics: [
      { label: "Index Size", value: "137,798" },
      { label: "Search Latency", value: "<5ms" },
      { label: "Embedding Dim", value: "768" },
      { label: "Fusion", value: "Multi-modal" },
    ],
    githubUrl: "https://github.com/lawrenceokolo1/vit-faiss-product-recommendation",
    demoUrl: "https://huggingface.co/spaces/Lawrence-okolo/product-recommendation",
    dataset: "Amazon Berkeley Objects (ABO) — CC BY-NC 4.0",
  },
  {
    id: "02",
    tag: "LLM · Advanced RAG · Agentic Systems",
    title: "Enterprise RAG Knowledge Platform",
    tagline: "Three-layer RAG: Advanced retrieval, agentic reasoning, production evaluation.",
    status: "Building",
    color: "#a855f7",
    problem: "Standard RAG breaks on complex queries — it retrieves the wrong chunks, hallucinates when context is incomplete, and provides no mechanism for verifying answer quality. Enterprise systems need retrieval that actually works and answers that can be trusted.",
    approach: [
      "Advanced RAG layer: hybrid dense and sparse retrieval fused via Reciprocal Rank Fusion (RRF), followed by cross-encoder re-ranking. Consistently outperforms either approach alone — especially on domain-specific terminology where BM25 sparse retrieval recovers exact-match signals that dense search misses.",
      "HyDE (Hypothetical Document Embeddings) and query rewriting improve retrieval on ambiguous or underspecified questions before the vector search runs.",
      "Agentic layer built on LangGraph: the agent decomposes complex queries into sub-questions, retrieves independently for each, and synthesises across results. Self-reflection loop grades its own answer and re-retrieves if confidence is low.",
      "Multi-source ingestion: PDFs via PyMuPDF, web pages via trafilatura, structured databases via SQLAlchemy, markdown and code files — all chunked semantically and indexed in Qdrant with dual dense and sparse vectors.",
      "Swappable LLM backend: Ollama (local), OpenAI, or HuggingFace switched via a single environment variable. Zero code changes required.",
      "Production evaluation via RAGAs: Faithfulness, Answer Relevancy, Context Precision, Context Recall, and Answer Correctness tracked automatically. Hallucination detection via entailment checking. Scores logged to MLflow with threshold alerts.",
    ],
    architecture: [
      { step: "01", label: "Multi-Source Ingestion", detail: "PDF · Web · SQL · Markdown" },
      { step: "02", label: "Semantic Chunking", detail: "Meaning-aware splits, not fixed token windows" },
      { step: "03", label: "Dual Indexing", detail: "Dense (sentence-transformers) + Sparse (BM25)" },
      { step: "04", label: "Hybrid Retrieval", detail: "Dense + BM25 fused via RRF" },
      { step: "05", label: "Cross-Encoder Rerank", detail: "BGE reranker · top-k reordering" },
      { step: "06", label: "LangGraph Agent", detail: "Query decomposition · tools · self-reflection" },
      { step: "07", label: "LLM Gateway", detail: "Ollama / OpenAI / HuggingFace — swappable" },
      { step: "08", label: "RAGAs Evaluation", detail: "Faithfulness · Relevancy · Precision · Recall" },
    ],
    stack: ["LangChain", "LangGraph", "Qdrant", "FastAPI", "RAGAs", "BGE Reranker", "Ollama", "OpenAI", "HuggingFace", "Prometheus", "Grafana", "Docker"],
    metrics: [
      { label: "RAG Layers", value: "3" },
      { label: "LLM Backends", value: "3" },
      { label: "Eval Metrics", value: "5" },
      { label: "Sources", value: "Multi" },
    ],
    githubUrl: null,
    demoUrl: null,
  },
  {
    id: "03",
    tag: "Infrastructure · GPU Systems · MLOps",
    title: "Async GPU Inference Service",
    tagline: "Production-grade async inference. Fault-tolerant. Observable. Scalable.",
    status: "Planned",
    color: "#8b5cf6",
    problem: "GPU inference in production is not just a model serving problem — it is a systems engineering problem. Synchronous endpoints block under load, GPU workers crash without recovery, and teams have no visibility into queue health or resource utilisation until something breaks.",
    approach: [
      "Fully asynchronous architecture: clients submit jobs via POST /jobs and receive a job_id immediately. Workers process asynchronously and clients poll GET /jobs/{id} for results — no blocking, no timeouts under load.",
      "Celery worker pool with Redis as the message broker. Workers are assigned to specific GPU devices. CPU fallback activates automatically when GPU capacity is saturated.",
      "Fault tolerance at every layer: retry logic with exponential backoff, dead letter queue for permanently failed jobs, graceful worker shutdown that completes in-flight jobs before stopping.",
      "Real-time observability: Prometheus scrapes queue depth, job latency percentiles, GPU utilisation, worker health, and failure rates. Grafana dashboard shows live system state.",
      "Horizontal scaling: spinning up additional Celery workers increases throughput linearly. The architecture is designed to support hybrid on-prem and cloud GPU burst capacity.",
    ],
    architecture: [
      { step: "01", label: "FastAPI", detail: "POST /jobs · GET /jobs/{id} · GET /health" },
      { step: "02", label: "Redis Queue", detail: "Message broker · job state storage" },
      { step: "03", label: "Celery Workers", detail: "GPU device assignment · CPU fallback" },
      { step: "04", label: "PyTorch Inference", detail: "Model loaded once per worker · batching" },
      { step: "05", label: "Retry + DLQ", detail: "3 retries · exponential backoff · dead letter" },
      { step: "06", label: "Prometheus", detail: "Queue depth · latency · GPU util · failures" },
      { step: "07", label: "Grafana", detail: "Live dashboard · threshold alerts" },
      { step: "08", label: "Docker Compose", detail: "API + workers + Redis + monitoring" },
    ],
    stack: ["PyTorch", "Celery", "Redis", "FastAPI", "Prometheus", "Grafana", "Docker", "pynvml", "GitHub Actions"],
    metrics: [
      { label: "Throughput", value: "1.2k/min" },
      { label: "Queue Latency", value: "<50ms" },
      { label: "Uptime Target", value: "99.9%" },
      { label: "Scaling", value: "Horizontal" },
    ],
    githubUrl: null,
    demoUrl: null,
  },
];

const COMMUNITY = {
  tag: "Open Source · Robotics · Autonomous Systems",
  title: "Vancouver Autonomous Systems Initiative",
  tagline: "Building autonomous mobile robots. Open source. Community-driven.",
  color: "#22c55e",
  desc: "VASI is an open source robotics collective at the intersection of AI and hardware. We build autonomous mobile robots using NVIDIA Isaac and ROS2, running active technical sessions for practitioners across ML, embedded systems, and autonomous platforms. Founded while working inside a hardware company — built from real engineering practice, not theory.",
  focus: [
    "Autonomous navigation using ROS2 and NVIDIA Isaac Sim for simulation-to-real transfer",
    "SLAM and sensor fusion pipelines for real hardware deployment",
    "Edge AI inference on embedded platforms",
    "Open technical sessions covering autonomy, ML, and systems engineering",
  ],
  githubUrl: "https://github.com/VASI-vancouver-autonomous/auto-navigation",
  demoUrl: "https://www.linkedin.com/posts/vancouver-autonomous-systems-initiative_demo-session-recap-vancouver-autonomous-activity-7435050694317084673-fGrF",
};

function useInView(threshold = 0.08): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { Live: "#22c55e", Building: "#f59e0b", Planned: "#4b5563" };
  const c = map[status] || "#4b5563";
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: c, background: `${c}15`, border: `1px solid ${c}30`, borderRadius: 100, padding: "3px 10px", display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c, animation: status === "Live" ? "pulse 2s infinite" : "none" }} />
      {status}
    </span>
  );
}

function ProjectCard({ p, idx }: { p: Project; idx: number }) {
  const [expanded, setExpanded] = useState(false);

  const bg = "#070710", surface = "#0d0d1a", border = "#1a1a2e";
  const text = "#e8e8f4", muted = "#5a5a7a";

  return (
    <FadeIn delay={idx * 0.1}>
      <div style={{ background: surface, border: `1px solid ${expanded ? p.color + "40" : border}`, borderRadius: 20, overflow: "hidden", transition: "all 0.3s", marginBottom: 24 }}>

        {/* Header */}
        <div style={{ padding: "32px 36px 24px", borderBottom: `1px solid ${border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: p.color, background: `${p.color}12`, border: `1px solid ${p.color}25`, borderRadius: 4, padding: "3px 8px", letterSpacing: 1, textTransform: "uppercase" }}>{p.tag}</span>
              <StatusBadge status={p.status} />
            </div>
            <span style={{ fontSize: 32, fontWeight: 900, color: p.color, opacity: 0.15, letterSpacing: -2 }}>{p.id}</span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -1, margin: "0 0 8px", color: text }}>{p.title}</h2>
          <p style={{ fontSize: 14, color: p.color, fontWeight: 600, margin: "0 0 20px", opacity: 0.9 }}>{p.tagline}</p>

          {/* Metrics */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            {p.metrics.map((m: { label: string; value: string }) => (
              <div key={m.label} style={{ background: `${p.color}08`, border: `1px solid ${p.color}18`, borderRadius: 10, padding: "10px 16px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: p.color }}>{m.value}</div>
                <div style={{ fontSize: 9, color: muted, marginTop: 2, letterSpacing: 0.5 }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Stack */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {p.stack.map((s: string) => (
              <span key={s} style={{ fontSize: 10, background: `${p.color}0e`, border: `1px solid ${p.color}1e`, color: p.color, borderRadius: 5, padding: "3px 8px", fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Problem */}
        <div style={{ padding: "24px 36px", borderBottom: `1px solid ${border}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: muted, textTransform: "uppercase", marginBottom: 10 }}>The Problem</div>
          <p style={{ fontSize: 13, color: muted, lineHeight: 1.85, margin: 0 }}>{p.problem}</p>
        </div>

        {/* Expand toggle */}
        <button onClick={() => setExpanded(!expanded)}
          style={{ width: "100%", background: "transparent", border: "none", padding: "16px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", color: p.color, fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>
          <span>{expanded ? "Hide technical detail" : "Read technical breakdown"}</span>
          <span style={{ fontSize: 18, transition: "transform 0.3s", transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>↓</span>
        </button>

        {/* Expanded content */}
        {expanded && (
          <div style={{ borderTop: `1px solid ${border}` }}>

            {/* Approach */}
            <div style={{ padding: "28px 36px", borderBottom: `1px solid ${border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: muted, textTransform: "uppercase", marginBottom: 20 }}>Technical Approach</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {p.approach.map((a: string, i: number) => (
                  <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: p.color, background: `${p.color}12`, borderRadius: 4, padding: "3px 7px", flexShrink: 0, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                    <p style={{ fontSize: 13, color: muted, lineHeight: 1.85, margin: 0 }}>{a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture */}
            <div style={{ padding: "28px 36px", borderBottom: `1px solid ${border}` }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: muted, textTransform: "uppercase", marginBottom: 20 }}>System Architecture</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                {p.architecture.map((a: { step: string; label: string; detail: string }, i: number) => (
                  <div key={i} style={{ background: `${p.color}06`, border: `1px solid ${p.color}15`, borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: p.color, marginBottom: 6, letterSpacing: 0.5 }}>Step {a.step}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: text, marginBottom: 4 }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: muted, lineHeight: 1.5 }}>{a.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dataset note if applicable */}
            {p.dataset && (
              <div style={{ padding: "16px 36px", borderBottom: `1px solid ${border}`, background: `${p.color}04` }}>
                <span style={{ fontSize: 11, color: muted }}>Dataset: <span style={{ color: p.color, fontWeight: 500 }}>{p.dataset}</span></span>
              </div>
            )}
          </div>
        )}

        {/* Footer links */}
        <div style={{ padding: "20px 36px", display: "flex", gap: 10, flexWrap: "wrap" }}>
          {p.githubUrl ? (
            <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
              style={{ background: "transparent", border: `1px solid ${p.color}35`, color: p.color, borderRadius: 8, padding: "8px 18px", fontSize: 11, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}>
              GitHub →
            </a>
          ) : (
            <span style={{ border: `1px solid ${border}`, color: muted, borderRadius: 8, padding: "8px 18px", fontSize: 11 }}>GitHub (soon)</span>
          )}
          {p.demoUrl ? (
            <a href={p.demoUrl} target="_blank" rel="noopener noreferrer"
              style={{ background: `${p.color}12`, border: `1px solid ${p.color}28`, color: p.color, borderRadius: 8, padding: "8px 18px", fontSize: 11, fontWeight: 600, textDecoration: "none", transition: "all 0.2s" }}>
              Live Demo →
            </a>
          ) : (
            <span style={{ background: `${p.color}06`, border: `1px solid ${border}`, color: muted, borderRadius: 8, padding: "8px 18px", fontSize: 11 }}>Demo (soon)</span>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

export default function ProjectsSite() {
  const [scrolled, setScrolled] = useState(false);
  const bg = "#070710", surface = "#0d0d1a", border = "#1a1a2e";
  const text = "#e8e8f4", muted = "#5a5a7a";
  const accent = "#6366f1", accent2 = "#8b5cf6";

  useEffect(() => {
    window.addEventListener("scroll", () => setScrolled(window.scrollY > 40));
  }, []);

  return (
    <div style={{ background: bg, color: text, fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh" }}>

      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -200, left: -200, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, #6366f115 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: 0, right: -200, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, #a855f710 0%, transparent 70%)" }} />
      </div>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 48px", background: scrolled ? "#0a0a0aee" : "transparent", backdropFilter: scrolled ? "blur(24px)" : "none", borderBottom: scrolled ? "1px solid #ffffff08" : "none", transition: "all 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 13, fontWeight: 700, color: "#e8e8f4", letterSpacing: 1 }}>LO<span style={{ color: "#22c55e" }}>_</span></span>
          <span style={{ width: 1, height: 16, background: "#ffffff15" }} />
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#5a5a7a", letterSpacing: 2, textTransform: "uppercase" }}>projects</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#22c55e", letterSpacing: 1 }}>● live</span>
          <span style={{ width: 1, height: 14, background: "#ffffff10" }} />
          <a href="https://lawrenceokolo1.github.io/portfolio" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#5a5a7a", textDecoration: "none", letterSpacing: 1, transition: "color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#e8e8f4"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#5a5a7a"; }}>
            portfolio ↗
          </a>
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "100px 48px 80px" }}>

        {/* Hero */}
        <FadeIn>
          <div style={{ marginBottom: 72 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#22c55e10", border: "1px solid #22c55e28", borderRadius: 100, padding: "5px 14px", marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>Active builds · 3 ML systems · 1 robotics collective</span>
            </div>
            <h1 style={{ fontSize: "clamp(34px, 5vw, 58px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1.08, margin: "0 0 16px" }}>
              Production AI.<br />
              <span style={{ background: `linear-gradient(135deg, ${accent}, ${accent2}, #ec4899)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Built. Deployed. Documented.</span>
            </h1>
            <p style={{ fontSize: 15, color: muted, lineHeight: 1.8, maxWidth: 560, margin: 0 }}>
              Three production ML systems and an open source robotics collective. Each project goes deeper than a tutorial — real datasets, real evaluation, real infrastructure, real deployment.
            </p>
          </div>
        </FadeIn>

        {/* Projects */}
        <div style={{ marginBottom: 80 }}>
          <FadeIn>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: muted, textTransform: "uppercase", marginBottom: 32 }}>ML Systems</div>
          </FadeIn>
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} p={p} idx={i} />)}
        </div>

        {/* Community */}
        <FadeIn>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: muted, textTransform: "uppercase", marginBottom: 32 }}>Open Source Community</div>
          <div style={{ background: surface, border: "1px solid #22c55e22", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ padding: "32px 36px 24px", borderBottom: `1px solid ${border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", background: "#22c55e12", border: "1px solid #22c55e25", borderRadius: 4, padding: "3px 8px", letterSpacing: 1, textTransform: "uppercase" }}>{COMMUNITY.tag}</span>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#22c55e10", border: "1px solid #22c55e25", borderRadius: 100, padding: "3px 10px" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
                  <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>Active</span>
                </div>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.8, margin: "0 0 8px" }}>{COMMUNITY.title}</h2>
              <p style={{ fontSize: 13, color: "#22c55e", fontWeight: 600, margin: "0 0 20px", opacity: 0.85 }}>{COMMUNITY.tagline}</p>
              <p style={{ fontSize: 13, color: muted, lineHeight: 1.85, margin: "0 0 24px" }}>{COMMUNITY.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {COMMUNITY.focus.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: "#22c55e", background: "#22c55e12", borderRadius: 4, padding: "3px 7px", flexShrink: 0, marginTop: 2 }}>{String(i + 1).padStart(2, "0")}</span>
                    <p style={{ fontSize: 13, color: muted, lineHeight: 1.8, margin: 0 }}>{f}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: "20px 36px", display: "flex", gap: 10 }}>
              <a href={COMMUNITY.githubUrl} target="_blank" rel="noopener noreferrer"
                style={{ background: "transparent", border: "1px solid #22c55e35", color: "#22c55e", borderRadius: 8, padding: "8px 18px", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>
                GitHub →
              </a>
              <a href={COMMUNITY.demoUrl} target="_blank" rel="noopener noreferrer"
                style={{ background: "#22c55e12", border: "1px solid #22c55e28", color: "#22c55e", borderRadius: 8, padding: "8px 18px", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>
                Session Recap →
              </a>
            </div>
          </div>
        </FadeIn>

        {/* Footer */}
        <FadeIn delay={0.2}>
          <div style={{ marginTop: 80, paddingTop: 32, borderTop: `1px solid ${border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: muted, letterSpacing: 1 }}>Lawrence Okolo · Lead AI Engineer · Vancouver</span>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { l: "GitHub", h: "https://github.com/lawrenceokolo1" },
                  { l: "LinkedIn", h: "https://www.linkedin.com/in/lawrence-okolo" },
                  { l: "HuggingFace", h: "https://huggingface.co/Lawrence-okolo" },
                ].map(({ l, h }) => (
                  <a key={l} href={h} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: muted, textDecoration: "none", fontWeight: 500, letterSpacing: 0.5, transition: "color 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#e8e8f4"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = muted; }}>
                    {l} ↗
                  </a>
                ))}
              </div>
            </div>
            {/* Portfolio link — prominent at bottom */}
            <a href="https://lawrenceokolo1.github.io/portfolio" target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d0d1a", border: "1px solid #1a1a2e", borderRadius: 12, padding: "18px 24px", textDecoration: "none", transition: "border-color 0.2s, background 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f140"; e.currentTarget.style.background = "#111128"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1a2e"; e.currentTarget.style.background = "#0d0d1a"; }}>
              <div>
                <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#5a5a7a", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>Full Portfolio</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e8e8f4", letterSpacing: -0.3 }}>lawrenceokolo1.github.io/portfolio</div>
                <div style={{ fontSize: 11, color: "#5a5a7a", marginTop: 3 }}>Experience · Skills · Contact</div>
              </div>
              <span style={{ fontSize: 22, color: "#6366f1" }}>↗</span>
            </a>
          </div>
        </FadeIn>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #070710; }
        ::-webkit-scrollbar-thumb { background: #6366f128; border-radius: 2px; }
      `}</style>
    </div>
  );
}
