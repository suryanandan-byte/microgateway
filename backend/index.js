import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
const port = 8080;
const sslOptions ={
    key: fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'))
};
const server = https.createServer(sslOptions,(req,res)=>{
    console.log('[Gateway] Intercepted request:${req.method} ${req.url}');
    const clientIp = req.socket.remoteAddress;
    
    let targetPort =null;
    if(req.url.startsWith('/auth/login')){
        targetPort=5001;
    }
    else if(req.url.startsWith('/data/dashboard')){
        targetPort=5002;
    }
    if(!targetPort){
        res.writeHead(404,{'content-type':'application/json'});
        res.end(JSON.stringify({error:"SERVICE NOT FOUND"}));
        return;
    }
    const proxyOptions={
        hostname:'Localhost',
        port:targetPort,
        path:req.url,
        method:req.method,
        headers:{
            ...req.headers,
            'X-Forwarded-For':clientIp
        }
    };
    const proxyServer=http.request(proxyOptions,(proxyRes)=>{
        res.writeHead(proxyRes.statusCode,proxyRes.headers);
        proxyRes.pipe(res);
    })
    proxyServer.on('error', (err) => {
        console.error(`[Gateway Error] Failed to connect to port ${targetPort}:`, err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Gateway Error: Bad Gateway (Target service is offline)" }));
    });
    req.pipe(proxyServer);
});
server.listen(port,()=>{
    console.log(`API Gateway running on http://localhost:${port}`);
});