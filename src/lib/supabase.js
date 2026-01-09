import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// AUTHENTICATION HELPERS
// ============================================================================

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{data, error}>}
 */
export async function signUpUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Sign up error:', error.message);
    return { data: null, error };
  }
}

/**
 * Sign in a user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{data, error}>}
 */
export async function signInUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error.message);
    return { data: null, error };
  }
}

/**
 * Sign in with OAuth provider
 * @param {string} provider - OAuth provider (google, github, etc.)
 * @returns {Promise<{data, error}>}
 */
export async function signInWithOAuth(provider) {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('OAuth sign in error:', error.message);
    return { data: null, error };
  }
}

/**
 * Sign out the current user
 * @returns {Promise<{error}>}
 */
export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error.message);
    return { error };
  }
}

/**
 * Get the current user session
 * @returns {Promise<{data, error}>}
 */
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    return { user, error: null };
  } catch (error) {
    console.error('Get current user error:', error.message);
    return { user: null, error };
  }
}

/**
 * Get the current session
 * @returns {Promise<{data, error}>}
 */
export async function getSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    return { session, error: null };
  } catch (error) {
    console.error('Get session error:', error.message);
    return { session: null, error };
  }
}

/**
 * Reset password for a user
 * @param {string} email - User email
 * @returns {Promise<{data, error}>}
 */
export async function resetPassword(email) {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Reset password error:', error.message);
    return { data: null, error };
  }
}

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<{data, error}>}
 */
export async function updatePassword(newPassword) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Update password error:', error.message);
    return { data: null, error };
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTION HANDLERS
// ============================================================================

/**
 * Subscribe to changes in a database table
 * @param {string} tableName - Name of the table to subscribe to
 * @param {object} options - Subscription options (filter, event, etc.)
 * @param {function} callback - Callback function for changes
 * @returns {object} - Subscription object with unsubscribe method
 */
