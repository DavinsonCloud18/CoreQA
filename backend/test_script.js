
async function test() {
  try {
    const loginRes = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@coreqa.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log('Login:', loginData);
    if (!loginData.data?.access_token) return;

    const token = loginData.data.access_token;
    
    console.log('Fetching users...');
    const usersRes = await fetch('http://localhost:4000/master/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Users Status:', usersRes.status);
    console.log('Users Data:', await usersRes.text());

    console.log('Fetching roles...');
    const rolesRes = await fetch('http://localhost:4000/master/roles', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Roles Status:', rolesRes.status);
    console.log('Roles Data:', await rolesRes.text());

  } catch (e) {
    console.error('Error:', e);
  }
}

test();
