import os, json, requests, streamlit as st

# ---------------------- PAGE CONFIG -----------------------------
st.set_page_config(
    page_title="GovAudit AI",
    page_icon="🛡️",
    layout="wide"
)

# ---------------------- CUSTOM CSS ------------------------------
st.markdown("""
<style>

body {
    background: linear-gradient(135deg, #0a0f24, #091327, #04060f);
    color: white !important;
}

/* --- Glowing Buttons --- */
.stButton > button {
    background: #0f82ff;
    color: white;
    border: 1px solid #83c0ff;
    padding: 10px 20px;
    font-size: 18px;
    border-radius: 10px;
    box-shadow: 0 0 10px #0f82ff;
    transition: 0.3s ease;
}
.stButton > button:hover {
    background: #48a3ff;
    box-shadow: 0 0 20px #48a3ff;
}

/* --- Upload Glow Box --- */
.uploadbox {
    padding: 20px;
    border-radius: 12px;
    background: rgba(255,255,255,0.05);
    border: 2px dashed #3c9df7;
    box-shadow: 0 0 15px #0f82ff;
}

/* --- Risk Animation --- */
.safe-box {
    padding: 20px;
    border-radius: 12px;
    background: rgba(0,255,0,0.08);
    border: 2px solid #0aff63;
    color: #0aff63;
    box-shadow: 0 0 25px #0aff63;
    animation: pulseGreen 2s infinite;
}

.risky-box {
    padding: 20px;
    border-radius: 12px;
    background: rgba(255,0,0,0.08);
    border: 2px solid #ff2e2e;
    color: #ff2e2e;
    box-shadow: 0 0 25px #ff2e2e;
    animation: pulseRed 1.5s infinite;
}

@keyframes pulseGreen {
  0% { box-shadow: 0 0 10px #00ff55; }
  50% { box-shadow: 0 0 30px #00ff55; }
  100% { box-shadow: 0 0 10px #00ff55; }
}
@keyframes pulseRed {
  0% { box-shadow: 0 0 10px #ff2e2e; }
  50% { box-shadow: 0 0 30px #ff2e2e; }
  100% { box-shadow: 0 0 10px #ff2e2e; }
}

/* --- Number Animation --- */
.num {
  font-size: 40px;
  font-weight: bold;
  animation: grow 1.4s ease-out forwards;
}
@keyframes grow {
  from { font-size: 5px; opacity: 0; }
  to { font-size: 40px; opacity: 1; }
}

</style>
""", unsafe_allow_html=True)


# ---------------------- API CONFIG ------------------------------
API_URL = os.getenv("GOVAUDIT_API_URL", "http://127.0.0.1:8000")

st.title("🛡️ GovAudit AI — Pro Demo")
st.caption("FastAPI + Streamlit + SQLite + OCR-ready + Fraud Rules")

# ---------------------- SIDEBAR ------------------------------
with st.sidebar:
    st.header("Settings")

    api_url = st.text_input("API URL", value=API_URL)
    try:
        r = requests.get(f"{api_url}/health/")
        if r.ok:
            st.success("Backend is up ✅")
        else:
            st.error("Backend not OK ❌")
    except Exception as e:
        st.error(f"Cannot reach backend: {e}")

    st.markdown("---")
    st.caption("Start backend:")
    st.code("uvicorn src.api.main:app --reload --port 8000", language="bash")


# ---------------------- TABS ------------------------------
tab1, tab2, tab3 = st.tabs([
    "📤 Upload & Analyze",
    "📁 Documents",
    "⚙️ Raw Predict"
])


