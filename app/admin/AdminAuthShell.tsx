"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import { createClient } from "@/lib/supabase/client";

const ADMIN_EMAIL = "omvaluehomes6@gmail.com";

export default function AdminAuthShell() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    try {
      const supabase = createClient();
      supabase.auth
        .getUser()
        .then(({ data }) => {
          if (active) setUserEmail(data.user?.email ?? null);
        })
        .catch(() => {
          if (active) setUserEmail(null);
        })
        .finally(() => {
          if (active) setIsChecking(false);
        });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (active) {
          setUserEmail(session?.user.email ?? null);
          setIsChecking(false);
        }
      });

      return () => {
        active = false;
        subscription.unsubscribe();
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Supabase is not configured.";
      queueMicrotask(() => {
        if (active) {
          setMessage(errorMessage);
          setIsChecking(false);
        }
      });
      return () => {
        active = false;
      };
    }
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("Signing in…");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      setUserEmail(data.user.email ?? null);
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Admin login failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function signOut() {
    try {
      await createClient().auth.signOut();
    } finally {
      setUserEmail(null);
      setPassword("");
    }
  }

  if (isChecking) {
    return (
      <main className="admin-shell admin-login-shell">
        <section className="admin-card admin-loading">
          <span />
          <strong>Checking admin session…</strong>
        </section>
      </main>
    );
  }

  if (!userEmail) {
    return (
      <main className="admin-shell admin-login-shell">
        <form className="admin-card admin-form admin-login" onSubmit={signIn}>
          <Image
            src="/om-value-homes-logo.jpeg"
            alt="OM Value Homes"
            width={831}
            height={206}
            priority
          />
          <div className="admin-card-heading">
            <span>01</span>
            <div>
              <p>Secure Content Manager</p>
              <h1>Admin Login</h1>
            </div>
          </div>
          <label>
            <span>Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Login to Admin"}
          </button>
          {message && (
            <p className="admin-message" aria-live="polite">
              {message}
            </p>
          )}
          <Link href="/">Back to website</Link>
        </form>
      </main>
    );
  }

  if (userEmail.toLowerCase() !== ADMIN_EMAIL) {
    return (
      <main className="admin-shell admin-login-shell">
        <section className="admin-denied admin-card">
          <h1>Admin access denied</h1>
          <p>
            Signed in as {userEmail}. Only the approved OM Value Homes admin
            account can edit website content.
          </p>
          <button type="button" onClick={signOut}>
            Sign Out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link href="/" aria-label="Back to OM Value Homes website">
          <Image
            src="/om-value-homes-logo.jpeg"
            alt="OM Value Homes"
            width={831}
            height={206}
          />
        </Link>
        <div>
          <span>Signed in as {userEmail}</span>
          <Link href="/">View Website</Link>
          <button type="button" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </header>

      <section className="admin-intro">
        <p>OM Value Homes Admin</p>
        <h1>Manage website content.</h1>
        <span>
          Create blogs, upload the flat tour, publish customer cards and keep
          founder or project information updated.
        </span>
      </section>

      <AdminDashboard />
    </main>
  );
}
