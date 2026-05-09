export function listenForSms(callback) {
  if (typeof callback !== 'function') {
    return;
  }

  setTimeout(() => {
    callback({
      amount: 1500,
      reference: 'ABC123XYZ',
      source: 'Safaricom',
      description: 'M-Pesa payment received via SMS parser'
    });
  }, 1400);
}

export function parseSmsTransaction(text) {
  const amountMatch = text.match(/Ksh\s*([0-9,]+(?:\.[0-9]{1,2})?)/i);
  const referenceMatch = text.match(/Ref\s*[:]?\s*([A-Za-z0-9]+)/i);

  return {
    amount: amountMatch ? Number(amountMatch[1].replace(/,/g, '')) : 0,
    reference: referenceMatch ? referenceMatch[1] : 'UNKNOWN',
    raw: text
  };
}
