import { NextResponse } from 'next/server';

async function generateUploadToken(accessKey: string, secretKey: string, bucket: string): Promise<string> {
  const deadline = Math.floor(Date.now() / 1000) + 3600;

  const putPolicy = {
    scope: bucket,
    deadline: deadline,
  };

  const policyString = JSON.stringify(putPolicy);

  const encodedPolicy = Buffer.from(policyString).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secretKey),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    new TextEncoder().encode(encodedPolicy)
  );

  const signature = Buffer.from(signatureBuffer).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const uploadToken = `${accessKey}:${signature}:${encodedPolicy}`;

  console.log('[Upload] Token generated:', {
    accessKey: accessKey.substring(0, 4) + '...',
    bucket,
    deadline,
    policyString,
    encodedPolicy: encodedPolicy.substring(0, 20) + '...',
    signature: signature.substring(0, 10) + '...',
    tokenLength: uploadToken.length,
  });

  return uploadToken;
}

export async function POST() {
  try {
    const accessKey = process.env.QINIU_ACCESS_KEY;
    const secretKey = process.env.QINIU_SECRET_KEY;
    const bucket = process.env.QINIU_BUCKET_NAME;
    const domain = process.env.QINIU_DOMAIN;

    console.log('[Upload] Environment check:', {
      hasAccessKey: !!accessKey,
      hasSecretKey: !!secretKey,
      hasBucket: !!bucket,
      hasDomain: !!domain,
      accessKeyPrefix: accessKey?.substring(0, 4),
    });

    if (!accessKey || !secretKey || !bucket || !domain) {
      console.error('[Upload] Missing Qiniu configuration:', {
        QINIU_ACCESS_KEY: accessKey ? 'set' : 'MISSING',
        QINIU_SECRET_KEY: secretKey ? 'set' : 'MISSING',
        QINIU_BUCKET_NAME: bucket ? 'set' : 'MISSING',
        QINIU_DOMAIN: domain ? 'set' : 'MISSING',
      });
      return NextResponse.json({ error: 'Qiniu config missing' }, { status: 500 });
    }

    const uploadToken = await generateUploadToken(accessKey, secretKey, bucket);

    return NextResponse.json({
      uptoken: uploadToken,
      domain: domain,
    });
  } catch (error) {
    console.error('[Upload] Unexpected error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to generate uptoken'
    }, { status: 500 });
  }
}