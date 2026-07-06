'use client';

import { Badge } from '@/components/ui/Badge';
import { FadeIn } from '@/components/animations/FadeIn';
import type { TeamMember } from '@/types';
import { User } from 'lucide-react';

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

export function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  return (
    <FadeIn delay={index * 0.1}>
      <div className="group rounded-xl bg-white border border-[rgba(31,27,23,0.08)] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="h-48 bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center">
          <User className="h-20 w-20 text-[var(--color-ink-100)]" />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-sans font-bold text-[var(--color-ink-400)]">{member.name}</h3>
          <p className="text-sm font-sans text-orange-600 font-medium mb-3">{member.role}</p>
          <p className="text-sm text-[var(--color-ink-200)] leading-relaxed mb-4">{member.bio}</p>
          <div className="flex flex-wrap gap-2">
            <Badge text={`${member.yearsExperience}+ Years`} variant="accent" />
            {member.certifications.slice(0, 2).map((cert) => (
              <Badge key={cert} text={cert} variant="muted" />
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
