export function initDaraja() {
  console.log('Daraja integration initialized.');
  alert('Daraja feature is ready to be connected with a backend in production.');
}

export async function submitStkPush(amount, phoneNumber) {
  return {
    status: 'pending',
    amount,
    phoneNumber,
    timestamp: new Date().toISOString()
  };
}
