const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const pgSession = require('connect-pg-simple')(session);

const agentsRouter = require('./service/agents');
const chatsRouter = require('./service/chats');
const cohortsRouter = require('./service/cohorts');
const componentsRouter = require('./service/components');
const historyRouter = require('./service/history');
const interactionsRouter = require('./service/interactions');
const invitesRouter = require('./service/invites');
const logsRouter = require('./service/logs');
const mailRouter = require('./service/mail');
const mediaRouter = require('./service/media');
const notificationsRouter = require('./service/notifications');
const partneringRouter = require('./service/partnering');
const personasRouter = require('./service/personas');
const rolesRouter = require('./service/roles');
const runsRouter = require('./service/runs');
const scenariosRouter = require('./service/scenarios');
const sessionRouter = require('./service/session');
const statusRouter = require('./service/status');
const tagsRouter = require('./service/tags');
const tracesRouter = require('./service/traces');

// (RW 4/3/2024) Disabling this as it may be contributing to certain slow response times
// for large queries.
// const { logRequestAndResponse } = require('./service/logs/middleware');
const { getDbConfig } = require('./util/dbConfig');
const { errorHandler } = require('./util/api');

const app = express();
const poolConfig = getDbConfig();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

app.use(
  session({
    secret: process.env['SESSION_SECRET'] || 'mit tsl teacher moments',
    resave: false,
    saveUninitialized: true,
    store: new pgSession({
      pool: new Pool(poolConfig),
      tableName: 'session'
    }),
    cookie: {
      httpOnly: false,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
  })
);

// (RW 4/3/2024) Disabling this as it may be contributing to certain slow response times
// for large queries.
// app.use(logRequestAndResponse);

app.use('/agents', agentsRouter);
app.use('/chats', chatsRouter);
app.use('/cohorts', cohortsRouter);
app.use('/components', componentsRouter);
app.use('/history', historyRouter);
app.use('/interactions', interactionsRouter);
app.use('/invites', invitesRouter);
app.use('/logs', logsRouter);
app.use('/mail', mailRouter);
app.use('/media', mediaRouter);
app.use('/notifications', notificationsRouter);
app.use('/partnering', partneringRouter);
app.use('/personas', personasRouter);
app.use('/roles', rolesRouter);
app.use('/runs', runsRouter);
app.use('/scenarios', scenariosRouter);
app.use('/session', sessionRouter);
app.use('/status', statusRouter);
app.use('/tags', tagsRouter);
app.use('/traces', tracesRouter);

// This handles 404 results from router -- answers all remaining requests
app.use((req, res, next) => {
  const e404 = new Error('API Endpoint not found');
  e404.status = 404;
  next(e404);
});
// This handles api errors that are thrown -- needs to be after all the endpoints
app.use(errorHandler);

const listener = express();
listener.use('/api', app);
module.exports = { listener, app };
