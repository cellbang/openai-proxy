import * as Server from 'http-proxy';
import { HttpHeaders } from '@malagu/web';
import { Middleware, CORS_MIDDLEWARE_PRIORITY, Context } from '@malagu/web/lib/node';
import { Component, PostConstruct, Value } from '@malagu/core';

interface OpenAIProxyOptions {
    defaultAPIKey?: string;
}

@Component(Middleware)
export class CodingProxyMiddleware implements Middleware {

    protected proxy: Server;

    @Value('openAIProxy')
    protected readonly options?: OpenAIProxyOptions;

    @PostConstruct()
    protected init(): void {
        this.proxy = Server.createProxy();
        this.proxy.on('proxyReq', proxyReq => {
            if (!proxyReq.hasHeader(HttpHeaders.AUTHORIZATION) && this.options?.defaultAPIKey) {
                proxyReq.setHeader(HttpHeaders.AUTHORIZATION, `Bearer ${this.options.defaultAPIKey}`);
            }
        });
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
