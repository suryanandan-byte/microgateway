
const ipBuckets = {};

const MAX_TOKENS = 5;
const REFILL_RATE_PER_SEC = 1;

function isRateLimited(clientIp) {
    const now = Date.now(); 
    
        if (!ipBuckets[clientIp]) {
        ipBuckets[clientIp] = {
            tokens: MAX_TOKENS,
            lastRefilled: now
        };
    }

    const bucket = ipBuckets[clientIp];

    // 2. Calculate how much time has passed since their last request
    const timePassedMs = now - bucket.lastRefilled;
    const timePassedSec = timePassedMs / 1000;

    // 3. Mathematically calculate how many new tokens they've earned since then
    const tokensToAdd = timePassedSec * REFILL_RATE_PER_SEC;
    
    // Update the token count, but never exceed the max capacity
    bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + tokensToAdd);
    bucket.lastRefilled = now; // Reset the timestamp clock

    // 4. Evaluate if they have enough tokens to proceed
    if (bucket.tokens >= 1) {
        bucket.tokens -= 1; // Consume 1 token for this request
        return false; // Not rate-limited! Allow traffic to pass.
    }

    // 5. If they have less than 1 token, block them
    return true; // Rate-limited! Block them at the gate.
}

export { isRateLimited };