const EventEmitter = require('events');

class LogStreamer extends EventEmitter {
  constructor() {
    super();
    this.isStreaming = false;
    this.intervalId = null;
    this.streamSpeedMs = 1200;
    this.activeBlockId = this.generateBlockId();
    this.sequenceStep = 0;
    this.mode = 'NORMAL'; // 'NORMAL', 'DISK_FULL', 'NETWORK_TIMEOUT', 'DATANODE_CRASH', 'CHECKSUM_FAIL'
  }

  generateBlockId() {
    const randomNum = Math.floor(10000000000000 + Math.random() * 90000000000000);
    return `blk_${randomNum}`;
  }

  setMode(newMode) {
    this.mode = newMode;
    this.activeBlockId = this.generateBlockId();
    this.sequenceStep = 0;
    console.log(`[LogStreamer] Switched mode to: ${newMode} (New Block: ${this.activeBlockId})`);
  }

  start() {
    if (this.isStreaming) return;
    this.isStreaming = true;
    this.intervalId = setInterval(() => this.emitNextLogLine(), this.streamSpeedMs);
    console.log('[LogStreamer] Live log stream started.');
  }

  stop() {
    if (!this.isStreaming) return;
    this.isStreaming = false;
    if (this.intervalId) clearInterval(this.intervalId);
    console.log('[LogStreamer] Live log stream stopped.');
  }

  getNextLogLineForCurrentState() {
    const blk = this.activeBlockId;
    const ip = `10.250.${Math.floor(Math.random() * 200 + 1)}.${Math.floor(Math.random() * 250 + 1)}`;
    const port = Math.floor(50010 + Math.random() * 100);
    const dateStr = "081109 " + new Date().toTimeString().split(' ')[0].replace(/:/g, '').slice(0,6);

    let logsSequence = [];

    if (this.mode === 'NORMAL') {
      logsSequence = [
        `${dateStr} 142 INFO dfs.FSNamesystem: BLOCK* NameSystem.allocateBlock: /user/hadoop/data/file_${blk}.dat. ${blk}`,
        `${dateStr} 143 INFO dfs.DataNode$DataXceiver: Receiving block ${blk} src: /${ip}:${port} dest: /10.250.1.12:50010`,
        `${dateStr} 144 INFO dfs.DataNode$DataXceiver: Received block ${blk} of size 67108864 from /${ip}:${port}`,
        `${dateStr} 145 INFO dfs.DataNode$PacketResponder: PacketResponder 2 for block ${blk} terminating`,
        `${dateStr} 146 INFO dfs.DataNode$BlockScanner: Verification succeeded for block ${blk}`,
        `${dateStr} 147 INFO dfs.FSNamesystem: BLOCK* NameSystem.addStoredBlock: blockMap updated: ${blk} is added to ${ip}:50010 size 67108864`
      ];
    } else if (this.mode === 'DISK_FULL') {
      logsSequence = [
        `${dateStr} 142 INFO dfs.FSNamesystem: BLOCK* NameSystem.allocateBlock: /user/hadoop/data/file_${blk}.dat. ${blk}`,
        `${dateStr} 143 INFO dfs.DataNode$DataXceiver: Receiving block ${blk} src: /${ip}:${port} dest: /10.250.1.12:50010`,
        `${dateStr} 144 INFO dfs.DataNode$DataXceiver: Received block ${blk} of size 67108864 from /${ip}:${port}`,
        `${dateStr} 148 ERROR dfs.DataNode$BlockMap: BlockMap update failed for block ${blk}: Disk space full on volume /data/hdfs/current`,
        `${dateStr} 149 WARN dfs.FSNamesystem: BLOCK* ask ${ip}:${port} to delete ${blk}`
      ];
    } else if (this.mode === 'NETWORK_TIMEOUT') {
      logsSequence = [
        `${dateStr} 142 INFO dfs.FSNamesystem: BLOCK* NameSystem.allocateBlock: /user/hadoop/data/file_${blk}.dat. ${blk}`,
        `${dateStr} 143 INFO dfs.DataNode$DataXceiver: Receiving block ${blk} src: /${ip}:${port} dest: /10.250.1.12:50010`,
        `${dateStr} 150 ERROR dfs.DataNode$DataXceiver: Got exception while serving block ${blk} to /${ip}:${port}: java.net.SocketTimeoutException: 60000 millis timeout while waiting for channel to be ready for read`,
        `${dateStr} 151 WARN dfs.DataNode$PacketResponder: PacketResponder 1 for block ${blk} terminating with exception`
      ];
    } else if (this.mode === 'DATANODE_CRASH') {
      logsSequence = [
        `${dateStr} 142 INFO dfs.FSNamesystem: BLOCK* NameSystem.allocateBlock: /user/hadoop/data/file_${blk}.dat. ${blk}`,
        `${dateStr} 143 INFO dfs.DataNode$DataXceiver: Receiving block ${blk} src: /${ip}:${port} dest: /10.250.1.12:50010`,
        `${dateStr} 155 FATAL dfs.DataNode: DataNode ${ip}:${port} terminating: java.lang.OutOfMemoryError: Java heap space`,
        `${dateStr} 156 WARN dfs.FSNamesystem: BLOCK* ask ${ip}:${port} to replicate ${blk} to 10.250.2.14:50010`
      ];
    } else if (this.mode === 'CHECKSUM_FAIL') {
      logsSequence = [
        `${dateStr} 142 INFO dfs.FSNamesystem: BLOCK* NameSystem.allocateBlock: /user/hadoop/data/file_${blk}.dat. ${blk}`,
        `${dateStr} 143 INFO dfs.DataNode$DataXceiver: Receiving block ${blk} src: /${ip}:${port} dest: /10.250.1.12:50010`,
        `${dateStr} 144 INFO dfs.DataNode$DataXceiver: Received block ${blk} of size 67108864 from /${ip}:${port}`,
        `${dateStr} 160 ERROR dfs.DataNode$BlockScanner: Verification failed for block ${blk}: Checksum Error expected 0xa8f23 but calculated 0x00000`,
        `${dateStr} 161 WARN dfs.FSNamesystem: NameNode: Block ${blk} corrupted, re-replication queued`
      ];
    }

    if (this.sequenceStep >= logsSequence.length) {
      // Completed block sequence, advance to next block ID!
      this.activeBlockId = this.generateBlockId();
      this.sequenceStep = 0;
      return this.getNextLogLineForCurrentState();
    }

    const logLine = logsSequence[this.sequenceStep];
    this.sequenceStep++;
    return { logLine, blockId: blk, mode: this.mode };
  }

  emitNextLogLine() {
    const item = this.getNextLogLineForCurrentState();
    this.emit('log', item);
  }
}

module.exports = LogStreamer;
