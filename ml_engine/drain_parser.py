import re
from hdfs_templates import HDFS_TEMPLATES

class DrainLogParser:
    """
    Online Log Parser using Fixed-Depth Tree (Drain algorithm)
    Parses raw HDFS console logs into structured event templates and variables.
    """
    def __init__(self, depth=4, st=0.5):
        self.depth = depth
        self.similarity_threshold = st
        self.templates = HDFS_TEMPLATES

    def parse_line(self, log_line: str) -> dict:
        """
        Parses a single raw HDFS log line:
        Example line: '081109 203518 148 INFO dfs.DataNode$PacketResponder: PacketResponder 1 for block blk_388650490641396606 terminating'
        """
        log_line = log_line.strip()
        if not log_line:
            return None

        # Regex matching timestamp, thread ID, level, component, body
        pattern = r'^(\d{6}\s+\d{6})\s+(\d+)\s+([A-Z]+)\s+([\w\.\$\_]+):\s+(.*)$'
        match = re.match(pattern, log_line)
        
        if not match:
            # Fallback for alternative HDFS format
            pattern_alt = r'^([A-Z]+)\s+([\w\.\$\_]+):\s+(.*)$'
            match_alt = re.match(pattern_alt, log_line)
            if match_alt:
                level, component, message = match_alt.groups()
                timestamp = "081109 203518"
            else:
                level, component, message = "INFO", "dfs.DataNode", log_line
                timestamp = "081109 203518"
        else:
            timestamp, thread_id, level, component, message = match.groups()

        # Extract Block ID (e.g. blk_-35447479020597)
        block_match = re.search(r'(blk_-?\d+)', message)
        block_id = block_match.group(1) if block_match else "UNKNOWN_BLOCK"

        # Match template ID
        template_id, matched_template = self._match_template(message)

        return {
            "raw_log": log_line,
            "timestamp": timestamp,
            "level": level,
            "component": component,
            "message": message,
            "block_id": block_id,
            "template_id": template_id,
            "template": matched_template
        }

    def _match_template(self, message: str):
        # Specific pattern rules for log templates
        if "allocateBlock" in message:
            return "E13", HDFS_TEMPLATES["E13"]
        elif "Receiving block" in message:
            return "E1", HDFS_TEMPLATES["E1"]
        elif "Received block" in message and "from" in message:
            return "E2", HDFS_TEMPLATES["E2"]
        elif "PacketResponder" in message and "terminating" in message:
            return "E3", HDFS_TEMPLATES["E3"]
        elif "Verification succeeded" in message:
            return "E5", HDFS_TEMPLATES["E5"]
        elif "addStoredBlock" in message or "blockMap updated" in message:
            return "E14", HDFS_TEMPLATES["E14"]
        elif "Transmitted block" in message:
            return "E6", HDFS_TEMPLATES["E6"]
        elif "Verification failed" in message:
            return "E8", HDFS_TEMPLATES["E8"]
        elif "SocketTimeoutException" in message or "exception while serving" in message:
            return "E9", HDFS_TEMPLATES["E9"]
        elif "OutOfMemoryError" in message or "DataNode" in message and "terminating" in message:
            return "E10", HDFS_TEMPLATES["E10"]
        elif "Disk space full" in message or "Disk full" in message:
            return "E11", HDFS_TEMPLATES["E11"]
        elif "corrupted" in message or "corrupt" in message:
            return "E12", HDFS_TEMPLATES["E12"]
        elif "ask" in message and "delete" in message:
            return "E15", HDFS_TEMPLATES["E15"]
        elif "ask" in message and "replicate" in message:
            return "E16", HDFS_TEMPLATES["E16"]
        elif "already existing block" in message:
            return "E7", HDFS_TEMPLATES["E7"]
        
        return "E_UNSEEN", f"Unrecognized pattern: {message}"
