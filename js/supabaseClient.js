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
    if (!client || !attendanceRecord) return;
    try {
      const payload = {
        child_id: attendanceRecord.childId,
        date: attendanceRecord.date,
        status: attendanceRecord.status,
        check_time: attendanceRecord.checkTime,
        checked_by: attendanceRecord.checkedBy
      };

      const { data: existingRows } = await client.from('attendance')
        .select('id')
        .eq('child_id', attendanceRecord.childId)
        .eq('date', payload.date);

      if (existingRows && existingRows.length > 0) {
        await client.from('attendance').update(payload).eq('id', existingRows[0].id);
        if (existingRows.length > 1) {
          for (let i = 1; i < existingRows.length; i++) {
            await client.from('attendance').delete().eq('id', existingRows[i].id);
          }
        }
      } else {
        await client.from('attendance').insert(payload);
      }
      console.log('⚡ Supabase DB: Attendance synced successfully');
    } catch (err) {
      console.warn('Supabase Attendance sync notice:', err);
    }
  }

  // Supabase Database Sync: Leave Request
  async syncLeaveRequestToDB(leaveReq) {
    const client = this.getClient();
    if (!client || !leaveReq) return;
    try {
      const payload = {
        child_id: leaveReq.childId,
        child_name: leaveReq.childName,
        parent_name: leaveReq.parentName,
        leave_type: leaveReq.leaveType,
        start_date: leaveReq.startDate,
        end_date: leaveReq.endDate,
        reason: leaveReq.reason,
        status: leaveReq.status || 'PENDING',
        remark: leaveReq.remark || null,
        approved_by: leaveReq.approvedBy || null
      };

      if (leaveReq.id && leaveReq.id.length > 10 && !leaveReq.id.startsWith('leave-')) {
        await client.from('leave_requests').update(payload).eq('id', leaveReq.id);
      } else {
        const { data: existing } = await client.from('leave_requests')
          .select('id')
          .eq('child_id', leaveReq.childId)
          .eq('start_date', leaveReq.startDate)
          .eq('reason', leaveReq.reason)
          .maybeSingle();

        if (existing && existing.id) {
          await client.from('leave_requests').update(payload).eq('id', existing.id);
          leaveReq.id = existing.id;
        } else {
          const { data: inserted } = await client.from('leave_requests').insert(payload).select('id').maybeSingle();
          if (inserted && inserted.id) {
            leaveReq.id = inserted.id;
          }
        }
      }
      console.log('⚡ Supabase DB: Leave Request synced successfully');
    } catch (err) {
      console.warn('Supabase Leave sync notice:', err);
    }
  }

  // Supabase Database Sync: Child Profile & Growth Data
  async syncChildToDB(child) {
    const client = this.getClient();
    if (!client || !child) return;
    try {
      const payload = {
        id: child.id,
        first_name: child.firstName,
        last_name: child.lastName,
        nickname: child.nickname,
        parent_name: child.parentName,
        parent_phone: child.parentPhone,
        parent_relation: child.parentRelation,
        height_cm: child.heightCm,
        weight_kg: child.weightKg,
        bmi: child.bmi,
        growth_status: child.growthStatus,
        parent_line_id: child.parentLineId
      };

      const { data } = await client.from('children').select('id').eq('id', child.id).maybeSingle();
      if (data && data.id) {
        await client.from('children').update(payload).eq('id', child.id);
      } else {
        await client.from('children').insert(payload);
      }
      console.log(`⚡ Supabase DB: Child (${child.id} ${child.nickname}) synced successfully`);
    } catch (err) {
      console.warn('Supabase child sync notice:', err);
    }
  }

  // Supabase Database Sync: Development Evaluation
  async syncDevelopmentRecordToDB(devRec) {
    const client = this.getClient();
    if (!client || !devRec) return;
    try {
      const payload = {
        child_id: devRec.childId,
        child_name: devRec.childName,
        term: devRec.term || '1/2569',
        eval_date: devRec.evalDate,
        physical_score: devRec.physicalScore,
        emotional_score: devRec.emotionalScore,
        social_score: devRec.socialScore,
        intellectual_score: devRec.intellectualScore,
        evaluator: devRec.evaluator,
        notes: devRec.notes
      };

      const { data } = await client.from('development_records').select('id').eq('child_id', devRec.childId).eq('term', payload.term).maybeSingle();
      if (data && data.id) {
        await client.from('development_records').update(payload).eq('id', data.id);
      } else {
        await client.from('development_records').insert(payload);
      }
      console.log(`⚡ Supabase DB: Development record for (${devRec.childId}) synced`);
    } catch (err) {
      console.warn('Supabase dev record sync notice:', err);
    }
  }

  // Supabase Database Sync: Announcement
  async syncAnnouncementToDB(ann) {
    const client = this.getClient();
    if (!client || !ann) return;
    try {
      await client.from('announcements').insert({
        title: ann.title,
        content: ann.content,
        target_class: ann.targetClass || 'ALL',
        author: ann.author,
        pinned: ann.pinned || false
      });
      console.log('⚡ Supabase DB: Announcement synced');
    } catch (err) {
      console.warn('Supabase Announcement sync notice:', err);
    }
  }

  // Supabase Database Sync: Activity
  async syncActivityToDB(act) {
    const client = this.getClient();
    if (!client || !act) return;
    try {
      await client.from('activities').insert({
        title: act.title,
        description: act.description,
        class_id: act.classId || 'class-bm',
        date: act.date,
        image: act.image || './assets/images/banner.png'
      });
      console.log('⚡ Supabase DB: Activity synced');
    } catch (err) {
      console.warn('Supabase Activity sync notice:', err);
    }
  }

  // Supabase Database Sync: Audit Log
  async syncAuditLogToDB(log) {
    const client = this.getClient();
    if (!client || !log) return;
    try {
      await client.from('audit_logs').insert({
        user_name: log.user,
        action: log.action,
        details: log.details
      });
    } catch (err) {
      console.warn('Supabase Audit Log sync notice:', err);
    }
  }

  // LINE Messaging API Helper
  async sendLineMessagingAPI(channelAccessToken, toUserIdOrGroupId, messageText) {
    if (!toUserIdOrGroupId || typeof toUserIdOrGroupId !== 'string') return false;
    const cleanToId = toUserIdOrGroupId.trim();
    // Validate LINE User ID (U...), Group ID (C...), or Room ID (R...)
    if (!/^[UCR][0-9a-fA-F]{10,}$/.test(cleanToId)) {
      console.warn(`[LINE Push] Invalid Target ID format: "${cleanToId}". LINE IDs must start with U (User), C (Group), or R (Room).`);
      return false;
    }

    const payload = {
      channelAccessToken: channelAccessToken || undefined,
      to: cleanToId,
      messageText: (messageText || '').trim()
    };

    if (!payload.messageText) return false;

    // 1. Try local/relative Netlify function first (if running on Netlify)
    try {
      const netlifyFnUrl = '/.netlify/functions/line-push';
      const res = await fetch(netlifyFnUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        console.log(`⚡ Netlify Local Function: Real LINE Push sent successfully to ${cleanToId}!`);
        return true;
      }
    } catch (e) {
      // Fallback to absolute production Netlify Function
    }

    // 2. Try Absolute Production Netlify Relay (Works 100% on localhost & all domains with CORS enabled)
    try {
      const prodRelayUrl = 'https://child-center-mis.netlify.app/.netlify/functions/line-push';
      const res = await fetch(prodRelayUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        console.log(`⚡ Production Netlify Relay: Real LINE Push sent successfully to ${cleanToId}!`);
        return true;
      } else {
        const errText = await res.text();
        console.warn(`[LINE Push Relay] Response status ${res.status}:`, errText);
      }
    } catch (e) {
      console.warn('Production Netlify Relay warning:', e);
    }

    // 3. Try Supabase Edge Function Relay (if available)
    if (SUPABASE_CONFIG && SUPABASE_CONFIG.url) {
      try {
        const edgeFnUrl = `${SUPABASE_CONFIG.url}/functions/v1/line-push`;
        const res = await fetch(edgeFnUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          console.log(`⚡ Supabase Edge Function: Real LINE Push sent to ${cleanToId}!`);
          return true;
        }
      } catch (e) {
        // Fallback
      }
    }

    console.log(`📲 Notification logged to local App Store state (Target: ${cleanToId}).`);
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

  // Supabase Database Fetch All Initial State for Multi-Device Sync
  async fetchAllCloudData() {
    const client = this.getClient();
    if (!client) return null;
    try {
      const [leavesRes, attRes, childrenRes, devRes, annRes, actRes, auditRes] = await Promise.all([
        client.from('leave_requests').select('*').order('submitted_at', { ascending: false }),
        client.from('attendance').select('*'),
        client.from('children').select('*'),
        client.from('development_records').select('*'),
        client.from('announcements').select('*').order('created_at', { ascending: false }),
        client.from('activities').select('*').order('created_at', { ascending: false }),
        client.from('audit_logs').select('*').order('created_at', { ascending: false })
      ]);
      return {
        leaveRequests: leavesRes.data || [],
        attendance: attRes.data || [],
        children: childrenRes.data || [],
        developmentRecords: devRes.data || [],
        announcements: annRes.data || [],
        activities: actRes.data || [],
        auditLogs: auditRes.data || []
      };
    } catch (err) {
      console.warn('Supabase DB fetch notice:', err);
      return null;
    }
  }
}

window.supabaseService = new SupabaseService();