export function subscribeToTable(tableName, callback, options = {}) {
  try {
    const subscription = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        {
          event: options.event || '*',
          schema: 'public',
          table: tableName,
          filter: options.filter,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to ${tableName}`);
        } else if (status === 'CLOSED') {
          console.log(`Unsubscribed from ${tableName}`);
        }
      });

    return subscription;
  } catch (error) {
    console.error(`Subscription error for ${tableName}:`, error.message);
    return null;
  }
}

/**
 * Subscribe to INSERT events on a table
 * @param {string} tableName - Name of the table
 * @param {function} callback - Callback function
 * @returns {object} - Subscription object
 */
export function subscribeToInserts(tableName, callback) {
  return subscribeToTable(tableName, callback, { event: 'INSERT' });
}

/**
 * Subscribe to UPDATE events on a table
 * @param {string} tableName - Name of the table
 * @param {function} callback - Callback function
 * @returns {object} - Subscription object
 */
export function subscribeToUpdates(tableName, callback) {
  return subscribeToTable(tableName, callback, { event: 'UPDATE' });
}

/**
 * Subscribe to DELETE events on a table
 * @param {string} tableName - Name of the table
 * @param {function} callback - Callback function
 * @returns {object} - Subscription object
 */
export function subscribeToDeletes(tableName, callback) {
  return subscribeToTable(tableName, callback, { event: 'DELETE' });
}

/**
 * Unsubscribe from a real-time channel
 * @param {object} subscription - Subscription object
 * @returns {Promise<string>} - Unsubscribe status
 */
export async function unsubscribeFromChannel(subscription) {
  try {
    if (subscription) {
      return await supabase.removeChannel(subscription);
    }
  } catch (error) {
    console.error('Unsubscribe error:', error.message);
  }
}

// ============================================================================
// STORAGE FUNCTIONS
// ============================================================================

/**
 * Upload a file to Supabase Storage
 * @param {string} bucketName - Name of the storage bucket
 * @param {string} filePath - Path where file will be stored
 * @param {File} file - File object to upload
 * @param {object} options - Additional options (cacheControl, contentType, etc.)
 * @returns {Promise<{data, error}>}
 */
export async function uploadFile(bucketName, filePath, file, options = {}) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: options.cacheControl || '3600',
        upsert: options.upsert || false,
        contentType: options.contentType,
      });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('File upload error:', error.message);
    return { data: null, error };
  }
}

/**
 * Download a file from Supabase Storage
 * @param {string} bucketName - Name of the storage bucket
 * @param {string} filePath - Path of the file to download
 * @returns {Promise<{data, error}>}
 */
export async function downloadFile(bucketName, filePath) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('File download error:', error.message);
    return { data: null, error };
  }
}

/**
 * Get public URL for a file in Supabase Storage
 * @param {string} bucketName - Name of the storage bucket
 * @param {string} filePath - Path of the file
 * @returns {object} - Object with publicUrl property
 */
export function getPublicFileUrl(bucketName, filePath) {
  try {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return { publicUrl: data.publicUrl, error: null };
  } catch (error) {
    console.error('Get public URL error:', error.message);
    return { publicUrl: null, error };
  }
}

/**
 * Delete a file from Supabase Storage
 * @param {string} bucketName - Name of the storage bucket
 * @param {string} filePath - Path of the file to delete
 * @returns {Promise<{data, error}>}
 */
export async function deleteFile(bucketName, filePath) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('File delete error:', error.message);
    return { data: null, error };
  }
}

/**
 * List files in a Supabase Storage bucket
 * @param {string} bucketName - Name of the storage bucket
 * @param {string} folderPath - Path of the folder to list (optional)
 * @param {object} options - Additional options (limit, offset, sortBy, etc.)
 * @returns {Promise<{data, error}>}
 */
export async function listFiles(bucketName, folderPath = '', options = {}) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath, {
        limit: options.limit || 100,
        offset: options.offset || 0,
        sortBy: options.sortBy || { column: 'name', order: 'asc' },
      });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('List files error:', error.message);
    return { data: null, error };
  }
}

/**
 * Replace a file in Supabase Storage
 * @param {string} bucketName - Name of the storage bucket
 * @param {string} filePath - Path where file will be stored
 * @param {File} file - File object to upload
 * @param {object} options - Additional options
 * @returns {Promise<{data, error}>}
 */
export async function replaceFile(bucketName, filePath, file, options = {}) {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .update(filePath, file, {
        cacheControl: options.cacheControl || '3600',
        contentType: options.contentType,
      });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('File replace error:', error.message);
    return { data: null, error };
  }
}

// ============================================================================
// DATABASE HELPERS (BONUS)
// ============================================================================

/**
 * Fetch data from a table with optional filters and options
 * @param {string} tableName - Name of the table
 * @param {object} options - Query options (select, filters, order, limit, etc.)
 * @returns {Promise<{data, error}>}
 */
export async function fetchData(tableName, options = {}) {
  try {
    let query = supabase.from(tableName).select(options.select || '*');

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else {
          query = query.eq(key, value);
        }
      });
    }

    if (options.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending !== false,
      });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Fetch data error:', error.message);
    return { data: null, error };
  }
}

/**
 * Insert data into a table
 * @param {string} tableName - Name of the table
 * @param {object} data - Data to insert
 * @returns {Promise<{data, error}>}
 */
export async function insertData(tableName, data) {
  try {
    const { data: result, error } = await supabase
      .from(tableName)
      .insert([data])
      .select();

    if (error) throw error;

    return { data: result, error: null };
  } catch (error) {
    console.error('Insert data error:', error.message);
    return { data: null, error };
  }
}

/**
 * Update data in a table
 * @param {string} tableName - Name of the table
 * @param {object} updates - Data to update
 * @param {object} filters - Filter conditions
 * @returns {Promise<{data, error}>}
 */
export async function updateData(tableName, updates, filters) {
  try {
    let query = supabase.from(tableName).update(updates);

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query.select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Update data error:', error.message);
    return { data: null, error };
  }
}

/**
 * Delete data from a table
 * @param {string} tableName - Name of the table
 * @param {object} filters - Filter conditions
 * @returns {Promise<{error}>}
 */
export async function deleteData(tableName, filters) {
  try {
    let query = supabase.from(tableName).delete();

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { error } = await query;

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error('Delete data error:', error.message);
    return { error };
  }
}

export default supabase;
