import Image from 'next/image'

type LogoProps = {
  className?: string
  priority?: boolean
}

/**
 * Logo oficial do Acesso, exatamente como fornecido (sem recolorir, sem redesenhar).
 * Arquivo: public/brand/acesso-logo.png (wordmark "acesso.", fundo transparente).
 * A altura é controlada pelo className, ex.: "h-7 w-auto".
 */
export function Logo({ className = 'h-7 w-auto', priority }: LogoProps) {
  return (
    <Image
      src="/brand/acesso-logo.png"
      alt="Acesso"
      width={1200}
      height={206}
      priority={priority}
      className={className}
    />
  )
}
