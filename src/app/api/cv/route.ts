import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { checkRateLimit, recordFailedAttempt } from '@/utils/security';

// Only accept POST — GET returns 405
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function POST(request: NextRequest) {
  // ── 1. Resolve client IP ──────────────────────────────────────
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  // ── 2. Check rate limit BEFORE doing anything else ───────────
  const limitCheck = checkRateLimit(ip);
  if (!limitCheck.allowed) {
    return NextResponse.json(
      {
        error: 'Too many failed attempts.',
        retryAfterSeconds: limitCheck.retryAfterSeconds,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(limitCheck.retryAfterSeconds ?? 900),
        },
      }
    );
  }

  // ── 3. Parse body ─────────────────────────────────────────────
  let password: string;
  try {
    const body = await request.json();
    password = String(body?.password ?? '');
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
  }

  // ── 4. Verify password (server-side hash comparison) ─────────
  const inputHash = createHash('sha256').update(password).digest('hex');
  const targetHash = process.env.CV_PASSWORD_HASH ?? '';

  if (!targetHash) {
    // Misconfigured server — fail safe
    console.error('[cv/route] CV_PASSWORD_HASH env var is not set.');
    return NextResponse.json({ error: 'Service unavailable.' }, { status: 503 });
  }

  if (inputHash !== targetHash) {
    const failResult = recordFailedAttempt(ip);
    return NextResponse.json(
      {
        error: 'Incorrect password.',
        attemptsLeft: failResult.attemptsLeft,
        locked: !failResult.allowed,
        retryAfterSeconds: failResult.retryAfterSeconds,
      },
      { status: 401 }
    );
  }

  // ── 5. Stream the PDF ─────────────────────────────────────────
  try {
    const cvPath = join(process.cwd(), 'private', 'Thenula_s_Resume.pdf');
    const cvBuffer = await readFile(cvPath);

    return new NextResponse(cvBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Thenula_Dewanmith_CV.pdf"',
        'Content-Length': String(cvBuffer.length),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err) {
    console.error('[cv/route] Failed to read CV file:', err);
    return NextResponse.json(
      { error: 'CV file is currently unavailable. Please try again later.' },
      { status: 500 }
    );
  }
}