# ==========================================================
# ---------------------- TAB 1 -----------------------------
# ==========================================================
with tab1:

    st.subheader("Upload documents")

    st.markdown('<div class="uploadbox">', unsafe_allow_html=True)
    uploaded_files = st.file_uploader(
        "Choose one or more files",
        type=["txt","pdf","jpg","jpeg","png","tiff"],
        accept_multiple_files=True
    )
    st.markdown('</div>', unsafe_allow_html=True)

    if st.button("Upload selected"):
        if not uploaded_files:
            st.warning("Please select at least one file.")
        else:
            saved_paths = []
            for up in uploaded_files:
                try:
                    resp = requests.post(
                        f"{api_url}/v1/ingest/upload",
                        files={"file": (up.name, up.getvalue())}
                    )

                    if resp.ok and resp.json().get("ok"):
                        saved_paths.append(resp.json()["path"])
                    else:
                        st.error(f"Upload failed for {up.name}: {resp.text}")

                except Exception as e:
                    st.error(f"Upload error: {e}")

            if saved_paths:
                st.session_state["uploaded_paths"] = saved_paths
                st.session_state["last_path"] = saved_paths[-1]
                st.success(f"Uploaded {len(saved_paths)} files successfully.")

    # ---------------- Single File Analysis ------------------
    st.markdown("### Analyze Single File")

    default_path = st.session_state.get("last_path", "")
    file_path = st.text_input("Enter file path", value=default_path)

    if st.button("Run Analysis (single)"):

        try:
            r = requests.post(f"{api_url}/v1/predict", json={"file_path": file_path})
            out = r.json()

            if not out.get("ok"):
                st.error("Analysis failed!")
            else:
                st.success("Analysis complete!")

                fields = out["extraction"]["fields"]
                risk = out["risk"]
                score = risk.get("score", 0)   # << FIXED HERE

                c1, c2 = st.columns(2)

                with c1:
                    st.markdown("### Extracted Fields")
                    st.json(fields)

                with c2:
                    st.markdown("### Risk Evaluation")

                    if score >= 60:
                        st.markdown(f"<div class='risky-box'>⚠️ High Risk Detected<br><span class='num'>{score}</span></div>", unsafe_allow_html=True)
                    else:
                        st.markdown(f"<div class='safe-box'>🟢 Safe Document<br><span class='num'>{score}</span></div>", unsafe_allow_html=True)

                raw_text = out["extraction"].get("raw_text", "")
                if raw_text:
                    st.markdown("### Raw Text")
                    st.code(raw_text[:4000])

        except Exception as e:
            st.error(f"Predict error: {e}")

    # ---------------- Batch Analysis ------------------
    st.markdown("### Batch Analysis")

    paths = st.session_state.get("uploaded_paths", [])

    if st.button("Run Analysis (batch)"):

        if not paths:
            st.warning("No uploaded files.")
        else:
            records = []
            for p in paths:
                try:
                    r = requests.post(f"{api_url}/v1/predict", json={"file_path": p})
                    out = r.json()
                    fields = out["extraction"]["fields"]
                    risk = out["risk"]

                    records.append({
                        "file": p,
                        "invoice": fields.get("invoice_number",""),
                        "vendor": fields.get("vendor",""),
                        "total": fields.get("total",""),
                        "flags": ", ".join(risk.get("flags", [])),
                        "risk_score": risk.get("score", 0)
                    })

                except:
                    pass

            st.dataframe(records, use_container_width=True)




# ==========================================================
# ---------------------- TAB 2 -----------------------------
# ==========================================================
with tab2:
    st.subheader("Ingested Documents")

    try:
        r = requests.get(f"{api_url}/v1/ingest/docs")
        docs = r.json().get("docs", [])
        st.dataframe(docs, use_container_width=True)
    except Exception as e:
        st.error(f"Docs fetch error: {e}")


# ==========================================================
# ---------------------- TAB 3 -----------------------------
# ==========================================================
with tab3:
    st.subheader("Raw /v1/predict Call")

    path_raw = st.text_input("File Path", value="data/raw/sample_invoice.txt")

    if st.button("Call predict"):
        try:
            r = requests.post(f"{api_url}/v1/predict", json={"file_path": path_raw})
            st.code(json.dumps(r.json(), indent=2))
        except Exception as e:
            st.error(f"Error: {e}")
