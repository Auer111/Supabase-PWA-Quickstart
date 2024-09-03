import './index.css'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import * as React from 'react';
import Button from '@mui/material/Button';

const supabase = createClient('https://kpfmmzljlaixrqyrcozk.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwZm1temxqbGFpeHJxeXJjb3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzODMzODAsImV4cCI6MjA0MDk1OTM4MH0.OSRZwAC9hkX8I6rhhqo0ckVQm0dVUzZSc5RmDuBldc8')

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Error logging out:', error.message)
    setSession(null) // Clear the session
  }

  if (!session) {
    return (<Auth supabaseClient={supabase} providers={['google']} appearance={{ theme: ThemeSupa }} localization={{
      variables: {
        sign_up: {
          social_provider_text: 'Sign up with Google',
        },
      },
    }}  />)
  }
  else {
    return (<Button variant='contained' onClick={handleLogout}>Log Out</Button>)
  }
}