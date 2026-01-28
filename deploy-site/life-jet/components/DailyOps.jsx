'use client'
import React, { useState } from 'react';

function DailyOps({ todos, onToggleTodo }) {
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (!newTodo.trim()) return;
    // This would be handled by parent component
    setNewTodo('');
  };

  const completedTodos = todos.filter(t => t.completed).length;
  const totalProgress = todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0;

  return (
    <div className="daily-ops" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-emerald)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span className="ph ph-target" style={{ fontSize: '20px' }} aria-hidden />
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            color: 'var(--emerald)',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>DAILY OPS</h2>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--cyan)'
        }}>{completedTodos}/{todos.length}</span>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-tertiary)',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          <span>MISSION PROGRESS</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--emerald)' }}>{totalProgress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${totalProgress}%` }}
          ></div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="New objective..."
          className="search-input"
          style={{ flex: 1, fontSize: '12px', padding: '10px 12px' }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '10px 16px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--border-emerald)',
            borderRadius: '4px',
            color: 'var(--emerald)',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          <span className="ph ph-plus" aria-hidden />
        </button>
      </div>

      <div className="todo-list">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`todo-item ${todo.completed ? 'completed' : ''}`}
          >
            <div
              className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
              onClick={() => onToggleTodo(todo.id)}
            ></div>
            <div className="todo-text">{todo.text}</div>
            <span className={`todo-priority priority-${todo.priority}`}>
              {todo.priority.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DailyOps;
