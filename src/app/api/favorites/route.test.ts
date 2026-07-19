import { beforeEach, describe, expect, it, vi } from 'vitest';

const getUser = vi.fn();

vi.mock('@/lib/supabase/config', () => ({
  isSupabaseConfigured: () => true,
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser },
  }),
}));

describe('/api/favorites auth guard', () => {
  beforeEach(() => {
    getUser.mockReset();
    getUser.mockResolvedValue({ data: { user: null } });
    vi.resetModules();
  });

  it('GET returns 401 when there is no session', async () => {
    const { GET } = await import('@/app/api/favorites/route');
    const response = await GET(new Request('http://localhost/api/favorites'));
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Unauthorized' });
  });

  it('POST returns 401 when there is no session', async () => {
    const { POST } = await import('@/app/api/favorites/route');
    const response = await POST(
      new Request('http://localhost/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemId: 'dnd5e-srd', keyword: 'Advantage' }),
      }),
    );
    expect(response.status).toBe(401);
  });
});
