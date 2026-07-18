// Insecure Example File for AuditFence Testing

export function processData(input: string) {
  debugger;
  console.log('Processing input:', input);
  alert('Input received');

  fetch('https://api.example.com/data');

  const unsafeVal = eval(input);
  return unsafeVal;
}

export function setupListeners() {
  window.addEventListener('resize', () => {
    console.log('Resized');
  });

  setInterval(() => {
    console.log('Heartbeat');
  }, 1000);
}
