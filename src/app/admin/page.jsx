'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Settings, Plus, Trash2, Edit3, ArrowLeft } from 'lucide-react';

export default function AdminPage() {
  const [items, setItems] = useState([
    { id: 1, name: 'TAGT — Tenant & Guest Transaction System', meta: 'Full-Stack · MongoDB · TypeScript' },
    { id: 2, name: 'Brain Tumor Detection System', meta: 'Research · Python · CNN' },
    { id: 3, name: 'Smart Life Companion', meta: 'Academic · NLP · TypeScript' },
  ]);

  const addItem = () => {
    const name = prompt('Enter project name:');
    if (name) {
      setItems([...items, { id: Date.now(), name, meta: 'New Project' }]);
    }
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', minHeight: '100vh' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem',
          paddingTop: '2rem',
        }}
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-2)',
            fontSize: '0.875rem',
            fontFamily: 'var(--font-body)',
          }}
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
        <h1 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-head)', fontWeight: 700 }}>
          Admin
        </h1>
        <Settings size={22} color="var(--blue)" />
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.1rem' }}>
            Projects
          </h2>
          <button onClick={addItem} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            <Plus size={16} /> Add
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.25rem 1.5rem',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.95rem', fontFamily: 'var(--font-head)', fontWeight: 600 }}>
                  {item.name}
                </h4>
                <p style={{ color: 'var(--text-3)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                  {item.meta}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Edit3 size={17} color="var(--text-2)" cursor="pointer" />
                <Trash2
                  size={17}
                  color="#F87171"
                  cursor="pointer"
                  onClick={() => deleteItem(item.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p
        style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: 'var(--text-3)',
          fontSize: '0.78rem',
          fontFamily: 'var(--font-body)',
        }}
      >
        Session-based · changes reset on refresh · connect a database to persist
      </p>
    </div>
  );
}
