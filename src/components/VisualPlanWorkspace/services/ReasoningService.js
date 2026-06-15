export class ReasoningService {
  constructor() {
    this.planHierarchy = {
      'Input Plan': { type: 'input', requiredOutput: ['Loop Plan', 'Output Plan'] },
      'Output Plan': { type: 'output', requiredInput: ['Loop Plan', 'Exchange Plan', 'Select Smallest Plan'] },
      'Loop Plan': { type: 'control', canEmbed: ['Select Smallest Plan', 'Exchange Plan', 'Compare Adjacents Plan', 'Guard Plan'] },
      'Guard Plan': { type: 'control', canEmbed: ['Exchange Plan', 'Select Smallest Plan'] },
      'Select Smallest Plan': { type: 'search', requires: ['Loop Plan'] },
      'Compare Adjacents Plan': { type: 'compare', requires: ['Loop Plan'] },
      'Exchange Plan': { type: 'swap', requires: ['Loop Plan', 'Guard Plan'] },
      'LSSE Plan': { type: 'composite', decomposesTo: ['Loop Plan', 'Select Smallest Plan', 'Exchange Plan'] },
      'CAE Plan': { type: 'composite', decomposesTo: ['Loop Plan', 'Compare Adjacents Plan', 'Exchange Plan'] },
    };
  }

  analyze(plans, connections, phase) {
    const suggestions = [];
    let hasError = false;
    let errorMessage = '';

    if (phase === 2) {
      const hasInput = plans.some(p => p.type === 'input');
      const hasOutput = plans.some(p => p.type === 'output');
      const hasLoop = plans.some(p => p.type === 'control');
      const hasAction = plans.some(p => p.type === 'swap' || p.type === 'search' || p.type === 'compare');

      if (!hasInput && !hasLoop && !hasAction && plans.length === 0) {
        suggestions.push({
          id: 'add_input',
          message: 'No plans on canvas. Start by adding an Input Plan to get data.',
          action: 'add_plan',
          planName: 'Input Plan',
          x: 300,
          y: 200
        });
      } else if (hasInput && !hasLoop) {
        suggestions.push({
          id: 'add_loop',
          message: 'You have Input but no Loop. Add a Loop Plan to process the data repeatedly.',
          action: 'add_plan',
          planName: 'Loop Plan',
          x: 500,
          y: 200
        });
      } else if (hasLoop && !hasAction) {
        suggestions.push({
          id: 'add_action',
          message: 'Your Loop needs an action. Add Exchange Plan (for swapping) or Select Smallest Plan (for finding min).',
          action: 'add_plan',
          planName: 'Select Smallest Plan',
          x: 500,
          y: 300
        });
      } else if (hasInput && hasLoop && hasAction && !hasOutput) {
        suggestions.push({
          id: 'add_output',
          message: 'Processing complete! Add an Output Plan to display results.',
          action: 'add_plan',
          planName: 'Output Plan',
          x: 700,
          y: 200
        });
      }

      const connectionIssues = this.validateConnections(plans, connections);
      if (connectionIssues.length > 0) {
        hasError = true;
        errorMessage = connectionIssues[0].message;
        suggestions.push(...connectionIssues);
      }
    }

    if (phase === 3) {
      if (plans.length === 0) {
        suggestions.push({
          id: 'create_plan',
          message: 'Create a new plan by dragging from the library and modifying its code.',
          action: 'add_plan',
          planName: 'Input Plan',
          x: 300,
          y: 200
        });
      } else {
        const missingCode = plans.filter(p => !p.customCode && p.name !== 'Input Plan' && p.name !== 'Output Plan');
        if (missingCode.length > 0) {
          suggestions.push({
            id: 'add_code',
            message: `${missingCode[0].name} has default code. Click it and write custom implementation.`,
            action: 'select_plan',
            planId: missingCode[0].id
          });
        }
      }
    }

    return { suggestions, hasError, errorMessage };
  }

  validateConnections(plans, connections) {
    const issues = [];
    const planMap = new Map(plans.map(p => [p.id, p]));
    const incomingCount = new Map();
    const outgoingCount = new Map();

    connections.forEach(conn => {
      incomingCount.set(conn.to, (incomingCount.get(conn.to) || 0) + 1);
      outgoingCount.set(conn.from, (outgoingCount.get(conn.from) || 0) + 1);
    });

    for (const conn of connections) {
      const fromPlan = planMap.get(conn.from);
      const toPlan = planMap.get(conn.to);

      if (!fromPlan || !toPlan) continue;

      if (fromPlan.type === 'output') {
        issues.push({
          id: `invalid_out_${conn.from}`,
          message: `Output Plan (${fromPlan.name}) should not have outgoing connections.`,
          action: 'remove_connection',
          from: conn.from,
          to: conn.to
        });
      }

      if (toPlan.type === 'input') {
        issues.push({
          id: `invalid_in_${conn.to}`,
          message: `Input Plan (${toPlan.name}) should not have incoming connections.`,
          action: 'remove_connection',
          from: conn.from,
          to: conn.to
        });
      }

      if (conn.mode === 'embedded') {
        const parentPlan = fromPlan;
        const childPlan = toPlan;
        
        if (parentPlan.type !== 'control') {
          issues.push({
            id: `invalid_embed_${conn.from}`,
            message: `Embedded mode requires parent to be a Control Plan (Loop or Guard). ${parentPlan.name} is ${parentPlan.type}.`,
            action: 'change_mode',
            from: conn.from,
            to: conn.to,
            suggestedMode: 'appended'
          });
        }
      }

      if (conn.mode === 'interleaved') {
        const hasBothLoop = fromPlan.type === 'control' || toPlan.type === 'control';
        if (!hasBothLoop) {
          issues.push({
            id: `invalid_inter_${conn.from}`,
            message: `Interleaved mode works best between a Loop and an Action plan.`,
            action: 'change_mode',
            from: conn.from,
            to: conn.to,
            suggestedMode: 'appended'
          });
        }
      }
    }

    for (const [planId, count] of incomingCount) {
      if (count > 2 && planMap.get(planId)?.type !== 'control') {
        const plan = planMap.get(planId);
        issues.push({
          id: `too_many_in_${planId}`,
          message: `${plan?.name} has ${count} incoming connections. Consider using a Guard Plan to branch.`,
          action: 'add_guard'
        });
      }
    }

    return issues;
  }

  validateConnection(plans, fromId, toId, mode) {
    const fromPlan = plans.find(p => p.id === fromId);
    const toPlan = plans.find(p => p.id === toId);

    if (!fromPlan || !toPlan) {
      return { valid: false, error: 'Plan not found' };
    }

    if (fromPlan.type === 'output') {
      return { valid: false, error: 'Output Plan cannot have outgoing connections' };
    }

    if (toPlan.type === 'input') {
      return { valid: false, error: 'Input Plan cannot have incoming connections' };
    }

    if (mode === 'embedded' && fromPlan.type !== 'control') {
      return { valid: false, error: 'Embedded mode requires parent to be a Loop or Guard Plan' };
    }

    if (mode === 'interleaved') {
      const hasLoop = fromPlan.type === 'control' || toPlan.type === 'control';
      if (!hasLoop) {
        return { valid: false, error: 'Interleaved mode requires at least one Control Plan' };
      }
    }

    return { valid: true, error: null };
  }

  getTutorialMessage(step, algorithm, phase) {
    const messages = {
      0: { title: 'Welcome!', content: `You're in Phase ${phase}. Let's learn about ${algorithm}.` },
      1: { title: 'Plans Explained', content: 'Plans are building blocks. Each plan does one specific task.' },
      2: { title: 'Connections', content: 'Connect plans to build programs. Green = sequential, Purple = nested.' },
      3: { title: 'Try It!', content: 'Drag a plan from the library to the canvas to get started.' }
    };
    return messages[step] || messages[0];
  }
}