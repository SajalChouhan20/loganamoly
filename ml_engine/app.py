from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from drain_parser import DrainLogParser
from deeplog_model import DeepLogAnomalyDetector

app = FastAPI(
    title="Intelligent Log Monitoring ML Microservice",
    description="FastAPI Service for Drain Log Parsing and DeepLog Sequence Anomaly Detection",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

parser = DrainLogParser()
detector = DeepLogAnomalyDetector()

class ParseRequest(BaseModel):
    log_line: str

class EvaluateBlockRequest(BaseModel):
    block_id: str
    log_lines: List[str]

class EvaluateParsedEventsRequest(BaseModel):
    block_id: str
    events: List[Dict[str, Any]]

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "DeepLog Anomaly Detection Engine",
        "dataset": "Loghub HDFS",
        "version": "1.0.0"
    }

@app.post("/api/parse")
def parse_log(req: ParseRequest):
    parsed = parser.parse_line(req.log_line)
    if not parsed:
        raise HTTPException(status_code=400, detail="Invalid log line")
    return parsed

@app.post("/api/predict")
def evaluate_sequence(req: EvaluateBlockRequest):
    parsed_events = [parser.parse_line(line) for line in req.log_lines if line.strip()]
    result = detector.evaluate_block_sequence(req.block_id, parsed_events)
    return result

@app.post("/api/evaluate-events")
def evaluate_events(req: EvaluateParsedEventsRequest):
    result = detector.evaluate_block_sequence(req.block_id, req.events)
    return result

@app.get("/api/metrics")
def get_model_metrics():
    return detector.metrics

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
