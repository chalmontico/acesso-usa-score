'use client'

import { useState } from 'react'

export type FaqItem = { q: string; a: string }

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="focus-ring flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="text-[1.02rem] font-semibold tracking-tight text-white sm:text-lg">{item.q}</span>
              <span
                className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border text-xl leading-none transition-all duration-300 ${
                  isOpen ? 'rotate-45 border-acesso-cyan/60 bg-acesso-cyan/10 text-acesso-cyan' : 'border-white/15 text-acesso-gray-300'
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              className="grid transition-all duration-500"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 text-[0.98rem] leading-relaxed text-acesso-gray-300">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
