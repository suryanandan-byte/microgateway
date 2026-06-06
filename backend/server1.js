import http from 'http';
const server = http.createServer((req,res)=>{
    console.log(`[Data Service] Received request at ${req.url}`);
    console.log(`[Data Service] Injected Client IP (X-Forwarded-For): ${req.headers['x-forwarded-for'] || 'Direct Request'}`);

    if (req.url === '/data/dashboard' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            success: true, 
            metrics: { activeUsers: 1420, dailyRevenue: "$4,250", serverStatus: "Optimal" } 
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Route not found in Data Service" }));
    }
});
const port =5002;
server.listen(port,()=>{
    console.log(`Data Microservice running on http://localhost:${port}`);
});