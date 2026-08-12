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
      await client.from('attendance').upsert({
        child_id: attendanceRecord.childId,
        date: attendanceRecord.date || new Date().toISOString().split('T')[0],
        status: attendanceRecord.status,
        check_time: attendanceRecord.checkTime,
        checked_by: attendanceRecord.checkedBy
      });
      console.log('⚡ Supabase DB: Attendance synced successfully');
    } catch (err) {
      console.warn('Supabase DB sync notice (Attendance):', err);
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

      await client.from('leave_requests').upsert({
        child_id: leaveReq.childId,
        leave_type: normalizedLeaveType,
        start_date: leaveReq.startDate,
        end_date: leaveReq.endDate,
        reason: leaveReq.reason,
        status: leaveReq.status || 'PENDING',
        remark: leaveReq.remark || null
      });
      console.log('⚡ Supabase DB: Leave Request synced successfully');
    } catch (err) {
      console.warn('Supabase DB sync notice (Leave Request):', err);
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
      console.warn('Supabase DB sync notice (Audit Log):', err);
    }
  }

  // LINE Messaging API Helper (Modern Replacement for Deprecated LINE Notify)
  async sendLineMessagingAPI(channelAccessToken, toUserIdOrGroupId, messageText) {
    if (!channelAccessToken || !toUserIdOrGroupId) return false;
    try {
      await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${channelAccessToken}`
        },
        body: JSON.stringify({
          to: toUserIdOrGroupId,
          messages: [
            {
              type: 'text',
              text: messageText
            }
          ]
        })
      });
      console.log('📲 Real LINE Messaging API Push sent successfully!');
      return true;
    } catch (err) {
      console.warn('LINE Messaging API Notice:', err);
      return false;
    }
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
