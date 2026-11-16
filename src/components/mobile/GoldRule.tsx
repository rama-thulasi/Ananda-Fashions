interface GoldRuleProps {
  className?: string;
}

export function GoldRule({ className = "" }: GoldRuleProps) {
  return (
    <div
      className={`h-[1px] w-16 bg-gradient-to-r from-gold via-gold-soft to-gold ${className}`}
      role="separator"
    />
  );
}
