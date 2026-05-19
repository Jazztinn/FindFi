import type { ClientMetadata } from '../types';

interface NavigatorConnection {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NavigatorConnection;
}

export function getClientMetadata(): ClientMetadata {
  const connection = (navigator as NavigatorWithConnection).connection;

  return {
    userAgent: navigator.userAgent,
    connectionEffectiveType: connection?.effectiveType ?? null,
    connectionDownlinkMbps: connection?.downlink ?? null,
    connectionRttMs: connection?.rtt ?? null,
  };
}
