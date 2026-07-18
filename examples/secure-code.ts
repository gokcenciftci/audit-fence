// Secure Example File passing all AuditFence checks

export async function processData(input: string): Promise<Record<string, unknown>> {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  const userId = data?.user?.id;
  return { userId, input };
}

export function setupListeners(): () => void {
  const handleResize = () => {};
  window.addEventListener('resize', handleResize);

  const intervalId = setInterval(() => {}, 5000);

  return () => {
    window.removeEventListener('resize', handleResize);
    clearInterval(intervalId);
  };
}
