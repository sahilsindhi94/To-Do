import { motion } from 'framer-motion'
import { Github, Sparkles, CheckCircle2, Zap, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: CheckCircle2, text: 'Tasks synced across all your devices' },
  { icon: Zap,          text: 'Real-time updates with Convex'        },
  { icon: Shield,       text: 'Secure login via GitHub OAuth'        },
]

export default function LoginPage() {
  const { signIn, isLoading } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="glass-panel rounded-[32px] p-8 text-ink dark:text-white">

          {/* Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-ink text-white shadow-lift dark:bg-white dark:text-ink">
              <Sparkles className="h-8 w-8" />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-teal-600 dark:text-teal-300">
              Premium Todo
            </p>
            <h1 className="mt-1 text-3xl font-semibold">Momentum</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              A calm workspace for planning, focus, and follow-through.
            </p>
          </div>

          {/* Features */}
          <ul className="mt-8 grid gap-3">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-300">
                  <Icon className="h-4 w-4" />
                </div>
                {text}
              </li>
            ))}
          </ul>

          {/* Sign in button */}
          <button
            onClick={signIn}
            disabled={isLoading}
            className="focus-ring mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-ink px-6 py-3.5 text-sm font-semibold text-white shadow-lift transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-ink dark:hover:bg-slate-100"
          >
            <Github className="h-5 w-5" />
            Continue with GitHub
          </button>

          <p className="mt-4 text-center text-xs text-slate-400">
            By signing in you agree to our terms. No email required.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
