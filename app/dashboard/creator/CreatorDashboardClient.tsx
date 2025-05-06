'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CreatorDashboardClient() {
  const [status, setStatus] = useState('Vérification...');
  const [detail, setDetail] = useState('');

  useEffect(() => {
    const testSupabase = async () => {
      try {
        console.log('Test de connexion Supabase...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setStatus('Erreur Supabase');
          setDetail(error.message);
        } else if (data?.session) {
          setStatus('Connexion OK');
          setDetail(`Utilisateur: ${data.session.user.id}`);
        } else {
          setStatus('Pas de session');
          setDetail('Aucune session trouvée');
        }
      } catch (e) {
        setStatus('Erreur critique');
        setDetail(e.message);
      }
    };
    
    testSupabase();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Test Supabase</h1>
      <div className="p-4 bg-gray-100 rounded">
        <p><strong>Statut:</strong> {status}</p>
        <p><strong>Détail:</strong> {detail}</p>
      </div>
    </div>
  );
}