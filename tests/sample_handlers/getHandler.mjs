// tests/sample_handlers/getHandler.mjs
export function GET(req, res) {
  res.status(200).json({ message: 'GET request successful', data: 'some data' });
}
