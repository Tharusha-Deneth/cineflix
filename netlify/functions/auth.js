const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ status: 'error', message: 'Method Not Allowed' }) };
  }

  let data = {};
  try {
    data = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ status: 'error', message: 'Invalid JSON body' }) };
  }

  const { action, full_name, email, password, google_id } = data;

  try {
    const connection = await mysql.createConnection({
      host: 'mysql-f149e35-cineflix.l.aivencloud.com',
      port: 18408,
      user: 'avnadmin',
      password: 'AVNS_kHcyMX3jHgBvSRy4oDh',
      database: 'defaultdb',
      ssl: { rejectUnauthorized: false }
    });

    if (action === 'signup') {
      if (!full_name || !email || !password) {
        await connection.end();
        return { statusCode: 400, headers, body: JSON.stringify({ status: 'error', message: 'All fields are required' }) };
      }

      const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        await connection.end();
        return { statusCode: 400, headers, body: JSON.stringify({ status: 'error', message: 'Email already registered' }) };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await connection.execute(
        'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)',
        [full_name, email, hashedPassword]
      );

      await connection.end();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Registration successful',
          user: { id: result.insertId, name: full_name, email }
        })
      };
    }

    if (action === 'login') {
      if (!email || !password) {
        await connection.end();
        return { statusCode: 400, headers, body: JSON.stringify({ status: 'error', message: 'All fields are required' }) };
      }

      const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        await connection.end();
        return { statusCode: 400, headers, body: JSON.stringify({ status: 'error', message: 'Email not found' }) };
      }

      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password);
      await connection.end();

      if (!isMatch) {
        return { statusCode: 400, headers, body: JSON.stringify({ status: 'error', message: 'Incorrect password' }) };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Login successful',
          user: { id: user.id, name: user.full_name, email: user.email }
        })
      };
    }

    if (action === 'google_auth') {
      const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

      if (users.length > 0) {
        const user = users[0];
        await connection.end();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            status: 'success',
            message: 'Google login successful',
            user: { id: user.id, name: user.full_name, email: user.email }
          })
        };
      }

      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      const [result] = await connection.execute(
        'INSERT INTO users (full_name, email, password, google_id) VALUES (?, ?, ?, ?)',
        [full_name || 'Google User', email, randomPassword, google_id || 'google_oauth']
      );

      await connection.end();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Google registration successful',
          user: { id: result.insertId, name: full_name || 'Google User', email }
        })
      };
    }

    await connection.end();
    return { statusCode: 400, headers, body: JSON.stringify({ status: 'error', message: 'Invalid action' }) };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ status: 'error', message: error.message })
    };
  }
};