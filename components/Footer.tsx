import { Logo } from '@/components/Logo'
import { whatsappLink } from '@/lib/diagnostico'

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-black">
      <div className="container-acesso grid gap-12 py-16 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Logo className="h-8 w-auto" />
          <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-acesso-gray-500">
            Um ecossistema global que conecta empresários, empresas, mercados e oportunidades entre Brasil, Estados Unidos e o mundo.
          </p>
        </div>

        <div>
          <p className="section-label">Acesso</p>
          <ul className="mt-5 space-y-3 text-[0.95rem] text-acesso-gray-300">
            <li><a className="focus-ring transition-colors hover:text-white" href="https://acessousa.com" target="_blank" rel="noopener noreferrer">acessousa.com</a></li>
            <li><a className="focus-ring transition-colors hover:text-white" href="https://instagram.com/acesso.usa" target="_blank" rel="noopener noreferrer">@acesso.usa</a></li>
            <li>
              <a
                className="focus-ring transition-colors hover:text-white"
                href={whatsappLink('Olá! Vim pelo diagnóstico Acesso USA Score e quero falar com o Acesso.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp +1 (407) 408-9712
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="section-label">Matriz</p>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-acesso-gray-300">
            5749 Westgate Dr #108
            <br />
            Orlando, FL 32835
          </p>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <p className="container-acesso py-6 text-[0.75rem] leading-relaxed text-acesso-gray-500">
          © {new Date().getFullYear()} Acesso. Este diagnóstico é uma orientação estratégica inicial e não constitui consultoria jurídica, contábil ou migratória. Para registro de marca nos EUA, estrangeiros normalmente precisam de advogado licenciado perante o USPTO.
        </p>
      </div>
    </footer>
  )
}
