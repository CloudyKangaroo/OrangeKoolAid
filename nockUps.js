var nock = require('nock');
var nockOptions = {allowUnmocked: true};
//nock.disableNetConnect();
nock.recorder.rec(true);
/*
nock('https://portal.contegix.com:443', nockOptions)
  .get('/api/2.0/?method=device.get&device_id=0&modules=1&require_ip=1&metadata=1')
  .reply(200, "{\"status\":false,\"error_code\":1,\"error_message\":\"request failed: No device specified\",\"data\":\"\"}", {
    server: 'Cache',
    'x-powered-by': 'OrangeKoolAid',
    'set-cookie':
      [ 'UBERSID=2jjk5n1qcpc86il2fc19bdsc32; path=/; secure; HttpOnly',
        'UBERSID=qv609j5ag1vhs2k6f0e2haphc6; path=/; secure; HttpOnly',
        'authchallenge=cc8bc860d76e40f79515ab274089cadd; path=/' ],
    expires: 'Thu, 19 Nov 1981 08:52:00 GMT',
    'cache-control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
    pragma: 'no-cache',
    vary: 'Accept-Encoding',
    'content-length': '95',
    'keep-alive': 'timeout=5, max=36',
    connection: 'Keep-Alive',
    'content-type': 'application/json' });
*/