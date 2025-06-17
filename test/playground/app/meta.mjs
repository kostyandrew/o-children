import { meta } from 'o-children/request';

export function GET() {
    return { meta: meta().fromMiddleware };
}
