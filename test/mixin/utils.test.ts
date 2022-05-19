import forge from 'node-forge';
import Utils from '../../src/newClient/utils';

describe('Tests for utils', () => {
  test('base64 encode & decode should be url safe', () => {
    // buffer to base64
    expect(Utils.base64.RawURLEncode(Buffer.from('a'))).toMatch('YQ');
    expect(Utils.base64.RawURLEncode(Buffer.from('ab'))).toMatch('YWI');
    expect(Utils.base64.RawURLEncode(Buffer.from('abcde'))).toMatch('YWJjZGU');
    expect(Utils.base64.RawURLEncode(Buffer.from('abcdefghijklmnopqrstuvwxyz'))).toMatch('YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo');

    // string to base64
    expect(Utils.base64.RawURLEncode('abcdefghijklmnopqrstuvwxyz')).toMatch('YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo');

    // empty string to base64
    expect(Utils.base64.RawURLEncode('')).toMatch('');

    // base64 string to buffer
    let buf = Utils.base64.RawURLDecode('YQ');
    expect(buf.toString()).toMatch('a');
    buf = Utils.base64.RawURLDecode('YWI');
    expect(buf.toString()).toMatch('ab');
    buf = Utils.base64.RawURLDecode('YWJjZGU');
    expect(buf.toString()).toMatch('abcde');
    buf = Utils.base64.RawURLDecode('YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo');
    expect(buf.toString()).toMatch('abcdefghijklmnopqrstuvwxyz');

    // base64 buffer to string
    buf = Utils.base64.RawURLDecode(Buffer.from('YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXo'));
    expect(buf.toString()).toMatch('abcdefghijklmnopqrstuvwxyz');
  });

  test('tests for hashMembers', () => {
    let hash = Utils.multisig.hashMembers(['965e5c6e-434c-3fa9-b780-c50f43cd955c']);
    expect(hash).toBe('b9f49cf777dc4d03bc54cd1367eebca319f8603ea1ce18910d09e2c540c630d8');
    const ids = ['965e5c6e-434c-3fa9-b780-c50f43cd955c', 'd1e9ec7e-199d-4578-91a0-a69d9a7ba048'];
    hash = Utils.multisig.hashMembers(ids);
    expect(hash).toBe('6064ec68a229a7d2fe2be652d11477f21705a742e08b75564fd085650f1deaeb');
    const reverseIds = ['d1e9ec7e-199d-4578-91a0-a69d9a7ba048', '965e5c6e-434c-3fa9-b780-c50f43cd955c'];
    hash = Utils.multisig.hashMembers(reverseIds);
    expect(hash).toBe('6064ec68a229a7d2fe2be652d11477f21705a742e08b75564fd085650f1deaeb');

    // forge sha256 is not equal to jssha
    const key = ids.sort().join('');
    const md = forge.md.sha256.create();
    md.update(key, 'utf8');
    expect(md.digest().toHex()).toBe('cc24bdf9c9c6a9d96031568e66a6c56f800ac4fefc88061e4aea6ed0df5ac41a');
    const md1 = forge.md.sha512.create();
    md1.update(key);
    expect(md1.digest().toHex()).toBe('496c8f01925653803104c38b313068d4eb79d840c6ed9aa9576f896e71a0c6dad2ccc2634219339b90fffc7117fa7032f343200e1511805c8a4267b5f26a0ff5');
  });
});