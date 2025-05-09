import { ArrowUpRight, InfoIcon } from 'lucide-react'
import Link from 'next/link'

export function SmtpMessage() {
  return (
    <div>
      <InfoIcon size={16} />
      <div>
        <small>
          <strong> Note:</strong> Emails are rate limited. Enable Custom SMTP to
          increase the rate limit.
        </small>
        <div>
          <Link
            href="https://supabase.com/docs/guides/auth/auth-smtp"
            target="_blank"
          >
            Learn more <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
