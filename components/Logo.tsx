import Image from 'next/image'
import { asset } from '@/lib/base'

type LogoProps = {
  className?: string
  priority?: boolean
}

/**
 * Logo do Acesso Score: wordmark "acesso" oficial + anel de score no lugar do ponto
 * (azul = o que já está pronto, vermelho = o que ainda falta resolver).
 * A altura é controlada pelo className, ex.: "h-6 w-auto".
 */
export function Logo({ className = 'h-6 w-auto', priority }: LogoProps) {
  return (
    <span className={`inline-flex items-end gap-[0.28em] ${className}`} role="img" aria-label="Acesso Score" style={{ fontSize: 'inherit' }}>
      <Image
        src={asset("/brand/acesso-wordmark.png")}
        alt=""
        width={1100}
        height={206}
        priority={priority}
        className="h-full w-auto"
      />
      <svg viewBox="0 0 100 100" className="mb-[2%] h-[58%] w-auto flex-none" aria-hidden="true">
        <g fill="none" strokeWidth="16" transform="rotate(-90 50 50)">
          <circle cx="50" cy="50" r="40" stroke="#3f9dff" strokeDasharray="188.5 251.3" />
          <circle cx="50" cy="50" r="40" stroke="#c9303a" strokeDasharray="62.8 251.3" strokeDashoffset="-188.5" />
        </g>
      </svg>
    </span>
  )
}
