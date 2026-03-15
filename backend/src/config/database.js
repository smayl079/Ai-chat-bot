import { Pool } from 'pg';
import { MongoClient } from 'mongodb';
import { env } from './env.js';

let pgPool = null;
let pgColumns = new Set();
let mongoClient = null;
let mongoCollection = null;

function safeIdentifier(input, label) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(input)) {
    throw new Error(`${label} contains invalid characters.`);
  }
  return input;
}

function normalizeSkills(rawSkills) {
  if (!rawSkills) {
    return [];
  }

  if (Array.isArray(rawSkills)) {
    return rawSkills.map((item) => String(item)).filter(Boolean);
  }

  if (typeof rawSkills === 'string') {
    const trimmed = rawSkills.trim();
    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item)).filter(Boolean);
        }
      } catch {
        // Ignore JSON parsing errors and continue with comma parsing.
      }
    }

    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeExperience(experience, experienceYears) {
  if (experience && String(experience).trim()) {
    return String(experience).trim();
  }

  if (experienceYears !== null && experienceYears !== undefined && String(experienceYears).trim()) {
    return `${String(experienceYears).trim()} years`;
  }

  return 'N/A';
}

function normalizeEmployee(employee) {
  if (!employee) {
    return null;
  }

  const preferredName = employee.name || employee.full_name || employee.fullName;
  const computedName = [employee.first_name, employee.firstName, employee.last_name, employee.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return {
    name: (preferredName || computedName || 'Unknown').trim(),
    position: (employee.position || employee.job_title || employee.jobTitle || 'N/A').trim(),
    experience: normalizeExperience(employee.experience, employee.experience_years || employee.experienceYears),
    skills: normalizeSkills(employee.skills),
    location: (employee.location || 'N/A').trim(),
  };
}

function buildPostgresNameExpression() {
  if (pgColumns.has('name')) {
    return 'name';
  }

  if (pgColumns.has('full_name')) {
    return 'full_name';
  }

  if (pgColumns.has('first_name') || pgColumns.has('last_name')) {
    const firstNameExpr = pgColumns.has('first_name') ? 'first_name' : 'NULL::text';
    const lastNameExpr = pgColumns.has('last_name') ? 'last_name' : 'NULL::text';
    return `TRIM(CONCAT_WS(' ', COALESCE(${firstNameExpr}::text, ''), COALESCE(${lastNameExpr}::text, '')))`;
  }

  return null;
}

function buildPostgresSelectClause() {
  const nameExpr = buildPostgresNameExpression();
  if (!nameExpr) {
    throw new Error(
      'Employees table must include one of these columns: name, full_name, first_name/last_name.'
    );
  }

  const positionExpr = pgColumns.has('position')
    ? 'position'
    : pgColumns.has('job_title')
    ? 'job_title'
    : 'NULL::text';

  const experienceExpr = pgColumns.has('experience') ? 'experience' : 'NULL::text';
  const experienceYearsExpr = pgColumns.has('experience_years') ? 'experience_years' : 'NULL';
  const skillsExpr = pgColumns.has('skills') ? 'skills' : 'NULL';
  const locationExpr = pgColumns.has('location') ? 'location' : 'NULL::text';

  return {
    nameExpr,
    selectClause: `
      ${nameExpr} AS name,
      ${positionExpr} AS position,
      ${experienceExpr} AS experience,
      ${experienceYearsExpr} AS experience_years,
      ${skillsExpr} AS skills,
      ${locationExpr} AS location
    `,
  };
}

async function initializePostgres() {
  const tableName = safeIdentifier(env.postgres.employeeTable, 'EMPLOYEE_TABLE');

  pgPool = new Pool({
    connectionString: env.postgres.connectionString,
    max: 10,
    idleTimeoutMillis: 10000,
  });

  await pgPool.query('SELECT 1');

  const columnsResult = await pgPool.query(
    `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = current_schema()
      AND table_name = $1
    `,
    [tableName]
  );

  pgColumns = new Set(columnsResult.rows.map((row) => row.column_name));

  if (pgColumns.size === 0) {
    throw new Error(`Table '${tableName}' was not found in the current schema.`);
  }

  console.log(`PostgreSQL connected. Employee table: ${tableName}`);
}

async function initializeMongo() {
  const collectionName = safeIdentifier(env.mongodb.collection, 'MONGODB_COLLECTION');

  mongoClient = new MongoClient(env.mongodb.uri, {
    maxPoolSize: 10,
  });

  await mongoClient.connect();
  const db = mongoClient.db(env.mongodb.dbName);
  await db.command({ ping: 1 });

  mongoCollection = db.collection(collectionName);
  console.log(`MongoDB connected. Employee collection: ${collectionName}`);
}

export async function initializeDatabase() {
  if (env.dbType === 'none') {
    console.warn('No database configured (DB_TYPE=none). Employee lookups will return fallback responses.');
    return;
  }

  if (env.dbType === 'postgres') {
    await initializePostgres();
    return;
  }

  await initializeMongo();
}

async function findEmployeeByNamePostgres(name) {
  const tableName = safeIdentifier(env.postgres.employeeTable, 'EMPLOYEE_TABLE');
  const firstToken = name.split(/\s+/)[0] || name;

  const { nameExpr, selectClause } = buildPostgresSelectClause();

  const matchClauses = [`LOWER(${nameExpr}) = LOWER($1)`];

  if (pgColumns.has('first_name')) {
    matchClauses.push('LOWER(first_name) = LOWER($2)');
  }

  if (pgColumns.has('last_name')) {
    matchClauses.push('LOWER(last_name) = LOWER($2)');
  }

  const query = `
    SELECT
      ${selectClause}
    FROM ${tableName}
    WHERE ${matchClauses.join(' OR ')}
    LIMIT 1
  `;

  const exactMatch = await pgPool.query(query, [name, firstToken]);

  if (exactMatch.rows.length > 0) {
    return normalizeEmployee(exactMatch.rows[0]);
  }

  const fuzzyQuery = `
    SELECT
      ${selectClause}
    FROM ${tableName}
    WHERE LOWER(${nameExpr}) LIKE LOWER($1)
    LIMIT 1
  `;

  const fuzzyMatch = await pgPool.query(fuzzyQuery, [`%${name}%`]);

  if (fuzzyMatch.rows.length > 0) {
    return normalizeEmployee(fuzzyMatch.rows[0]);
  }

  return null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findEmployeeByNameMongo(name) {
  const firstToken = name.split(/\s+/)[0] || name;
  const escapedName = escapeRegExp(name);
  const escapedFirst = escapeRegExp(firstToken);

  const projection = {
    _id: 0,
    name: 1,
    fullName: 1,
    firstName: 1,
    lastName: 1,
    position: 1,
    jobTitle: 1,
    experience: 1,
    experienceYears: 1,
    skills: 1,
    location: 1,
  };

  const exactQuery = {
    $or: [
      { name: { $regex: new RegExp(`^${escapedName}$`, 'i') } },
      { fullName: { $regex: new RegExp(`^${escapedName}$`, 'i') } },
      { firstName: { $regex: new RegExp(`^${escapedFirst}$`, 'i') } },
      { lastName: { $regex: new RegExp(`^${escapedFirst}$`, 'i') } },
    ],
  };

  const exactMatch = await mongoCollection.findOne(exactQuery, { projection });

  if (exactMatch) {
    return normalizeEmployee(exactMatch);
  }

  const fuzzyQuery = {
    $or: [
      { name: { $regex: new RegExp(escapedName, 'i') } },
      { fullName: { $regex: new RegExp(escapedName, 'i') } },
    ],
  };

  const fuzzyMatch = await mongoCollection.findOne(fuzzyQuery, { projection });

  if (fuzzyMatch) {
    return normalizeEmployee(fuzzyMatch);
  }

  return null;
}

export async function findEmployeeByName(name) {
  if (!name || !String(name).trim()) {
    return null;
  }

  if (env.dbType === 'none') {
    return null;
  }

  if (env.dbType === 'postgres') {
    if (!pgPool) {
      return null;
    }
    return findEmployeeByNamePostgres(name.trim());
  }

  if (!mongoCollection) {
    return null;
  }

  return findEmployeeByNameMongo(name.trim());
}

export async function closeDatabase() {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }

  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    mongoCollection = null;
  }
}
