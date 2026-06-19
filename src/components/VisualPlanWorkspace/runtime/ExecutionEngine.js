export class ExecutionEngine {
  constructor(plans, connections, language = 'c', forcedAlgorithm = null) {
    this.plans = plans;
    this.connections = connections;
    this.language = language;
    this.variables = {};
    this.data = {
      array: null,
      variables: {},
      executionHistory: [],
      currentStep: 0
    };
    this.executionSteps = [];
    this.currentStepIndex = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.interval = null;
    this.callbacks = { onDataUpdate: null, onComplete: null };
    this.forcedAlgorithm = forcedAlgorithm;
    this.detectAlgorithmFromPlans();
  }

  detectAlgorithmFromPlans() {
    if (this.forcedAlgorithm) {
      this.algorithm = this.forcedAlgorithm;
      return;
    }
    
    const planNames = this.plans.map(p => p.name);
    
    if (planNames.includes('Insertion Plan')) {
      this.algorithm = 'insertionSort';
    } else if (planNames.includes('LSSE Plan')) {
      this.algorithm = 'selectionSort';
    } else if (planNames.includes('CAE Plan')) {
      this.algorithm = 'exchangeSort';
    } else if (planNames.includes('LSSE Plan') && planNames.includes('CAE Plan')) {
      this.algorithm = 'exSelSort';
    } else {
      this.algorithm = 'custom';
    }
  }

  initialize(inputData = null) {
    if (inputData) {
      if (Array.isArray(inputData)) {
        this.data.array = [...inputData];
      } else {
        this.data.variables = { ...inputData };
      }
    } else {
      this.data.array = [64, 25, 12, 22, 11, 35, 8, 42];
    }
    
    this.data.variables = {
      i: 0,
      j: 0,
      key: null,
      temp: null,
      smallest: null,
      location: 0,
      sum: 0,
      count: 0,
      n: this.data.array ? this.data.array.length : 0,
      swaps: 0,
      comparisons: 0
    };
    
    this.data.currentPass = 0;
    this.data.currentIndex = 0;
    this.data.smallestIndex = -1;
    this.data.scanIndex = 0;
    this.data.sortedIndices = [];
    this.data.swaps = 0;
    this.data.comparisons = 0;
    
    this.executionSteps = this.buildExecutionSteps();
    this.currentStepIndex = 0;
    this.currentStep = null;
    
    return this.data;
  }

  buildExecutionSteps() {
    if (this.algorithm === 'selectionSort') {
      return this.generateSelectionSortSteps();
    } else if (this.algorithm === 'exchangeSort') {
      return this.generateExchangeSortSteps();
    } else if (this.algorithm === 'exSelSort') {
      return this.generateExSelSortSteps();
    } else if (this.algorithm === 'insertionSort') {
      return this.generateInsertionSortSteps();
    }
    return this.generateCustomSteps();
  }

  generateInsertionSortSteps() {
    const steps = [];
    const n = this.data.array.length;
    const arr = [...this.data.array];
    let compareCount = 0;
    let swapCount = 0;
    
    steps.push({
      type: 'init',
      data: [...arr],
      currentPass: 0,
      currentIndex: 0,
      message: `Starting Insertion Sort. Building sorted array from left to right.`,
      sortedIndices: [0]
    });
    
    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      
      steps.push({
        type: 'pass_start',
        data: [...arr],
        currentPass: i,
        currentIndex: i,
        keyValue: key,
        message: `Pass ${i}: Taking element ${key} at position ${i} to insert into sorted portion.`,
        sortedIndices: Array.from({ length: i }, (_, idx) => idx)
      });
      
      while (j >= 0 && arr[j] > key) {
        compareCount++;
        steps.push({
          type: 'compare',
          data: [...arr],
          currentPass: i,
          scanIndex: j,
          compareFrom: j,
          compareTo: j + 1,
          message: `Comparing ${arr[j]} > ${key} - true, need to shift right.`,
          comparisons: compareCount,
          sortedIndices: Array.from({ length: i }, (_, idx) => idx)
        });
        
        swapCount++;
        steps.push({
          type: 'swap_start',
          data: [...arr],
          currentPass: i,
          swapFrom: j,
          swapTo: j + 1,
          message: `Shifting ${arr[j]} to position ${j + 1}`,
          comparisons: compareCount
        });
        
        arr[j + 1] = arr[j];
        
        steps.push({
          type: 'swap_end',
          data: [...arr],
          currentPass: i,
          swaps: swapCount,
          message: `Element ${arr[j]} shifted right`,
          sortedIndices: Array.from({ length: i }, (_, idx) => idx)
        });
        
        j--;
      }
      
      arr[j + 1] = key;
      compareCount++;
      steps.push({
        type: 'insert',
        data: [...arr],
        currentPass: i,
        insertIndex: j + 1,
        insertValue: key,
        message: `Inserted ${key} at position ${j + 1}`,
        comparisons: compareCount,
        swaps: swapCount,
        sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx)
      });
    }
    
    steps.push({
      type: 'complete',
      data: [...arr],
      message: 'Insertion Sort complete! Array is fully sorted.',
      sortedIndices: Array.from({ length: n }, (_, idx) => idx)
    });
    
    return steps;
  }

  generateSelectionSortSteps() {
    const steps = [];
    const n = this.data.array.length;
    const arr = [...this.data.array];
    let compareCount = 0;
    let swapCount = 0;
    
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      
      steps.push({
        type: 'pass_start',
        data: [...arr],
        currentPass: i,
        smallestIndex: minIdx,
        scanIndex: i + 1,
        message: `Pass ${i + 1}: Finding smallest element from position ${i}`,
        sortedIndices: Array.from({ length: i }, (_, idx) => idx)
      });
      
      for (let j = i + 1; j < n; j++) {
        compareCount++;
        steps.push({
          type: 'compare',
          data: [...arr],
          currentPass: i,
          smallestIndex: minIdx,
          scanIndex: j,
          message: `Comparing ${arr[minIdx]} and ${arr[j]}`,
          comparisons: compareCount
        });
        
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            type: 'new_smallest',
            data: [...arr],
            currentPass: i,
            smallestIndex: minIdx,
            scanIndex: j,
            message: `Found new smallest: ${arr[minIdx]} at position ${minIdx}`,
            comparisons: compareCount
          });
        }
      }
      
      if (minIdx !== i) {
        swapCount++;
        steps.push({
          type: 'swap_start',
          data: [...arr],
          currentPass: i,
          smallestIndex: minIdx,
          swapFrom: minIdx,
          swapTo: i,
          message: `Swapping ${arr[i]} and ${arr[minIdx]}`,
          comparisons: compareCount
        });
        
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        
        steps.push({
          type: 'swap_end',
          data: [...arr],
          currentPass: i + 1,
          smallestIndex: -1,
          scanIndex: i + 2,
          message: `${arr[i]} now in correct position`,
          swaps: swapCount,
          sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx)
        });
      }
    }
    
    steps.push({
      type: 'complete',
      data: [...arr],
      message: 'Sorting complete!',
      sortedIndices: Array.from({ length: n }, (_, idx) => idx)
    });
    
    return steps;
  }

  generateExchangeSortSteps() {
    const steps = [];
    const n = this.data.array.length;
    const arr = [...this.data.array];
    let swapCount = 0;
    let compareCount = 0;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        compareCount++;
        steps.push({
          type: 'compare',
          data: [...arr],
          currentPass: i,
          scanIndex: j,
          message: `Comparing ${arr[j]} and ${arr[j + 1]}`,
          comparisons: compareCount,
          sortedIndices: Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx)
        });
        
        if (arr[j] > arr[j + 1]) {
          swapCount++;
          steps.push({
            type: 'swap_start',
            data: [...arr],
            currentPass: i,
            scanIndex: j,
            message: `Swapping ${arr[j]} and ${arr[j + 1]}`,
            comparisons: compareCount
          });
          
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          
          steps.push({
            type: 'swap_end',
            data: [...arr],
            currentPass: i,
            swaps: swapCount,
            message: `Swap complete`,
            sortedIndices: Array.from({ length: i + 1 }, (_, idx) => n - 1 - idx)
          });
        }
      }
    }
    
    steps.push({
      type: 'complete',
      data: [...arr],
      message: 'Sorting complete!',
      sortedIndices: Array.from({ length: n }, (_, idx) => idx)
    });
    
    return steps;
  }

  generateExSelSortSteps() {
    const steps = [];
    const n = this.data.array.length;
    const arr = [...this.data.array];
    let swapCount = 0;
    let compareCount = 0;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        compareCount++;
        steps.push({
          type: 'compare',
          data: [...arr],
          currentPass: i,
          scanIndex: j,
          message: `Exchange: comparing ${arr[j]} and ${arr[j + 1]}`,
          comparisons: compareCount
        });
        
        if (arr[j] > arr[j + 1]) {
          swapCount++;
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            type: 'swap_end',
            data: [...arr],
            swaps: swapCount,
            message: `Exchange swap complete`,
            comparisons: compareCount
          });
        }
      }
      
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        compareCount++;
        steps.push({
          type: 'compare',
          data: [...arr],
          currentPass: i,
          smallestIndex: minIdx,
          scanIndex: j,
          message: `Selection: comparing ${arr[minIdx]} and ${arr[j]}`,
          comparisons: compareCount
        });
        
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          steps.push({
            type: 'new_smallest',
            data: [...arr],
            smallestIndex: minIdx,
            message: `New smallest found: ${arr[minIdx]}`,
            comparisons: compareCount
          });
        }
      }
      
      if (minIdx !== i) {
        swapCount++;
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        steps.push({
          type: 'swap_end',
          data: [...arr],
          currentPass: i + 1,
          swaps: swapCount,
          message: `Placed ${arr[i]} in correct position`,
          comparisons: compareCount,
          sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx)
        });
      }
    }
    
    steps.push({
      type: 'complete',
      data: [...arr],
      message: 'ExSel Sort complete!',
      sortedIndices: Array.from({ length: n }, (_, idx) => idx)
    });
    
    return steps;
  }

  generateCustomSteps() {
    const steps = [];
    const planMap = new Map(this.plans.map(p => [p.id, p]));
    const connectionMap = new Map();
    
    this.connections.forEach(conn => {
      if (!connectionMap.has(conn.from)) {
        connectionMap.set(conn.from, []);
      }
      connectionMap.get(conn.from).push(conn);
    });
    
    const hasIncoming = new Set(this.connections.map(c => c.to));
    const startPlans = this.plans.filter(p => !hasIncoming.has(p.id));
    
    const traverse = (planId, visited = new Set()) => {
      if (visited.has(planId)) return [];
      visited.add(planId);
      
      const plan = planMap.get(planId);
      if (!plan) return [];
      
      const result = [{
        type: 'plan_execute',
        planId: plan.id,
        planName: plan.name,
        message: `Executing: ${plan.name}`
      }];
      
      const outgoing = connectionMap.get(planId) || [];
      for (const conn of outgoing) {
        const nextSteps = traverse(conn.to, visited);
        if (conn.mode === 'appended') {
          result.push(...nextSteps);
        } else if (conn.mode === 'embedded') {
          result.push({
            type: 'embed_enter',
            message: `Entering embedded: ${planMap.get(conn.to)?.name}`
          });
          result.push(...nextSteps);
          result.push({
            type: 'embed_exit',
            message: `Exiting embedded: ${planMap.get(conn.to)?.name}`
          });
        }
      }
      
      return result;
    };
    
    for (const start of startPlans) {
      steps.push(...traverse(start.id));
    }
    
    if (steps.length === 0 && this.plans.length > 0) {
      for (const plan of this.plans) {
        steps.push({
          type: 'plan_execute',
          planId: plan.id,
          planName: plan.name,
          message: `Executing: ${plan.name}`
        });
      }
    }
    
    steps.push({
      type: 'complete',
      message: 'Execution complete'
    });
    
    return steps;
  }

  start() {
    if (this.executionSteps.length === 0) {
      if (this.callbacks.onComplete) {
        this.callbacks.onComplete({ error: 'No execution steps generated' });
      }
      return;
    }
    
    this.isRunning = true;
    this.isPaused = false;
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => this.step(), 500);
  }

  step() {
    if (this.isPaused) return;
    
    if (this.currentStepIndex < this.executionSteps.length) {
      const step = this.executionSteps[this.currentStepIndex];
      this.applyStep(step);
      this.currentStep = step;
      
      if (this.callbacks.onDataUpdate) {
        this.callbacks.onDataUpdate(this.data, step);
      }
      
      this.currentStepIndex++;
      return step;
    } else {
      this.complete();
    }
    return null;
  }

  applyStep(step) {
    if (step.data) {
      this.data.array = [...step.data];
    }
    if (step.currentPass !== undefined) {
      this.data.currentPass = step.currentPass;
    }
    if (step.currentIndex !== undefined) {
      this.data.currentIndex = step.currentIndex;
    }
    if (step.keyValue !== undefined) {
      this.data.keyValue = step.keyValue;
    }
    if (step.insertIndex !== undefined) {
      this.data.insertIndex = step.insertIndex;
    }
    if (step.insertValue !== undefined) {
      this.data.insertValue = step.insertValue;
    }
    if (step.smallestIndex !== undefined) {
      this.data.smallestIndex = step.smallestIndex;
    }
    if (step.scanIndex !== undefined) {
      this.data.scanIndex = step.scanIndex;
    }
    if (step.comparisons !== undefined) {
      this.data.comparisons = step.comparisons;
    }
    if (step.swaps !== undefined) {
      this.data.swaps = step.swaps;
    }
    if (step.sortedIndices) {
      this.data.sortedIndices = step.sortedIndices;
    }
  }

  complete() {
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (this.callbacks.onComplete) {
      this.callbacks.onComplete(this.data);
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    if (!this.isRunning) return;
    this.isPaused = false;
  }

  reset() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.currentStepIndex = 0;
    const savedArray = this.data.array ? [...this.data.array] : null;
    this.initialize(savedArray);
  }

  setSpeed(speed) {
    if (this.interval) {
      clearInterval(this.interval);
      const delay = Math.max(150, Math.min(800, 500 / speed));
      this.interval = setInterval(() => this.step(), delay);
    }
  }

  on(event, callback) {
    this.callbacks[event] = callback;
  }

  getAlgorithm() {
    return this.algorithm;
  }
}