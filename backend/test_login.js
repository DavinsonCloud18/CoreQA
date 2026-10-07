async function test() {
  try {
    const res = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'lead@coreqa.com', password: 'CoreQA_2026!Sec' })
    });
    console.log('Status:', res.status);
    const json = await res.json();
    console.log('Response:', JSON.stringify(json, null, 2));
  } catch(e) {
    console.error('Error fetching:', e.message);
  }
}
test();
