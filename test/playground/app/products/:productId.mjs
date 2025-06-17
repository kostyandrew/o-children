import { params } from 'o-children/request';

export function GET() {
    return { id: params().get('productId') };
}
