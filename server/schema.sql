-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  google_sub VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  picture VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount NUMERIC(10, 2) NOT NULL,
  reference VARCHAR(255),
  description TEXT,
  category VARCHAR(50),
  transaction_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bills table
CREATE TABLE bills (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  is_paid BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goals table
CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  target_amount NUMERIC(10, 2) NOT NULL,
  current_amount NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Businesses table
CREATE TABLE businesses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
