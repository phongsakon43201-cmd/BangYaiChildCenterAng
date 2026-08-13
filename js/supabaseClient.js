/* ==========================================================================
   Bang Yai Child Development Center MIS - Supabase Client Integration
   Supabase Database & Authentication Service Provider
   ========================================================================== */

const SUPABASE_CONFIG = {
  url: "https://ytkplzdrckhprzfmemyy.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0a3BsemRyY2tocHJ6Zm1lbXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNjg0NTUsImV4cCI6MjEwMTk0NDQ1NX0.qE4S0ZUYMV1cGe5jucu5WFNfa_FV21xk6zb2dFYiuqU"
};

class SupabaseService {
  constructor() {
    this.client = null;
    this.init();
  }

  init() {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      console.log('✅ Supabase client initialized successfully with URL:', SUPABASE_CONFIG.url);
    } else {
      console.warn('⚠️ Supabase JS SDK not loaded yet. Will initialize on demand.');
    }
  }

  getClient() {
    if (!this.client && window.supabase) {
      this.client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    }
    return this.client;
  }

  // Supabase Auth: Sign In with Email & Password
  async signIn(email, password) {
    const client = this.getClient();
    if (!client) {
      return { error: { message: 'Supabase Client is not available' } };
    }
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email,
        password: password
      });
      return { data, error };
    } catch (err) {
      return { error: err };
    }
  }

  // Supabase Auth: Sign Up new user with role metadata
  async signUp(email, password, role, fullName) {
    const client = this.getClient();
    if (!client) {
      return { error: { message: 'Supabase Client is not available' } };
    }
    try {
      const { data, error } = await client.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            role: role,
            full_name: fullName
          }
        }
      });
      return { data, error };
    } catch (err) {
      return { error: err };
    }
  }

  // Supabase Auth: Sign Out
  async signOut() {
    const client = this.getClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('Supabase signout notice:', err);
      }
    }
  }

  // Supabase Auth: Get Current Session
  async getSession() {
    const client = this.getClient();
    if (!client) return null;
    try {
      const { data } = await client.auth.getSession();
      return data?.session || null;
    } catch (err) {
      return null;
    }
  }

  // Supabase Database Sync: Attendance
  async syncAttendanceToDB(attendanceRecord) {
    const client = this.getClient();
    if (!client) return;
    try {
      const { error } = await client.from('attendance').upsert({
        child_id: attendanceRecord.childId,
        date: attendanceRecord.date || new Date().toISOString().split('T')[0],
        status: attendanceRecord.status,
        check_time: attendanceRecord.checkTime,
        checked_by: attendanceRecord.checkedBy
      });
      if (!error) {
        console.log('⚡ Supabase DB: Attendance synced successfully');
      }
    } catch (err) {
      // Local state handles persistence cleanly
    }
  }

  // Supabase Database Sync: Leave Request
  async syncLeaveRequestToDB(leaveReq) {
    const client = this.getClient();
    if (!client) return;
    try {
      let normalizedLeaveType = leaveReq.leaveType || 'ลาป่วย';
      if (normalizedLeaveType === 'ลากิจ') normalizedLeaveType = 'ลากิจจำเป็น';
      if (normalizedLeaveType === 'อื่นๆ') normalizedLeaveType = 'ลาอื่นๆ';

      const { error } = await client.from('leave_requests').upsert({
        child_id: leaveReq.childId,
        leave_type: normalizedLeaveType,
        start_date: leaveReq.startDate,
        end_date: leaveReq.endDate,
        reason: leaveReq.reason,
        status: leaveReq.status || 'PENDING',
        remark: leaveReq.remark || null
      });
      if (!error) {
        console.log('⚡ Supabase DB: Leave Request synced successfully');
      }
    } catch (err) {
      // Local state handles persistence cleanly
    }
  }

  // Supabase Database Sync: Audit Log
  async syncAuditLogToDB(log) {
    const client = this.getClient();
    if (!client) return;
    try {
      await client.from('audit_logs').insert({
        user_name: log.user,
        action: log.action,
        details: log.details
      });
    } catch (err) {
      // Local state handles persistence cleanly
    }
  }

  // LINE Messaging API Helper (Modern Replacement for Deprecated LINE Notify)
  async sendLineMessagingAPI(channelAccessToken, toUserIdOrGroupId, messageText) {
    if (!channelAccessToken || !toUserIdOrGroupId) return false;
    const payload = {
      to: toUserIdOrGroupId,
      messages: [{ type: 'text', text: messageText }]
    };

    const lineEndpoint = 'https://api.line.me/v2/bot/message/push';

    // 1. Try Netlify Serverless Function Relay first (bypasses CORS 100% on Netlify)
    try {
      const netlifyFnUrl = '/.netlify/functions/line-push';
      const res = await fetch(netlifyFnUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelAccessToken, to: toUserIdOrGroupId, messageText })
      });
      if (res.ok) {
        console.log(`⚡ Netlify Function: Real LINE Push sent successfully to ${toUserIdOrGroupId}!`);
        return true;
      }
    } catch (e) {
      // Fallback to Supabase / CORS Proxies
    }

    // 2. Try Supabase Edge Function Relay (bypasses CORS 100%)
    if (SUPABASE_CONFIG && SUPABASE_CONFIG.url) {
      try {
        const edgeFnUrl = `${SUPABASE_CONFIG.url}/functions/v1/line-push`;
        const res = await fetch(edgeFnUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
          },
          body: JSON.stringify({ channelAccessToken, to: toUserIdOrGroupId, messageText })
        });
        if (res.ok) {
          console.log(`⚡ Supabase Edge Function: Real LINE Push sent to ${toUserIdOrGroupId}!`);
          return true;
        }
      } catch (e) {
        // Fallback to CORS proxies
      }
    }

    // 2. Fallback to CORS Proxy endpoints for client-side browser fetch
    const proxyUrls = [
      `https://thingproxy.freeboard.io/fetch/${lineEndpoint}`,
      `https://corsproxy.org/?${encodeURIComponent(lineEndpoint)}`,
      `https://corsproxy.io/?${encodeURIComponent(lineEndpoint)}`
    ];

    // Try direct fetch (if server environment)
    try {
      const res = await fetch(lineEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${channelAccessToken}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        console.log(`📲 Real LINE Messaging API Push sent successfully to ${toUserIdOrGroupId}!`);
        return true;
      }
    } catch (e) {
      // CORS block on direct fetch is expected in browser, continue to proxies
    }

    // Try CORS proxy endpoints
    for (const proxyUrl of proxyUrls) {
      try {
        const response = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${channelAccessToken}`
          },
          body: JSON.stringify(payload)
        });

        if (response && response.ok) {
          console.log(`📲 Real LINE Messaging API Push sent successfully via Proxy to ${toUserIdOrGroupId}!`);
          return true;
        }
      } catch (err) {
        // Continue to next proxy
      }
    }

    console.log('📲 Notification logged to local App Store state for active session.');
    return false;
  }
  // Supabase Database Realtime Channel Listener
  subscribeRealtimeDB(onDatabaseChange) {
    const client = this.getClient();
    if (!client) return null;
    try {
      const channel = client
        .channel('public-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public' },
          (payload) => {
            console.log('⚡ Supabase Realtime DB Event Received:', payload);
            if (typeof onDatabaseChange === 'function') {
              onDatabaseChange(payload);
            }
          }
        )
        .subscribe();
      console.log('📡 Supabase Realtime DB Subscription Active');
      return channel;
    } catch (err) {
      console.warn('Supabase Realtime notice:', err);
      return null;
    }
  }

  // Supabase Database Fetch All Initial State
  async fetchAllDBData() {
    const client = this.getClient();
    if (!client) return null;
    try {
      const [leavesRes, attRes, auditRes] = await Promise.all([
        client.from('leave_requests').select('*').order('submitted_at', { ascending: false }),
        client.from('attendance').select('*'),
        client.from('audit_logs').select('*').order('created_at', { ascending: false })
      ]);
      return {
        leaveRequests: leavesRes.data || [],
        attendance: attRes.data || [],
        auditLogs: auditRes.data || []
      };
    } catch (err) {
      console.warn('Supabase DB fetch notice:', err);
      return null;
    }
  }
}

window.supabaseService = new SupabaseService();
