import { App, staticFiles, trailingSlashes } from "fresh";
import { define, type State } from "./utils.ts";

export const app = new App<State>();

app.use(trailingSlashes("never"))
app.use(staticFiles());

// Pass a shared value from a middleware
app.use(async (ctx) => {
    ctx.state.shared = "hello";
    return await ctx.next();
});

const exampleLoggerMiddleware = define.middleware(async (ctx) => {
    const start = Date.now();
    const req = ctx.req;
    
    // Basic request info
    const method = req.method;
    const url = req.url;
    const timestamp = new Date().toISOString();
    
    // Referrer - where the visitor came from
    const referrer = req.headers.get("referer") || req.headers.get("referrer") || "direct";
    
    // User Agent - browser/bot information
    const userAgent = req.headers.get("user-agent") || "unknown";
    
    // Language preference
    const language = req.headers.get("accept-language")?.split(",")[0] || "unknown";
    
    // Additional useful headers
    const acceptEncoding = req.headers.get("accept-encoding") || "none";
    const connection = req.headers.get("connection") || "unknown";
    
    // Response time
    const duration = Date.now() - start;
    
    const isLikelyBot = (userAgent: string): boolean => {
        const botPatterns = [
            /bot/i, /crawler/i, /spider/i, /scraper/i,
            /headless/i, /phantom/i, /selenium/i,
            /curl/i, /wget/i, /python/i
        ];
        return botPatterns.some(pattern => pattern.test(userAgent));
    };
    
    const likelyBot = isLikelyBot(userAgent);
    // const likelyBot = true;
    
    console.log(`${likelyBot ? "[BOT LIKELY] " : ""}[${method}] ${referrer} -> ${url} in (${duration}ms) | Language: ${language} | User-Agent: ${userAgent} | Accept-Encoding: ${acceptEncoding} | Connection: ${connection}`);

    return ctx.next();
});
app.use(exampleLoggerMiddleware);

// Include file-system based routes here
app.fsRoutes();
