import http from 'http';
const server = http.createServer((req,res)=>{
    console.log(`[Auth Service] Received request at ${req.url}`);
    console.log(`[Auth Service] Injected Client IP (X-Forwarded-For): ${req.headers['x-forwarded-for'] || 'Direct Request'}`);

    if (req.url === '/auth/login' && req.method === 'POST') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            success: true, 
            message: "Authentication successful!", 
            token: "mock-jwt-token-xyz123" 
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Route not found in Auth Service" }));
    }
});
const port =5001;
server.listen(port,()=>{
    console.log(`Auth Microservice running on http://localhost:${port}`);
});