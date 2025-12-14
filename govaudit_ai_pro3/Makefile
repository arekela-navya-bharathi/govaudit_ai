.PHONY: run ui ingest
run:
	python3 -m uvicorn src.api.main:app --reload --port 8000
ui:
	streamlit run streamlit_app.py
ingest:
	python3 src/pipelines/ingest.py --source data/sample --limit 2
