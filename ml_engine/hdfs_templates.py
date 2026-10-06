"""
HDFS Log Templates and Parsing Definitions
Based on Loghub benchmark & DeepLog paper specifications
"""

HDFS_TEMPLATES = {
    "E1": "Receiving block {*} src: {*} dest: {*}",
    "E2": "Received block {*} of size {*} from {*}",
    "E3": "PacketResponder {*} for block {*} terminating",
    "E4": "Received block {*} src: {*} dest: {*} of size {*}",
    "E5": "Verification succeeded for block {*}",
    "E6": "Transmitted block {*} to {*}",
    "E7": "Adding an already existing block {*} to failed listing",
    "E8": "Verification failed for block {*}: Checksum Error",
    "E9": "Got exception while serving block {*} to {}: java.net.SocketTimeoutException",
    "E10": "DataNode {*} terminating: java.lang.OutOfMemoryError",
    "E11": "BlockMap update failed for block {*}: Disk space full",
    "E12": "NameNode: Block {*} corrupted, re-replication queued",
    "E13": "BLOCK* NameSystem.allocateBlock: {*}",
    "E14": "BLOCK* NameSystem.addStoredBlock: blockMap updated: {*} is added to {*} size {*}",
    "E15": "BLOCK* ask {*} to delete {*}",
    "E16": "BLOCK* ask {*} to replicate {*} to {*}"
}

# Normal HDFS execution workflows (sequence of template IDs per block ID)
NORMAL_SEQUENCES = [
    ["E13", "E1", "E2", "E3", "E5", "E14"],
    ["E13", "E1", "E4", "E2", "E3", "E5", "E14", "E6"],
    ["E13", "E1", "E2", "E3", "E14"]
]
