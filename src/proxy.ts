import * as Server from 'http-proxy';
import { HttpHeaders } from '@malagu/web';
import { Middleware, CORS_MIDDLEWARE_PRIORITY, Context } from '@malagu/web/lib/node';
import { Component, PostConstruct, Value } from '@malagu/core';

interface OpenAIProxyOptions {
    defaultAPIKeys?: string | string[];
}

@Component(Middleware)
export class CodingProxyMiddleware implements Middleware {

    protected proxy: Server;

    @Value('openAIProxy')
    protected readonly options?: OpenAIProxyOptions;

    protected apiKeys: string[];

    @PostConstruct()
    protected init(): void {
        if (this.options?.defaultAPIKeys) {
            this.apiKeys = Array.isArray(this.options.defaultAPIKeys) ? this.options?.defaultAPIKeys : this.options.defaultAPIKeys.split(',');
        }
        this.proxy = Server.createProxy();
        this.proxy.on('proxyReq', proxyReq => {
            if (this.useDefaultAPIKey(proxyReq.getHeader(HttpHeaders.AUTHORIZATION) as string)) {
                proxyReq.setHeader(HttpHeaders.AUTHORIZATION, `Bearer ${this.selectAPIKey()}`);
            }
        });
    }

    protected useDefaultAPIKey(authorization?: string): boolean {
        if (!authorization || authorization.includes('managed') || authorization.trim().includes('Bearer')) {
            return this.apiKeys.length > 0;
        }
        return false;
    }

    protected selectAPIKey(): string {
        const randomIndex = Math.floor(Math.random() * this.apiKeys.length);
        return this.apiKeys[randomIndex];
    }

    async handle(ctx: Context, next: () => Promise<void>): Promise<void> {
        const { request, response } = ctx;
        this.proxy.web(request, response, {
            target: 'https://api.openai.com',
              changeOrigin: true,
        });
        return;
    }
    priority = CORS_MIDDLEWARE_PRIORITY - 10;

}
