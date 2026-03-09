import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const dbPath = process.env.DATABASE_PATH || "pesquisas.db";
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS pesquisas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    age TEXT,
    favor TEXT,
    importance TEXT,
    updated TEXT,
    covid TEXT,
    doses TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Migration: Add missing columns if they don't exist
const tableInfo = db.prepare("PRAGMA table_info(pesquisas)").all() as any[];
const existingColumns = tableInfo.map(col => col.name);

const requiredColumns = [
  { name: 'last_5_years', type: 'TEXT' },
  { name: 'trust', type: 'TEXT' },
  { name: 'influence', type: 'TEXT' },
  { name: 'skipped', type: 'TEXT' },
  { name: 'skipped_reason', type: 'TEXT' },
  { name: 'why_not_vax', type: 'TEXT' },
  { name: 'campaigns', type: 'TEXT' }
];

requiredColumns.forEach(col => {
  if (!existingColumns.includes(col.name)) {
    db.exec(`ALTER TABLE pesquisas ADD COLUMN ${col.name} ${col.type}`);
    console.log(`Migration: Added column ${col.name} to pesquisas table`);
  }
});

// Seed initial data if empty - REMOVED TO START FROM ZERO
/*
const count = db.prepare("SELECT COUNT(*) as count FROM pesquisas").get() as { count: number };
if (count.count === 0) {
  const initialData = [
    { age: '18 a 25 anos', favor: 'Sim', importance: 'Sim', updated: 'Sim', covid: 'Sim', doses: '3 doses', trust: 'Sim', last_5_years: '3 a 4 vacinas', campaigns: 'Sim' },
    { age: '26 a 35 anos', favor: 'Sim', importance: 'Sim', updated: 'Não', covid: 'Sim', doses: '2 doses', trust: 'Sim', last_5_years: '1 a 2 vacinas', campaigns: 'Sim' },
    { age: '46 a 60 anos', favor: 'Em parte', importance: 'Sim', updated: 'Sim', covid: 'Sim', doses: '4 ou mais doses', trust: 'Parcialmente', last_5_years: '5 ou mais vacinas', campaigns: 'Sim' },
    { age: 'Mais de 60 anos', favor: 'Sim', importance: 'Sim', updated: 'Sim', covid: 'Sim', doses: '4 ou mais doses', trust: 'Sim', last_5_years: '5 ou mais vacinas', campaigns: 'Sim' },
    { age: '18 a 25 anos', favor: 'Não', importance: 'Não', updated: 'Não', covid: 'Não', doses: '-', trust: 'Não', last_5_years: 'Nenhuma', campaigns: 'Não' },
    { age: '36 a 45 anos', favor: 'Sim', importance: 'Sim', updated: 'Sim', covid: 'Sim', doses: '3 doses', trust: 'Sim', last_5_years: '3 a 4 vacinas', campaigns: 'Sim' },
    { age: '26 a 35 anos', favor: 'Em parte', importance: 'Não tenho certeza', updated: 'Não sei', covid: 'Sim', doses: '1 dose', trust: 'Parcialmente', last_5_years: '1 a 2 vacinas', campaigns: 'Talvez' },
  ];

  const insert = db.prepare(`
    INSERT INTO pesquisas (age, favor, importance, updated, covid, doses, trust, last_5_years, campaigns)
    VALUES (@age, @favor, @importance, @updated, @covid, @doses, @trust, @last_5_years, @campaigns)
  `);

  initialData.forEach(data => insert.run(data));
}
*/

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const httpServer = createServer(app);

  app.use(express.json());

  // WebSocket Server
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);

    // Only handle our WebSocket connection, let Vite handle its own
    if (pathname === '/') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");
    // Send current state to new client
    const allSurveys = db.prepare("SELECT * FROM pesquisas ORDER BY id DESC").all();
    ws.send(JSON.stringify({ type: "INITIAL_DATA", data: allSurveys }));
  });

  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // API Routes
  app.get("/api/surveys", (req, res) => {
    const allSurveys = db.prepare("SELECT * FROM pesquisas ORDER BY id DESC").all();
    res.json(allSurveys);
  });

  app.post("/api/surveys", (req, res) => {
    const { 
      age, favor, importance, updated, covid, doses, 
      last_5_years, trust, influence, skipped, 
      skipped_reason, why_not_vax, campaigns 
    } = req.body;
    
    const info = db.prepare(`
      INSERT INTO pesquisas (
        age, favor, importance, updated, covid, doses, 
        last_5_years, trust, influence, skipped, 
        skipped_reason, why_not_vax, campaigns
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      age, favor, importance, updated, covid, doses, 
      last_5_years, trust, influence, skipped, 
      skipped_reason, why_not_vax, campaigns
    );

    const newSurvey = db.prepare("SELECT * FROM pesquisas WHERE id = ?").get(info.lastInsertRowid);
    
    // Broadcast to all clients
    broadcast({ type: "NEW_SURVEY", data: newSurvey });
    
    res.status(201).json(newSurvey);
  });

  app.post("/api/surveys/reset", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || '021601';
    console.log(`[RESET] Request received at ${new Date().toISOString()}`);
    
    if (password !== adminPassword) {
      console.log("[RESET] Invalid password attempt");
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    try {
      console.log("[RESET] Clearing 'pesquisas' table...");
      db.prepare("DELETE FROM pesquisas").run();
      
      // Reset auto-increment safely
      try {
        db.prepare("DELETE FROM sqlite_sequence WHERE name='pesquisas'").run();
        console.log("[RESET] Auto-increment reset");
      } catch (seqError) {
        console.log("[RESET] sqlite_sequence not found or not needed, skipping reset");
      }
      
      console.log("[RESET] Database reset successful");
      broadcast({ type: "INITIAL_DATA", data: [] });
      res.json({ status: "success" });
    } catch (error) {
      console.error("[RESET] Critical error resetting database:", error);
      res.status(500).json({ error: "Erro interno ao resetar banco de dados" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  httpServer.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
