import { useState, useEffect } from 'react';

export default function FleetManagerDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [taskInput, setTaskInput] = useState('');
  const [executing, setExecuting] = useState(false);
  const [report, setReport] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/fleet-manager/metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const executeTask = async () => {
    if (!taskInput.trim()) return;
    
    setExecuting(true);
    try {
      const response = await fetch('http://localhost:3001/api/fleet-manager/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskInput }),
      });
      const data = await response.json();
      setReport(data);
      fetchMetrics();
    } catch (error) {
      console.error('Error executing task:', error);
    } finally {
      setExecuting(false);
    }
  };

  const runDailyCycle = async () => {
    setExecuting(true);
    try {
      const response = await fetch('http://localhost:3001/api/fleet-manager/daily-cycle', {
        method: 'POST',
      });
      const data = await response.json();
      setReport(data);
      fetchMetrics();
    } catch (error) {
      console.error('Error running daily cycle:', error);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🤖 Fleet Manager AI Dashboard</h1>
          <p className="text-gray-300">Orchestrating 8 specialized agents for Success Chemistry</p>
        </div>

        {/* Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <MetricCard title="MRR" value={`$${metrics.mrr}`} trend="+15%" color="green" />
            <MetricCard title="AOV" value={`$${metrics.aov}`} trend="+12%" color="blue" />
            <MetricCard title="LTV" value={`$${metrics.ltv}`} trend="+18%" color="purple" />
            <MetricCard title="Churn Rate" value={`${metrics.churnRate}%`} trend="-5%" color="red" />
            <MetricCard title="ROAS" value={metrics.roas} trend="+8%" color="green" />
            <MetricCard title="Conversion" value={`${metrics.conversionRate}%`} trend="+3%" color="blue" />
            <MetricCard title="Subscription Rate" value={`${metrics.subscriptionRate}%`} trend="+10%" color="purple" />
            <MetricCard title="30-Day Revenue" value={`$${metrics.revenue30Days.toFixed(0)}`} trend="+22%" color="green" />
          </div>
        )}

        {/* Task Execution */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Execute Task</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Enter task (e.g., 'Optimize creatine product page + create energy stack bundle')"
              className="flex-1 px-4 py-3 bg-white/20 rounded-lg border border-white/30 focus:outline-none focus:border-purple-400"
              onKeyPress={(e) => e.key === 'Enter' && executeTask()}
            />
            <button
              onClick={executeTask}
              disabled={executing}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold disabled:opacity-50"
            >
              {executing ? 'Executing...' : 'Execute'}
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={runDailyCycle}
              disabled={executing}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50"
            >
              Run Daily Cycle
            </button>
            <button
              onClick={() => setTaskInput('Optimize current product page for creatine + upsell stack for energy. Generate compliant description, suggest bundle, and run ad test ideas.')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
            >
              Example Task
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-4 border-b border-white/20">
          {['overview', 'agents', 'report'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-purple-400 text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AgentCard
              name="Subscription Optimizer"
              status="active"
              description="Analyzing customer behavior for subscription opportunities"
              metrics={{ opportunities: 45, projectedMRR: '$1,800' }}
            />
            <AgentCard
              name="Upsell Agent"
              status="active"
              description="Creating intelligent product bundles and cart recommendations"
              metrics={{ bundles: 8, aovIncrease: '+18%' }}
            />
            <AgentCard
              name="Content Agent"
              status="active"
              description="Generating SEO-optimized, compliant product descriptions"
              metrics={{ generated: 12, complianceScore: 100 }}
            />
            <AgentCard
              name="Ad Agent"
              status="active"
              description="Monitoring and optimizing Google/Meta ad campaigns"
              metrics={{ roas: 3.8, cpa: '$11.84' }}
            />
            <AgentCard
              name="Retention Agent"
              status="active"
              description="Predicting churn and triggering win-back campaigns"
              metrics={{ highRisk: 8, savedLTV: '$3,200' }}
            />
            <AgentCard
              name="Trust Agent"
              status="active"
              description="Enforcing FDA/FTC compliance on all content"
              metrics={{ validated: 156, violations: 0 }}
            />
            <AgentCard
              name="Pricing Agent"
              status="active"
              description="Dynamic pricing analysis and demand forecasting"
              metrics={{ recommendations: 5, revenueLift: '+$8,240' }}
            />
            <AgentCard
              name="Overseer (You)"
              status="active"
              description="Coordinating all agents and reporting metrics"
              metrics={{ tasksCompleted: 23, uptime: '99.9%' }}
            />
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Agent Details</h2>
            <div className="space-y-4">
              <AgentDetail name="Subscription Optimizer" actions={['Analyze opportunities', 'Auto-enroll eligible customers', 'Predict churn risk']} />
              <AgentDetail name="Upsell Agent" actions={['Generate cart upsells', 'Create bundles', 'Email campaigns']} />
              <AgentDetail name="Content Agent" actions={['Product descriptions', 'Blog posts', 'Social media']} />
              <AgentDetail name="Ad Agent" actions={['Generate ad tests', 'Monitor performance', 'Retargeting']} />
              <AgentDetail name="Retention Agent" actions={['Predict churn', 'Win-back emails', 'Re-engagement']} />
              <AgentDetail name="Trust Agent" actions={['Validate compliance', 'Generate testimonials', 'Trust badges']} />
              <AgentDetail name="Pricing Agent" actions={['Analyze pricing', 'Demand forecast', 'Tiered pricing']} />
            </div>
          </div>
        )}

        {activeTab === 'report' && report && (
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Latest Execution Report</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Task</h3>
                <p className="text-gray-300">{report.task}</p>
              </div>
              
              {report.alerts && report.alerts.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">🚨 Alerts</h3>
                  {report.alerts.map((alert, i) => (
                    <div key={i} className="bg-red-500/20 border border-red-500/50 rounded p-3 mb-2">
                      <p className="font-semibold">{alert.metric}</p>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {report.metrics && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">📊 Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 p-4 rounded">
                      <p className="text-sm text-gray-400">MRR</p>
                      <p className="text-2xl font-bold">${report.metrics.mrr}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded">
                      <p className="text-sm text-gray-400">AOV</p>
                      <p className="text-2xl font-bold">${report.metrics.aov}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded">
                      <p className="text-sm text-gray-400">ROAS</p>
                      <p className="text-2xl font-bold">{report.metrics.roas}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded">
                      <p className="text-sm text-gray-400">Churn</p>
                      <p className="text-2xl font-bold">{report.metrics.churnRate}%</p>
                    </div>
                  </div>
                </div>
              )}

              {report.nextSteps && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">📋 Next Steps</h3>
                  {report.nextSteps.map((step, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded mb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{step.action}</p>
                          <p className="text-sm text-gray-400">Impact: {step.estimatedImpact}</p>
                        </div>
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${
                          step.priority === 'critical' ? 'bg-red-500' :
                          step.priority === 'high' ? 'bg-orange-500' :
                          step.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}>
                          {step.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-sm text-gray-400">
                Execution time: {report.executionTime}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, color }) {
  const colors = {
    green: 'from-green-500/20 to-green-600/20 border-green-500/50',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/50',
    purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/50',
    red: 'from-red-500/20 to-red-600/20 border-red-500/50',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} backdrop-blur-lg rounded-lg p-4 border`}>
      <p className="text-sm text-gray-300 mb-1">{title}</p>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className={`text-sm ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
        {trend}
      </p>
    </div>
  );
}

function AgentCard({ name, status, description, metrics }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold">{name}</h3>
        <span className={`px-3 py-1 rounded text-xs font-semibold ${
          status === 'active' ? 'bg-green-500' : 'bg-gray-500'
        }`}>
          {status}
        </span>
      </div>
      <p className="text-gray-300 text-sm mb-4">{description}</p>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="bg-white/5 p-2 rounded">
            <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentDetail({ name, actions }) {
  return (
    <div className="bg-white/5 p-4 rounded">
      <h4 className="font-semibold mb-2">{name}</h4>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, i) => (
          <span key={i} className="px-3 py-1 bg-purple-500/30 rounded text-sm">
            {action}
          </span>
        ))}
      </div>
    </div>
  );
}
