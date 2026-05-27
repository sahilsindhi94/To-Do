import { AnimatePresence, motion, Reorder } from 'framer-motion'
import { Inbox } from 'lucide-react'
import { listContainer } from '../../animations/variants'
import { TaskCard } from './TaskCard'

export function TaskBoard({ tasks, onEdit, onDelete, onToggle, onReorder, onPin }) {
  if (!tasks.length) {
    return (
      <div className="glass-panel grid min-h-64 place-items-center rounded-[28px] p-8 text-center">
        <div>
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-300">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-ink dark:text-white">No tasks here</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create a task or adjust your filters.
          </p>
        </div>
      </div>
    )
  }

  return (
    <Reorder.Group axis="y" values={tasks} onReorder={onReorder} as="div" className="grid gap-3">
      <AnimatePresence mode="popLayout">
        <motion.div variants={listContainer} initial="initial" animate="animate" className="contents">
          {tasks.map((task) => (
            <Reorder.Item key={task._id ?? task.id} value={task} as="div">
              <TaskCard
                task={task}
                onEdit={() => onEdit(task)}
                onDelete={() => onDelete(task)}
                onToggle={() => onToggle(task)}
                onPin={onPin ? () => onPin(task) : undefined}
              />
            </Reorder.Item>
          ))}
        </motion.div>
      </AnimatePresence>
    </Reorder.Group>
  )
}
