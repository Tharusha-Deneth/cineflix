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
    return { statusCode: 200, headers, body: JSON.stringify({ status: 'error', message: 'Method Not Allowed' }) };
  }

  let data = {};
  try {
    data = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 200, headers, body: JSON.stringify({ status: 'error', message: 'Invalid JSON body' }) };
  }

  const { action, full_name, email, password, google_id } = data;

  // 1. බොරු ඊමේල් පරීක්ෂාව (Real Email Validation)
  if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return { statusCode: 200, headers, body: JSON.stringify({ status: 'error', message: 'Please enter a valid real email address' }) };
  }

  try {
    // 2. Aiven Database එකට සම්බන්ධ වීම
    const connection = await mysql.createConnection({
      host: 'mysql-f149e35-cineflix.l.aivencloud.com',
      port: 18408,
      user: 'avnadmin',
      password: 'AVNS_kHcyMX3jHgBvSRy4oDh',
      database: 'defaultdb',
      ssl: { rejectUnauthorized: false }
    });

    // 🔥 MAGIC FIX: Workbench නැතිව ඉබේම Table එක හදයි! 🔥
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          full_name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          google_id VARCHAR(255) DEFAULT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Manual Sign Up ක්‍රියාවලිය
    if (action === 'signup') {
      if (!full_name || !email || !password) {
        await connection.end();
        return { statusCode: 200, headers, body: JSON.stringify({ status: 'error', message: 'All fields are required' }) };
      }

      const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        await connection.end();
        return { statusCode: 200, headers, body: JSON.stringify({ status: 'error', message: 'This email is already registered. Please Log In.' }) };
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

    // 4. Manual Log In ක්‍රියාවලිය
    if (action === 'login') {
      if (!email || !password) {
        await connection.end();
        return { statusCode: 200, headers, body: JSON.stringify({ status: 'error', message: 'All fields are required' }) };
      }

      const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        await connection.end();
        return { statusCode: 200, headers, body: JSON.stringify({ status: 'error', message: 'Email not found. Please Sign Up first.' }) };
      }

      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password);
      await connection.end();

      if (!isMatch) {
        return { statusCode: 200, headers, body: JSON.stringify({ status: 'error', message: 'Incorrect password!' }) };
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

    // 5. Google Auth ක්‍රියාවලිය
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
    return { statusCode: 200, headers, body: JSON.stringify({ status: 'error', message: 'Invalid action' }) };
  } catch (error) {
    // මොකක් හරි Database අවුලක් ආවොත් කෙලින්ම Screen එකේ පෙන්නයි
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'error', message: "DB Error: " + (error.message || String(error)) })
    };
  }
};